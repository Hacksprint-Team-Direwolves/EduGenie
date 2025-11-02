from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime
from app.core.database import Base
from datetime import datetime

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    stream = Column(String, nullable=True)
    klass = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    subject = Column(String, nullable=True)
    topic = Column(String, nullable=True)
    subtopic = Column(String, nullable=True)
    objectives = Column(Text, nullable=True)
    duration = Column(Float, nullable=True)
    path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
