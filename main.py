from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import applications, auth, interviews, reminders, resumes
from app.db.database import Base, engine
from app.models.application import Application  # noqa: F401
from app.models.interview import Interview  # noqa: F401
from app.models.reminder import Reminder  # noqa: F401
from app.models.resume import Resume  # noqa: F401
from app.models.user import User  # noqa: F401

app = FastAPI(title="Job Application Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["Interviews"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(reminders.router, prefix="/api/reminders", tags=["Reminders"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
