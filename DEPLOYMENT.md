# Deployment Guide

This guide explains how to deploy the Job Application Tracker to production using **Vercel** (frontend) and **Render** (backend).

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier available at vercel.com)
- Render account (free tier available at render.com)
- PostgreSQL database (Render provides free tier)

## Frontend Deployment (Vercel)

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in or create a free account
3. Click "New Project"
4. Import your GitHub repository
5. Select the `frontend` directory as the root directory
6. Click "Deploy"

### Step 2: Configure Environment Variables

In the Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add the following variables for **Production**:
   - `VITE_API_BASE`: Your Render backend URL (e.g., `https://job-tracker-api.onrender.com/api`)

### Step 3: Deploy

Your frontend will automatically deploy whenever you push to the main branch.

**Deployed URL**: `https://<your-project-name>.vercel.app`

---

## Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

1. Go to [render.com](https://render.com)
2. Sign in or create a free account
3. Click "New +"
4. Select "PostgreSQL"
5. Choose a name (e.g., `job-tracker-db`)
6. Select the **Free** plan
7. Click "Create Database"
8. Note the **Internal Database URL** from the database details page

### Step 2: Deploy Backend Service

1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `job-tracker-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python -c "from app.db.database import Base, engine; Base.metadata.create_all(bind=engine)"`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

### Step 3: Set Environment Variables

In the Render dashboard for your Web Service:

1. Go to Environment
2. Add the following variables:
   - `DATABASE_URL`: Paste the PostgreSQL connection string from your database
   - `SECRET_KEY`: Generate a random string (e.g., using `python -c "import secrets; print(secrets.token_hex(32))"`)
   - `CORS_ORIGINS`: `https://<your-vercel-app>.vercel.app`
   - `ENVIRONMENT`: `production`
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `1440`

3. Click "Save"

### Step 4: Deploy

Render will automatically deploy when you push to GitHub.

**API URL**: `https://job-tracker-api.onrender.com`

---

## Verifying Deployment

### Test Frontend

1. Visit your Vercel deployment URL
2. Register a new account
3. Verify all features work (applications, interviews, reminders, etc.)

### Test Backend

1. Visit `https://job-tracker-api.onrender.com/health`
2. Should return: `{"status": "ok"}`

### Test API Connection

1. In your Vercel dashboard, verify the `VITE_API_BASE` environment variable is set correctly
2. Redeploy frontend if needed
3. Try logging in on your deployed app

---

## Production Checklist

Before going live, ensure:

- [ ] `SECRET_KEY` is a random string (not the default value)
- [ ] `CORS_ORIGINS` includes your Vercel domain
- [ ] `DATABASE_URL` points to your PostgreSQL database
- [ ] Environment is set to `production`
- [ ] Frontend `VITE_API_BASE` points to your Render backend
- [ ] Both services are on appropriate plans
- [ ] HTTPS is enabled (automatic on both platforms)

---

## Local Development

### Running Locally

1. **Backend**:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Access at `http://localhost:5173`

### Using Local Database

The app uses SQLite by default locally. To use PostgreSQL locally:

1. Install PostgreSQL
2. Create a database: `createdb job_tracker`
3. Set `DATABASE_URL` in `.env`: `postgresql://localhost/job_tracker`

---

## Troubleshooting

### Frontend deployment fails
- Check that the root directory is set to `frontend`
- Verify `vercel.json` exists in the frontend directory
- Check build logs in Vercel dashboard

### Backend deployment fails
- Verify `requirements.txt` is in the backend directory
- Check that environment variables are set correctly
- View logs in Render dashboard

### API connection fails
- Verify `VITE_API_BASE` is set correctly in Vercel
- Check `CORS_ORIGINS` in backend environment variables
- Ensure both services are running (check Render dashboard)

### Database connection fails
- Verify `DATABASE_URL` format is correct
- Check that PostgreSQL database is running on Render
- Ensure database credentials are correct

---

## Next Steps

After deployment:

1. Monitor your applications in both Vercel and Render dashboards
2. Set up error tracking (Sentry, DataDog, etc.)
3. Enable automatic backups for your PostgreSQL database
4. Consider adding a custom domain
5. Set up email notifications for reminders

