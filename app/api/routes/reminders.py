from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_user_id
from app.db.database import get_db
from app.models.reminder import Reminder

router = APIRouter()


@router.post('/application/{application_id}')
def create_reminder(
    application_id: int,
    title: str = Query(...),
    description: str = Query(None),
    reminder_date: str = Query(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Create a reminder for an application."""
    try:
        reminder_dt = datetime.fromisoformat(reminder_date)
    except ValueError:
        raise HTTPException(status_code=400, detail='Invalid date format')

    reminder = Reminder(
        application_id=application_id,
        user_id=user_id,
        title=title,
        description=description,
        reminder_date=reminder_dt,
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    return {
        'id': reminder.id,
        'application_id': reminder.application_id,
        'title': reminder.title,
        'description': reminder.description,
        'reminder_date': reminder.reminder_date.isoformat(),
        'is_completed': reminder.is_completed,
    }


@router.get('/application/{application_id}')
def get_reminders_for_application(
    application_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Get reminders for a specific application."""
    reminders = db.query(Reminder).filter(
        Reminder.application_id == application_id,
        Reminder.user_id == user_id,
    ).all()

    return [
        {
            'id': r.id,
            'application_id': r.application_id,
            'title': r.title,
            'description': r.description,
            'reminder_date': r.reminder_date.isoformat(),
            'is_completed': r.is_completed,
        }
        for r in reminders
    ]


@router.get('/upcoming')
def get_upcoming_reminders(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
    limit: int = Query(10),
):
    """Get upcoming reminders for the user."""
    now = datetime.utcnow()
    reminders = (
        db.query(Reminder)
        .filter(
            Reminder.user_id == user_id,
            Reminder.is_completed == 0,
            Reminder.reminder_date >= now,
        )
        .order_by(Reminder.reminder_date)
        .limit(limit)
        .all()
    )

    return [
        {
            'id': r.id,
            'application_id': r.application_id,
            'title': r.title,
            'description': r.description,
            'reminder_date': r.reminder_date.isoformat(),
            'is_completed': r.is_completed,
        }
        for r in reminders
    ]


@router.put('/{reminder_id}/complete')
def mark_reminder_complete(
    reminder_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Mark a reminder as completed."""
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == user_id,
    ).first()

    if not reminder:
        raise HTTPException(status_code=404, detail='Reminder not found')

    reminder.is_completed = 1
    db.commit()
    db.refresh(reminder)

    return {
        'id': reminder.id,
        'application_id': reminder.application_id,
        'title': reminder.title,
        'description': reminder.description,
        'reminder_date': reminder.reminder_date.isoformat(),
        'is_completed': reminder.is_completed,
    }


@router.delete('/{reminder_id}')
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Delete a reminder."""
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == user_id,
    ).first()

    if not reminder:
        raise HTTPException(status_code=404, detail='Reminder not found')

    db.delete(reminder)
    db.commit()

    return {'message': 'Reminder deleted'}
