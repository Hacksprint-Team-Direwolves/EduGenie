from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None
    created_at: datetime

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
