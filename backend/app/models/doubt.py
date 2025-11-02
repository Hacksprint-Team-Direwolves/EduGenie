from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base
from datetime import datetime

class Doubt(Base):
    __tablename__ = "doubts"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    status = Column(String, default="open", nullable=False)
    reply = Column(Text, default="", nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
