from sqlalchemy import Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    round = Column(String, nullable=False)
    interview_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    result = Column(String, nullable=True)

    application = relationship('Application', back_populates='interviews')
