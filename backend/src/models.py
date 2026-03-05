from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean, ForeignKey, Float
from datetime import datetime
from .database import Base


class Child(Base):
    __tablename__ = "child"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(String)
    photo = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Feeding(Base):
    __tablename__ = "feeding"

    id = Column(Integer, primary_key=True)
    child_id = Column(Integer, ForeignKey("child.id"))
    date_time = Column(DateTime, nullable=False)
    amount = Column(Integer, nullable=False)
    type = Column(String)
    memo = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Excretion(Base):
    __tablename__ = "excretion"

    id = Column(Integer, primary_key=True)
    child_id = Column(Integer, ForeignKey("child.id"))
    date_time = Column(DateTime, nullable=False)
    pee = Column(Boolean)
    poop = Column(Boolean)
    color = Column(String)
    memo = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Growth(Base):
    __tablename__ = "growth"

    id = Column(Integer, primary_key=True)
    child_id = Column(Integer, ForeignKey("child.id"))
    date = Column(Date, nullable=False)
    height = Column(Float)
    weight = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)