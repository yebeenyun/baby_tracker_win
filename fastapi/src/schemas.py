from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class ChildCreate(BaseModel):
    name: str
    birth_date: date
    gender: Optional[str]
    photo: Optional[str]


class FeedingCreate(BaseModel):
    child_id: int
    date_time: datetime
    amount: int
    type: Optional[str]
    memo: Optional[str]


class ExcretionCreate(BaseModel):
    child_id: int
    date_time: datetime
    pee: Optional[bool]
    poop: Optional[bool]
    color: Optional[str]
    memo: Optional[str]


class GrowthCreate(BaseModel):
    child_id: int
    date: date
    height: Optional[float]
    weight: Optional[float]