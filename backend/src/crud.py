from .models import Child, Feeding, Excretion, Growth
from sqlalchemy.orm import Session
from typing import Optional
from . import schemas


# Child
def create_child(db: Session, data: schemas.ChildCreate) -> Child:
    obj = Child(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_children(db: Session, child_id: Optional[int] = None) -> list[Child]:
    if child_id is not None:
        return db.query(Child).filter_by(id=child_id).all()
    return db.query(Child).all()


# Feeding
def create_feeding(db: Session, data: schemas.FeedingCreate) -> Feeding:
    obj = Feeding(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_feedings(db: Session, child_id: int) -> list[Feeding]:
    return db.query(Feeding).filter_by(child_id=child_id).all()


# Excretion
def create_excretion(db: Session, data: schemas.ExcretionCreate) -> Excretion:
    obj = Excretion(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_excretions(db: Session, child_id: int) -> list[Excretion]:
    return db.query(Excretion).filter_by(child_id=child_id).all()


# Growth
def create_growth(db: Session, data: schemas.GrowthCreate) -> Growth:
    obj = Growth(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_growth(db: Session, child_id: int) -> list[Growth]:
    return db.query(Growth).filter_by(child_id=child_id).all()