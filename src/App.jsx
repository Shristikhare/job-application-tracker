import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

const defaultApplications = [
  { company: 'Microsoft', role: 'Frontend Engineer', status: 'Interview', location: 'Remote' },
  { company: 'Google', role: 'Data Analyst', status: 'Applied', location: 'Bengaluru' },
  { company: 'Amazon', role: 'SDE-2', status: 'Assessment', location: 'Hyderabad' },
  { company: 'Stripe', role: 'Product Engineer', status: 'Selected', location: 'Remote' },
]

async function apiRequest(path, options = {}, token = '') {
  const headers = { ...(options.headers || {}) }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    throw new Error(typeof data === 'string' ? data : data.detail || 'Request failed')
  }

  return data
}

const statusOptions = ['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected']

const initialAuthForm = {
  name: '',
  email: '',
  password: '',
}

const initialAppForm = {
  company: '',
  role: '',
  location: '',
  jobUrl: '',
  appliedDate: '',
  status: 'Applied',
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('jobTrackerToken') || '')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('jobTrackerTheme')
    return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState(initialAuthForm)
  const [authMessage, setAuthMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applications, setApplications] = useState(defaultApplications)
  const [appForm, setAppForm] = useState(initialAppForm)
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    location: '',
    status: '',
  })
  const [selectedApplicationId, setSelectedApplicationId] = useState('')
  const [interviewForm, setInterviewForm] = useState({
    round: '',
    interview_date: '',
    notes: '',
    result: '',
  })
  const [interviews, setInterviews] = useState([])
  const [resumeForm, setResumeForm] = useState({ version: 'v1', file: null })
  const [resumes, setResumes] = useState([])
  const [reminderForm, setReminderForm] = useState({ title: '', description: '', reminder_date: '' })
  const [reminders, setReminders] = useState([])
  const [upcomingReminders, setUpcomingReminders] = useState([])
  const [isLoadingApplications, setIsLoadingApplications] = useState(false)

  useEffect(() => {
    localStorage.setItem('jobTrackerTheme', isDarkMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    if (token) {
      localStorage.setItem('jobTrackerToken', token)
      loadApplications(token)
    } else {
      localStorage.removeItem('jobTrackerToken')
      setApplications(defaultApplications)
    }
  }, [token])

  async function loadApplications(currentToken, currentFilters = filters) {
    setIsLoadingApplications(true)
    try {
      const params = new URLSearchParams()

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const queryString = params.toString()
      const data = await apiRequest(`/applications/${queryString ? `?${queryString}` : ''}`, {}, currentToken)

      if (Array.isArray(data) && data.length) {
        const mapped = data.map((item) => ({
          id: item.id,
          company: item.company,
          role: item.role,
          status: item.status || 'Applied',
          location: item.location || 'Remote',
        }))
        setApplications(mapped)
      } else {
        setApplications(defaultApplications)
      }
    } catch (error) {
      setApplications(defaultApplications)
    } finally {
      setIsLoadingApplications(false)
    }
  }

  const metrics = useMemo(() => {
    const total = applications.length
    const counts = {
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    }

    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1
    })

    return [
      { label: 'Total Applications', value: total },
      { label: 'Applied', value: counts.Applied },
      { label: 'Assessments', value: counts.Assessment },
      { label: 'Interviews', value: counts.Interview },
      { label: 'Selected', value: counts.Selected },
      { label: 'Rejected', value: counts.Rejected },
    ]
  }, [applications])

  const analytics = useMemo(() => {
    const totals = {
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    }

    applications.forEach((app) => {
      totals[app.status] = (totals[app.status] || 0) + 1
    })

    const total = applications.length || 1
    const leadingStatus = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]
    const interviewPipeline = totals.Interview + totals.Selected
    const interviewRate = Math.round((interviewPipeline / total) * 100)
    const strongestStage = leadingStatus ? `${leadingStatus[0]} (${leadingStatus[1]})` : 'No applications yet'

    return {
      totals,
      total,
      interviewPipeline,
      interviewRate,
      strongestStage,
    }
  }, [applications])

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setAuthMessage('')
    setIsSubmitting(true)

    try {
      const isRegister = authMode === 'register'
      const endpoint = isRegister ? '/auth/register' : '/auth/login'

      const payload = isRegister
        ? JSON.stringify({
            name: authForm.name,
            email: authForm.email,
            password: authForm.password,
          })
        : new URLSearchParams({
            username: authForm.email,
            password: authForm.password,
          })

      const data = await apiRequest(
        endpoint,
        {
          method: 'POST',
          body: payload,
          headers: isRegister ? { 'Content-Type': 'application/json' } : {},
        },
      )

      if (isRegister) {
        setAuthMode('login')
        setAuthForm({ ...initialAuthForm, email: authForm.email })
        setAuthMessage('Registration successful. Please log in.')
      } else {
        setToken(data.access_token)
        setAuthMessage('Logged in successfully.')
      }
    } catch (error) {
      setAuthMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleAuthChange(event) {
    const { name, value } = event.target
    setAuthForm((current) => ({ ...current, [name]: value }))
  }

  function handleAppChange(event) {
    const { name, value } = event.target
    setAppForm((current) => ({ ...current, [name]: value }))
  }

  function handleFilterChange(event) {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  async function handleApplyFilters(event) {
    event.preventDefault()
    await loadApplications(token, filters)
  }

  async function handleDeleteApplication(id) {
    if (!id || !token) return

    try {
      await apiRequest(`/applications/${id}`, { method: 'DELETE' }, token)
      const updated = applications.filter((app) => app.id !== id)
      setApplications(updated.length ? updated : defaultApplications)
      if (selectedApplicationId === id) {
        setSelectedApplicationId('')
        setInterviews([])
      }
      setAuthMessage('Application deleted.')
    } catch (error) {
      setAuthMessage(error.message)
    }
  }

  async function loadInterviews(applicationId) {
    if (!applicationId || !token) {
      setInterviews([])
      return
    }

    try {
      const data = await apiRequest(`/interviews/application/${applicationId}`, {}, token)
      setInterviews(Array.isArray(data) ? data : [])
    } catch (error) {
      setInterviews([])
    }
  }

  async function loadResumes(applicationId) {
    if (!applicationId || !token) {
      setResumes([])
      return
    }

    try {
      const data = await apiRequest(`/resumes/application/${applicationId}`, {}, token)
      setResumes(Array.isArray(data) ? data : [])
    } catch (error) {
      setResumes([])
    }
  }

  async function loadReminders(applicationId) {
    if (!applicationId || !token) {
      setReminders([])
      return
    }

    try {
      const data = await apiRequest(`/reminders/application/${applicationId}`, {}, token)
      setReminders(Array.isArray(data) ? data : [])
    } catch (error) {
      setReminders([])
    }
  }

  async function loadUpcomingReminders() {
    if (!token) {
      setUpcomingReminders([])
      return
    }

    try {
      const data = await apiRequest('/reminders/upcoming', {}, token)
      setUpcomingReminders(Array.isArray(data) ? data : [])
    } catch (error) {
      setUpcomingReminders([])
    }
  }

  async function handleAddApplication(event) {
    event.preventDefault()

    if (!appForm.company || !appForm.role || !appForm.appliedDate) {
      setAuthMessage('Company, role and applied date are required.')
      return
    }

    try {
      const payload = {
        company: appForm.company,
        role: appForm.role,
        location: appForm.location || 'Remote',
        job_url: appForm.jobUrl,
        applied_date: appForm.appliedDate,
        status: appForm.status,
      }

      const created = await apiRequest('/applications/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token)

      const appToAdd = {
        id: created.id,
        company: created.company,
        role: created.role,
        status: created.status || 'Applied',
        location: created.location || 'Remote',
      }

      setApplications((current) => [appToAdd, ...current])
      setAppForm(initialAppForm)
      setAuthMessage('Application saved.')
    } catch (error) {
      setAuthMessage(error.message)
    }
  }

  async function handleSelectApplication(applicationId) {
    setSelectedApplicationId(applicationId)
    await Promise.all([loadInterviews(applicationId), loadResumes(applicationId), loadReminders(applicationId)])
  }

  async function handleInterviewSubmit(event) {
    event.preventDefault()
    if (!selectedApplicationId) {
      setAuthMessage('Select an application first.')
      return
    }

    try {
      const payload = {
        round: interviewForm.round,
        interview_date: interviewForm.interview_date,
        notes: interviewForm.notes,
        result: interviewForm.result,
      }

      await apiRequest(`/interviews/application/${selectedApplicationId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token)

      setInterviewForm({ round: '', interview_date: '', notes: '', result: '' })
      setAuthMessage('Interview saved.')
      await loadInterviews(selectedApplicationId)
    } catch (error) {
      setAuthMessage(error.message)
    }
  }

  async function handleResumeSubmit(event) {
    event.preventDefault()
    if (!selectedApplicationId || !resumeForm.file) {
      setAuthMessage('Choose a resume file first.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', resumeForm.file)
      formData.append('version', resumeForm.version)

      await apiRequest(`/resumes/application/${selectedApplicationId}?version=${resumeForm.version}`, {
        method: 'POST',
        body: formData,
        headers: {},
      }, token)

      setResumeForm({ version: 'v1', file: null })
      setAuthMessage('Resume uploaded.')
      await loadResumes(selectedApplicationId)
    } catch (error) {
      setAuthMessage(error.message)
    }
  }

  async function handleReminderSubmit(event) {
    event.preventDefault()
    if (!selectedApplicationId || !reminderForm.title || !reminderForm.reminder_date) {
      setAuthMessage('Title and date are required.')
      return
    }

    try {
      const params = new URLSearchParams({
        title: reminderForm.title,
        description: reminderForm.description || '',
        reminder_date: reminderForm.reminder_date,
      })

      await apiRequest(`/reminders/application/${selectedApplicationId}?${params.toString()}`, {
        method: 'POST',
      }, token)

      setReminderForm({ title: '', description: '', reminder_date: '' })
      setAuthMessage('Reminder added.')
      await loadReminders(selectedApplicationId)
      await loadUpcomingReminders()
    } catch (error) {
      setAuthMessage(error.message)
    }
  }

  async function handleCompleteReminder(reminderId) {
    if (!reminderId) return

    try {
      await apiRequest(`/reminders/${reminderId}/complete`, { method: 'PUT' }, token)
      setAuthMessage('Reminder marked complete.')
      await loadReminders(selectedApplicationId)
      await loadUpcomingReminders()
    } catch (error) {
      setAuthMessage(error.message)
    }
  }

  function logout() {
    setToken('')
    setAuthForm(initialAuthForm)
    setAuthMode('login')
    setAuthMessage('')
  }

  function exportToCSV() {
    if (applications.length === 0) {
      setAuthMessage('No applications to export.')
      return
    }

    const headers = ['Company', 'Role', 'Location', 'Status', 'Applied Date']
    const rows = applications.map((app) => [
      app.company || '',
      app.role || '',
      app.location || 'Remote',
      app.status || 'Applied',
      app.applied_date || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `job-applications-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setAuthMessage('Applications exported to CSV.')
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="branding">
            <p className="eyebrow">Career dashboard</p>
            <h1>Job Application Tracker</h1>
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'active' : ''}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === 'register' && (
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={authForm.name}
                onChange={handleAuthChange}
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={authForm.email}
              onChange={handleAuthChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={authForm.password}
              onChange={handleAuthChange}
              required
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? authMode === 'login'
                  ? 'Logging in...'
                  : 'Creating account...'
                : authMode === 'login'
                  ? 'Login'
                  : 'Create account'}
            </button>
          </form>

          {authMessage && <p className="message">{authMessage}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Career dashboard</p>
          <h1>Job Application Tracker</h1>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            className="export-btn"
            onClick={exportToCSV}
            title="Export applications to CSV"
          >
            📥 Export
          </button>
          <button type="button" className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="metrics-grid">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </section>

      <section className="analytics-grid">
        <div className="panel analytics-panel">
          <h2>Application Status</h2>
          <div className="analytics-list">
            {statusOptions.map((status) => {
              const count = analytics.totals[status] || 0
              const width = Math.max((count / analytics.total) * 100, count ? 10 : 0)

              return (
                <div className="analytics-row" key={status}>
                  <div className="label-row">
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${width}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="panel summary-panel">
          <h2>Quick Summary</h2>
          <ul className="insights-list">
            <li>
              <span>Interview pipeline</span>
              <strong>{analytics.interviewPipeline}</strong>
            </li>
            <li>
              <span>Pipeline conversion</span>
              <strong>{analytics.interviewRate}%</strong>
            </li>
            <li>
              <span>Largest stage</span>
              <strong>{analytics.strongestStage}</strong>
            </li>
          </ul>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <h2>Add Application</h2>
          <form className="job-form" onSubmit={handleAddApplication}>
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={appForm.company}
              onChange={handleAppChange}
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={appForm.role}
              onChange={handleAppChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={appForm.location}
              onChange={handleAppChange}
            />
            <input
              type="url"
              name="jobUrl"
              placeholder="Job URL"
              value={appForm.jobUrl}
              onChange={handleAppChange}
            />
            <input
              type="date"
              name="appliedDate"
              value={appForm.appliedDate}
              onChange={handleAppChange}
            />
            <select name="status" value={appForm.status} onChange={handleAppChange}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button type="submit">Save application</button>
          </form>

          {authMessage && <p className="message inline-message">{authMessage}</p>}
          {isLoadingApplications && <p className="message inline-message">Loading applications...</p>}
        </div>

        <div className="panel">
          <h2>Search & Filters</h2>
          <form className="filter-form" onSubmit={handleApplyFilters}>
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={filters.company}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="role"
              placeholder="Job role"
              value={filters.role}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
            />
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button type="submit">Apply filters</button>
          </form>

          <h2 className="table-title">Recent Applications</h2>
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={`${app.company}-${app.role}-${index}`}>
                  <td>{app.company}</td>
                  <td>{app.role}</td>
                  <td>
                    <span className="status-pill">{app.status}</span>
                  </td>
                  <td>{app.location}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => handleSelectApplication(app.id)}
                      >
                        Interviews
                      </button>
                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() => handleDeleteApplication(app.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="interview-panel panel">
          <h2>Interview Tracker</h2>
          {!selectedApplicationId ? (
            <p className="message">Select an application to manage interviews.</p>
          ) : (
            <>
              <form className="interview-form" onSubmit={handleInterviewSubmit}>
                <input
                  type="text"
                  name="round"
                  placeholder="Interview round"
                  value={interviewForm.round}
                  onChange={(event) => setInterviewForm({ ...interviewForm, round: event.target.value })}
                />
                <input
                  type="date"
                  name="interview_date"
                  value={interviewForm.interview_date}
                  onChange={(event) => setInterviewForm({ ...interviewForm, interview_date: event.target.value })}
                />
                <input
                  type="text"
                  name="result"
                  placeholder="Result"
                  value={interviewForm.result}
                  onChange={(event) => setInterviewForm({ ...interviewForm, result: event.target.value })}
                />
                <textarea
                  name="notes"
                  placeholder="Interview notes"
                  value={interviewForm.notes}
                  onChange={(event) => setInterviewForm({ ...interviewForm, notes: event.target.value })}
                />
                <button type="submit">Add interview</button>
              </form>

              <div className="interview-list">
                {interviews.length === 0 ? (
                  <p className="message">No interviews recorded yet.</p>
                ) : (
                  interviews.map((item) => (
                    <div className="interview-item" key={item.id}>
                      <strong>{item.round}</strong>
                      <span>{item.interview_date}</span>
                      <span>{item.result || 'Pending'}</span>
                      <p>{item.notes || 'No notes provided.'}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="panel resume-panel">
          <h2>Resume Management</h2>
          {!selectedApplicationId ? (
            <p className="message">Select an application to attach resumes.</p>
          ) : (
            <>
              <form className="resume-form" onSubmit={handleResumeSubmit}>
                <input
                  type="text"
                  value={resumeForm.version}
                  onChange={(event) => setResumeForm({ ...resumeForm, version: event.target.value })}
                  placeholder="Resume version"
                />
                <input
                  type="file"
                  onChange={(event) => setResumeForm({ ...resumeForm, file: event.target.files?.[0] || null })}
                />
                <button type="submit">Upload resume</button>
              </form>

              <div className="resume-list">
                {resumes.length === 0 ? (
                  <p className="message">No resume uploaded yet.</p>
                ) : (
                  resumes.map((item) => (
                    <div className="resume-item" key={item.id}>
                      <strong>{item.file_name}</strong>
                      <span>Version: {item.version}</span>
                      <a href={item.file_url} target="_blank" rel="noreferrer">Open resume</a>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="panel reminder-panel">
          <h2>Reminders</h2>
          {!selectedApplicationId ? (
            <p className="message">Select an application to add reminders.</p>
          ) : (
            <>
              <form className="reminder-form" onSubmit={handleReminderSubmit}>
                <input
                  type="text"
                  placeholder="Reminder title"
                  value={reminderForm.title}
                  onChange={(event) => setReminderForm({ ...reminderForm, title: event.target.value })}
                />
                <input
                  type="datetime-local"
                  value={reminderForm.reminder_date}
                  onChange={(event) => setReminderForm({ ...reminderForm, reminder_date: event.target.value })}
                />
                <textarea
                  placeholder="Optional notes"
                  value={reminderForm.description}
                  onChange={(event) => setReminderForm({ ...reminderForm, description: event.target.value })}
                  className="reminder-textarea"
                />
                <button type="submit">Add reminder</button>
              </form>

              <div className="reminder-list">
                {reminders.length === 0 ? (
                  <p className="message">No reminders yet.</p>
                ) : (
                  reminders.map((reminder) => (
                    <div className="reminder-item" key={reminder.id}>
                      <div className="reminder-header">
                        <strong>{reminder.title}</strong>
                        <span>{new Date(reminder.reminder_date).toLocaleDateString()}</span>
                      </div>
                      {reminder.description && <p>{reminder.description}</p>}
                      {!reminder.is_completed && (
                        <button
                          type="button"
                          className="complete-btn"
                          onClick={() => handleCompleteReminder(reminder.id)}
                        >
                          Mark Done
                        </button>
                      )}
                      {reminder.is_completed && <span className="completed-badge">✓ Done</span>}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {upcomingReminders.length > 0 && (
        <section className="upcoming-section">
          <h2>Upcoming Reminders</h2>
          <div className="upcoming-grid">
            {upcomingReminders.map((reminder) => (
              <div className="upcoming-item" key={reminder.id}>
                <span className="reminder-date">{new Date(reminder.reminder_date).toLocaleDateString()}</span>
                <strong>{reminder.title}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default App
