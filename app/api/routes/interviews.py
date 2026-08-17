from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user_id
from app.db.database import get_db
from app.models.application import Application
from app.models.interview import Interview

router = APIRouter()


@router.get("/application/{application_id}")
def get_interviews_for_application(
    application_id: int,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == int(user_id),
    ).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    return db.query(Interview).filter(Interview.application_id == application_id).all()


@router.post("/application/{application_id}")
def create_interview(
    application_id: int,
    payload: dict,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == int(user_id),
    ).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if not payload.get("round") or not payload.get("interview_date"):
        raise HTTPException(status_code=400, detail="Round and interview date are required")

    interview = Interview(
        application_id=application_id,
        round=payload["round"],
        interview_date=date.fromisoformat(payload["interview_date"]),
        notes=payload.get("notes"),
        result=payload.get("result"),
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview
