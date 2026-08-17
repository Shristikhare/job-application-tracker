from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user_id
from app.db.database import get_db
from app.models.application import Application
from app.models.resume import Resume

router = APIRouter()


@router.get("/application/{application_id}")
def list_resumes_for_application(
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

    return db.query(Resume).filter(Resume.application_id == application_id).all()


@router.post("/application/{application_id}")
async def upload_resume(
    application_id: int,
    file: UploadFile,
    version: str = "v1",
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == int(user_id),
    ).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    file_url = f"/uploads/{application_id}/{file.filename}"
    resume = Resume(
        application_id=application_id,
        file_name=file.filename,
        file_url=file_url,
        version=version,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume
