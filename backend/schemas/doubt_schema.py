from pydantic import BaseModel
from datetime import datetime

class DoubtCreate(BaseModel):
    text: str

class DoubtOut(BaseModel):
    id: int
    text: str
    status: str
    reply: str | None
    created_at: datetime

    class Config:
        orm_mode = True
