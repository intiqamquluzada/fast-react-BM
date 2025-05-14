from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class User(BaseModel):
    email: EmailStr
    password: str

class UserInDB(User):
    hashed_password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr

class Task(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskInDB(Task):
    id: str
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
