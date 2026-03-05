from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    phone: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ChildCreate(BaseModel):
    user_id: int
    name: str
    birth_date: date
    gender: Optional[str] = None
    photo: Optional[str] = None


class FeedingCreate(BaseModel):
    child_id: int
    date_time: datetime
    amount: int
    type: Optional[str] = None
    memo: Optional[str] = None


class ExcretionCreate(BaseModel):
    child_id: int
    date_time: datetime
    pee: Optional[bool] = None
    poop: Optional[bool] = None
    color: Optional[str] = None
    memo: Optional[str] = None


class GrowthCreate(BaseModel):
    child_id: int
    date: date
    height: Optional[float] = None
    weight: Optional[float] = None
    

class ChildBase(BaseModel):
    name: str
    birth_date: date
    gender: Optional[str] = None
    
    
class ChildResponse(ChildBase):
    id: int
    user_id: int
    photo: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True