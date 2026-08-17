# Job Application Tracker

A full-stack job application tracker built with FastAPI and React.

## Tech stack

- Backend: Python + FastAPI
- Frontend: React.js + Vite
- Database: PostgreSQL
- Auth: JWT
- Testing: Pytest
- Deployment: Render/Railway + Vercel

## Project structure

- backend/: FastAPI backend
- frontend/: React frontend

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Features

- **Authentication**: User registration and login with JWT tokens
- **Application Management**: Create, read, update, delete job applications
- **Dashboard**: Real-time metrics and analytics
- **Filters & Search**: Find applications by company, role, location, or status
- **Interview Tracking**: Log and track interview rounds per application
- **Resume Management**: Upload and version resumes for each application
- **Analytics**: Status distribution and pipeline insights
- **Reminders**: Set follow-up reminders with date tracking
- **Dark Mode**: Toggle between dark and light themes
- **CSV Export**: Export all applications to CSV for backup or sharing

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: PostgreSQL (Render)

Quick summary:
1. Push code to GitHub
2. Connect frontend to Vercel
3. Connect backend to Render
4. Set environment variables
5. Deploy!

## Suggested next steps

- Add PostgreSQL models and migrations
- Implement dashboard analytics
- Add reminder logic
- Integrate resume upload
- Add CI/CD pipeline
