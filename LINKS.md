# 🔗 Job Application Tracker - Quick Links

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [LIVE_DEPLOYMENT_GUIDE.md](./LIVE_DEPLOYMENT_GUIDE.md) | **START HERE** - Step-by-step deployment walkthrough |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Detailed technical deployment instructions |
| [DEPLOYMENT_CONFIG.md](./DEPLOYMENT_CONFIG.md) | Configuration files reference |
| [README.md](./README.md) | Project features and overview |

---

## 🚀 Deployment Platforms

| Platform | Purpose | Link |
|----------|---------|------|
| **Vercel** | Frontend hosting | https://vercel.com/dashboard |
| **Render** | Backend hosting | https://dashboard.render.com |
| **GitHub** | Code repository | https://github.com (create new repo) |

---

## 🔑 Configuration Files

### Backend Configuration
- [backend/requirements.txt](./backend/requirements.txt) - Python dependencies
- [backend/.env.example](./backend/.env.example) - Environment variables template
- [backend/build.sh](./backend/build.sh) - Render build script
- [render.yaml](./render.yaml) - Infrastructure-as-Code for Render

### Frontend Configuration
- [frontend/package.json](./frontend/package.json) - Node dependencies
- [frontend/.env.example](./frontend/.env.example) - Environment variables template
- [frontend/vercel.json](./frontend/vercel.json) - Vercel deployment config
- [frontend/vite.config.js](./frontend/vite.config.js) - Vite build config

---

## 🛠️ Deployment Tools

| Tool | Purpose | Location |
|------|---------|----------|
| `deployment-helper.py` | Generate secrets & checklist | [./deployment-helper.py](./deployment-helper.py) |
| `deploy.sh` | Git setup script | [./deploy.sh](./deploy.sh) |
| GitHub Actions CI/CD | Automated testing | [./.github/workflows/ci.yml](./.github/workflows/ci.yml) |
| Deployment Checklist | Verification list | [./DEPLOYMENT_CHECKLIST.json](./DEPLOYMENT_CHECKLIST.json) |

---

## 📊 Project Structure

```
job-application-tracker/
├── backend/                    # FastAPI server
│   ├── app/
│   │   ├── main.py            # FastAPI app entry
│   │   ├── db/
│   │   │   ├── database.py    # SQLAlchemy config
│   │   ├── models/            # Database models
│   │   ├── api/routes/        # API endpoints
│   │   └── core/security.py   # JWT & auth
│   ├── requirements.txt        # Python deps
│   ├── build.sh              # Render build script
│   └── .env.example          # Env template
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── styles.css        # Theming & CSS
│   │   └── index.html        # Entry HTML
│   ├── package.json          # Node deps
│   ├── vite.config.js        # Vite config
│   ├── vercel.json           # Vercel config
│   └── .env.example          # Env template
│
├── .github/
│   └── workflows/ci.yml      # GitHub Actions
│
├── render.yaml               # Render infrastructure
├── DEPLOYMENT.md             # Full deployment guide
├── LIVE_DEPLOYMENT_GUIDE.md  # Quick start guide
└── deploy.sh                 # Git setup script
```

---

## 🔐 Environment Variables Quick Reference

### Backend (Render)
```
ENVIRONMENT=production
SECRET_KEY=<secure-random-key>
DATABASE_URL=postgresql://...
CORS_ORIGINS=https://your-vercel-app.vercel.app
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Frontend (Vercel)
```
VITE_API_BASE=https://your-render-api.onrender.com/api
```

---

## 📱 Testing & Health Checks

After deployment:

```bash
# Backend health check
curl https://<your-service>.onrender.com/health

# Frontend access
https://<your-project>.vercel.app

# API documentation (interactive)
https://<your-service>.onrender.com/docs
```

---

## 🔗 Live URLs (After Deployment)

```
Frontend:  https://<your-project>.vercel.app
Backend:   https://<your-service>.onrender.com
API Docs:  https://<your-service>.onrender.com/docs
Health:    https://<your-service>.onrender.com/health
```

---

## 🎯 Quick Start Sequence

1. **Read First**: [LIVE_DEPLOYMENT_GUIDE.md](./LIVE_DEPLOYMENT_GUIDE.md)
2. **Push to GitHub**: `git push origin main`
3. **Deploy Backend**: render.com → PostgreSQL + Web Service
4. **Deploy Frontend**: vercel.com → Import repo
5. **Test**: Visit https://your-app.vercel.app
6. **Monitor**: Check Render & Vercel dashboards

---

## 📞 Support Resources

| Issue | Resource |
|-------|----------|
| Deployment steps | [LIVE_DEPLOYMENT_GUIDE.md](./LIVE_DEPLOYMENT_GUIDE.md) |
| Configuration | [DEPLOYMENT_CONFIG.md](./DEPLOYMENT_CONFIG.md) |
| Troubleshooting | [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) |
| API Reference | `https://<your-service>.onrender.com/docs` |
| FastAPI Docs | https://fastapi.tiangolo.com |
| Vercel Docs | https://vercel.com/docs |
| Render Docs | https://render.com/docs |

---

## ✅ Pre-Deployment Checklist

- [ ] Read LIVE_DEPLOYMENT_GUIDE.md
- [ ] Git repository initialized
- [ ] Code pushed to GitHub main branch
- [ ] Render PostgreSQL database created
- [ ] Render web service configured
- [ ] Vercel project connected
- [ ] Environment variables set on both platforms
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Login/registration works end-to-end
- [ ] CORS errors resolved

---

## 🚀 You're Ready!

All deployment infrastructure is in place. Follow [LIVE_DEPLOYMENT_GUIDE.md](./LIVE_DEPLOYMENT_GUIDE.md) to go live in 3 steps.

Last updated: 2026-08-17
