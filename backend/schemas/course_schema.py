from pydantic import BaseModel
from datetime import datetime

class CourseCreate(BaseModel):
    user_id: int | None = None
    stream: str | None = None
    klass: str | None = None
    branch: str | None = None
    subject: str | None = None
    topic: str | None = None
    subtopic: str | None = None
    objectives: str | None = None
    duration: float | None = None
    path: str | None = None

class CourseOut(CourseCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
