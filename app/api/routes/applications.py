from datetime import date
import io

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.security import get_current_user_id
from app.db.database import get_db
from app.models.application import Application

router = APIRouter()


@router.get("/")
def list_applications(
    status: str | None = Query(default=None),
    company: str | None = Query(default=None),
    role: str | None = Query(default=None),
    location: str | None = Query(default=None),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    query = db.query(Application).filter(Application.user_id == int(user_id))

    if status:
        query = query.filter(Application.status.ilike(f"%{status}%"))
    if company:
        query = query.filter(Application.company.ilike(f"%{company}%"))
    if role:
        query = query.filter(Application.role.ilike(f"%{role}%"))
    if location:
        query = query.filter(Application.location.ilike(f"%{location}%"))

    return query.order_by(Application.applied_date.desc()).all()


@router.post("/")
def create_application(
    payload: dict,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    required_fields = ["company", "role", "applied_date"]
    for field in required_fields:
        if field not in payload or not payload[field]:
            raise HTTPException(status_code=400, detail=f"Field '{field}' is required")

    application = Application(
        user_id=int(user_id),
        company=payload["company"],
        role=payload["role"],
        location=payload.get("location"),
        job_url=payload.get("job_url"),
        salary=payload.get("salary"),
        applied_date=date.fromisoformat(payload["applied_date"]),
        status=payload.get("status", "Applied"),
        job_type=payload.get("job_type"),
        notes=payload.get("notes"),
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/{application_id}")
def get_application(
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
    return application


@router.patch("/{application_id}")
def update_application(
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

    for field, value in payload.items():
        if field == "applied_date" and value:
            setattr(application, field, date.fromisoformat(value))
        elif field != "user_id":
            setattr(application, field, value)

    db.commit()
    db.refresh(application)
    return application


@router.delete("/{application_id}")
def delete_application(
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

    db.delete(application)
    db.commit()
    return {"message": "Application deleted successfully"}


@router.get("/export/csv")
def export_applications_csv(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Export all user applications as CSV."""
    applications = (
        db.query(Application)
        .filter(Application.user_id == int(user_id))
        .order_by(Application.applied_date.desc())
        .all()
    )

    if not applications:
        raise HTTPException(status_code=400, detail="No applications to export")

    # Build CSV content
    csv_lines = [
        "Company,Role,Location,Status,Job URL,Salary,Applied Date,Job Type,Notes",
    ]

    for app in applications:
        salary_str = str(app.salary) if app.salary else ""
        row = [
            app.company,
            app.role,
            app.location or "Remote",
            app.status or "Applied",
            app.job_url or "",
            salary_str,
            str(app.applied_date) if app.applied_date else "",
            app.job_type or "",
            (app.notes or "").replace("\n", " ").replace('"', '""'),
        ]
        csv_lines.append(
            ",".join([f'"{field}"' if "," in str(field) or '"' in str(field) else field for field in row])
        )

    csv_content = "\n".join(csv_lines)
    csv_bytes = io.BytesIO(csv_content.encode())

    return StreamingResponse(
        iter([csv_content.encode()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=job-applications.csv"},
    )
