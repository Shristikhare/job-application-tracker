# Deployment Configuration Files

This directory contains all configuration files needed to deploy the Job Application Tracker to production.

## Files Overview

### Frontend Deployment (Vercel)

- **`frontend/vercel.json`** - Vercel deployment configuration
  - Specifies build command, output directory, and SPA routing rules
  - Handles all routes by redirecting to index.html for React Router

- **`frontend/.env.example`** - Environment variables template
  - `VITE_API_BASE` - Backend API URL (change for production)

- **`frontend/.vercelignore`** - Files to ignore during Vercel build

### Backend Deployment (Render)

- **`backend/build.sh`** - Build script for Render
  - Installs dependencies
  - Creates database tables using SQLAlchemy

- **`backend/.env.example`** - Environment variables template
  - Database connection string
  - JWT configuration
  - CORS settings for production domains

- **`backend/.renderignore`** - Files to ignore during Render build

### Project-Level Files

- **`render.yaml`** - Infrastructure-as-Code configuration for Render
  - Defines web service (backend)
  - Defines PostgreSQL database service
  - Specifies Python version and startup commands

- **`DEPLOYMENT.md`** - Comprehensive deployment guide
  - Step-by-step instructions for Vercel and Render
  - Environment variable setup
  - Troubleshooting guide
  - Production checklist

- **`deployment-helper.py`** - Python script to assist with deployment
  - Generates secure SECRET_KEY values
  - Creates deployment checklist (JSON)
  - Provides deployment summary and security notes

- **`.github/workflows/ci.yml`** - GitHub Actions CI/CD workflow
  - Runs backend tests and health checks
  - Builds frontend and verifies output
  - Performs security checks

## Quick Deploy

### 1. Frontend to Vercel

```bash
git push origin main
# Then:
# 1. Go to vercel.com
# 2. Click "New Project"
# 3. Import this GitHub repository
# 4. Select "frontend" as root directory
# 5. Add VITE_API_BASE environment variable
# 6. Deploy
```

### 2. Backend to Render

```bash
# Generate secrets first:
python deployment-helper.py

# Then:
# 1. Go to render.com
# 2. Create PostgreSQL database
# 3. Create web service
# 4. Set environment variables from render.yaml
# 5. Deploy
```

## Environment Variables

### Frontend (Vercel)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_BASE` | `https://api.yourdomain.com/api` | Backend API URL |

### Backend (Render)

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | PostgreSQL connection |
| `SECRET_KEY` | `(random hex string)` | JWT signing key |
| `CORS_ORIGINS` | `https://app.yourdomain.com` | Allowed origins |
| `ENVIRONMENT` | `production` | Environment type |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token expiry (1 day) |

## Security Checklist

Before deploying to production:

- [ ] Use a random, secure SECRET_KEY (generate with `deployment-helper.py`)
- [ ] Use a strong PostgreSQL password
- [ ] Set CORS_ORIGINS to your actual frontend domain
- [ ] Set ENVIRONMENT to "production"
- [ ] Enable HTTPS (automatic on both platforms)
- [ ] Never commit .env files with real secrets
- [ ] Use different secrets for development, staging, and production
- [ ] Regularly rotate secrets
- [ ] Monitor logs for suspicious activity
- [ ] Set up backups for PostgreSQL database

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor build deployments
- Check edge function performance
- Review error logs
- Manage custom domains

### Render Dashboard
- Monitor service health
- View logs
- Check database usage
- Manage backups

## Deployment URLs

After deployment, your services will be available at:

- **Frontend**: `https://<project-name>.vercel.app`
- **Backend**: `https://<service-name>.onrender.com`
- **Database**: PostgreSQL on Render (internal connection)

## Support & Documentation

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com/
- React/Vite Docs: https://vitejs.dev/

