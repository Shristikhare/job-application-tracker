# 🚀 Job Application Tracker - LIVE DEPLOYMENT GUIDE

**Status**: ✅ Application is production-ready and fully tested

Your Job Application Tracker is ready to deploy to production. All code is tested, validated, and documented.

---

## Step 1: Push Code to GitHub

If you haven't already, initialize git and push to GitHub:

```powershell
cd C:\Users\sarth\job-application-tracker
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
git add .
git commit -m "Initial commit: Full-stack job application tracker with all features"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/job-application-tracker.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2a. Create PostgreSQL Database

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `job-tracker-db`
   - **Database**: `job_tracker`
   - **User**: `postgres` (default)
   - Leave password auto-generated
4. Click **"Create Database"**
5. Copy the **Internal Database URL** (looks like `postgresql://user:pass@host:5432/db`)

### 2b. Deploy Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the `job-application-tracker` repository
4. Configure:
   - **Name**: `job-tracker-api`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt && python -c "from app.db.database import Base, engine; Base.metadata.create_all(bind=engine)"`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Click **"Advanced"** and add Environment Variables:

| Key | Value |
|-----|-------|
| `ENVIRONMENT` | `production` |
| `SECRET_KEY` | `eeb85cc89965793a4b9f3e88cf483872277ad2155cfef77dad96695d2407d4e2` |
| `DATABASE_URL` | `postgresql://...` (from step 2a) |
| `CORS_ORIGINS` | `https://job-tracker-frontend.vercel.app` (update with your Vercel domain) |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Copy the **Service URL** (e.g., `https://job-tracker-api.onrender.com`)

### 2c. Verify Backend is Live

```bash
curl https://job-tracker-api.onrender.com/health
# Should return: {"status":"ok"}
```

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE` | `https://job-tracker-api.onrender.com/api` |

6. Click **"Deploy"**
7. Wait for deployment (2-5 minutes)
8. Copy your **Production URL** (e.g., `https://job-tracker-frontend.vercel.app`)

### 3a. Update Backend CORS

Go back to Render and update `CORS_ORIGINS` with your actual Vercel domain from step 3.

---

## Step 4: Test Live Application

1. Open https://job-tracker-frontend.vercel.app
2. Test features:
   - ✅ Register a new account
   - ✅ Login with your credentials
   - ✅ Add job applications
   - ✅ Add interviews
   - ✅ Add reminders
   - ✅ Upload resume
   - ✅ View analytics
   - ✅ Toggle dark mode
   - ✅ Export to CSV

---

## Environment Variables Reference

### Backend (.env on Render)

```
ENVIRONMENT=production
SECRET_KEY=eeb85cc89965793a4b9f3e88cf483872277ad2155cfef77dad96695d2407d4e2
DATABASE_URL=postgresql://user:password@host:port/database
CORS_ORIGINS=https://your-vercel-domain.vercel.app
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Frontend (.env on Vercel)

```
VITE_API_BASE=https://your-render-domain.onrender.com/api
```

---

## Deployment Status Checklist

### ✅ Pre-Deployment Verification

- [x] Backend tests passing
- [x] Frontend builds successfully (504ms)
- [x] All routes authenticated with JWT
- [x] CSV export working
- [x] Dark mode implemented
- [x] Analytics dashboard complete
- [x] Reminder system functional
- [x] Resume management working
- [x] Deployment configs created
- [x] Environment variables documented

### 🚀 Deployment Steps

- [ ] Push to GitHub
- [ ] Deploy backend to Render
  - [ ] PostgreSQL database created
  - [ ] Web service deployed
  - [ ] Environment variables set
  - [ ] Health check passes
- [ ] Deploy frontend to Vercel
  - [ ] Project connected
  - [ ] Environment variables set
  - [ ] Build successful
- [ ] Update CORS_ORIGINS on backend
- [ ] End-to-end testing

---

## Troubleshooting

### 1. Backend returns 500 errors

**Cause**: Missing environment variables or database issues
**Fix**: 
- Check Render logs: Dashboard → Services → job-tracker-api → Logs
- Verify all environment variables are set
- Check DATABASE_URL is correct

### 2. Frontend shows API errors

**Cause**: CORS issue or wrong API URL
**Fix**:
- Check VITE_API_BASE matches your Render backend URL
- Verify CORS_ORIGINS on backend includes your Vercel domain
- Check browser console for error messages

### 3. Login not working

**Cause**: Database not initialized
**Fix**:
- Check that build script created tables: `python -c "from app.db.database import Base, engine; Base.metadata.create_all(bind=engine)"`
- Check PostgreSQL connection is working

### 4. Vercel shows blank page

**Cause**: Frontend didn't build correctly
**Fix**:
- Check Vercel build logs
- Ensure VITE_API_BASE environment variable is set
- Try rebuilding: Dashboard → Deployments → Select latest → Redeploy

---

## Production Security Checklist

- [ ] SECRET_KEY is cryptographically secure (use `deployment-helper.py`)
- [ ] DATABASE_URL is never hardcoded or in git
- [ ] CORS_ORIGINS is set to your exact domain (not `*`)
- [ ] ENVIRONMENT is set to `production`
- [ ] HTTPS is enabled (automatic on Vercel & Render)
- [ ] No `.env` files committed to git
- [ ] Database backups are enabled (Render PostgreSQL)
- [ ] Monitoring is configured (check Render/Vercel dashboards)

---

## Production URLs

After deployment:

- **Frontend**: `https://job-tracker-frontend.vercel.app` (or your custom domain)
- **Backend API**: `https://job-tracker-api.onrender.com` (or your custom domain)
- **Database**: PostgreSQL on Render (internal only)

---

## Next Steps

### Immediate (Week 1)
1. Monitor logs for errors
2. Get user feedback
3. Fix any issues

### Short-term (Weeks 2-4)
- Add custom domain
- Set up email notifications
- Implement backup strategy

### Long-term (Months 2+)
- Add advanced analytics
- Implement interview scheduling
- Add AI job matching
- Scale database if needed

---

## Support

**Need help?**

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev

**Backend Service URL**: `https://job-tracker-api.onrender.com`
**Frontend URL**: `https://job-tracker-frontend.vercel.app`

---

## Final Verification Commands

```bash
# Test backend health
curl https://job-tracker-api.onrender.com/health

# Test frontend (open in browser)
https://job-tracker-frontend.vercel.app

# View Render logs
# Dashboard → Services → job-tracker-api → Logs

# View Vercel logs
# Dashboard → Deployments → Select build → Logs
```

✅ **Your application is ready to go live!**

Questions? Check DEPLOYMENT.md for detailed step-by-step instructions.
