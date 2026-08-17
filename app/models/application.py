from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    location = Column(String, nullable=True)
    job_url = Column(String, nullable=True)
    salary = Column(Float, nullable=True)
    applied_date = Column(Date, nullable=False)
    status = Column(String, default="Applied")
    job_type = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    user = relationship('User', back_populates='applications')
    interviews = relationship('Interview', back_populates='application')
    resumes = relationship('Resume', back_populates='application')
    reminders = relationship('Reminder', back_populates='application')
