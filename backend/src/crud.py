from .models import Child, Feeding, Excretion, Growth, User
from sqlalchemy.orm import Session
from typing import Optional
from . import schemas
from passlib.context import CryptContext

# 비밀번호 해싱 (argon2 사용)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# User
def create_user(db: Session, data: schemas.UserCreate) -> User:
    hashed_password = hash_password(data.password)
    obj = User(
        email=data.email,
        password=hashed_password,
        name=data.name,
        phone=data.phone
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter_by(id=user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter_by(email=email).first()


def get_users(db: Session) -> list[User]:
    return db.query(User).all()


def update_user(db: Session, user_id: int, data: schemas.UserUpdate) -> Optional[User]:
    obj = db.query(User).filter_by(id=user_id).first()
    if not obj:
        return None

    update_data = data.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])

    for key, value in update_data.items():
        setattr(obj, key, value)

    db.commit()
    db.refresh(obj)
    return obj


def delete_user(db: Session, user_id: int) -> bool:
    obj = db.query(User).filter_by(id=user_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# Child
def create_child(db: Session, data: schemas.ChildCreate) -> Child:
    obj = Child(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_children(db: Session, child_id: Optional[int] = None, user_id: Optional[int] = None) -> list[Child]:
    query = db.query(Child)
    if child_id is not None:
        query = query.filter_by(id=child_id)
    if user_id is not None:
        query = query.filter_by(user_id=user_id)
    return query.all()


def delete_child(db: Session, child_id: int) -> bool:
    obj = db.query(Child).filter_by(id=child_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


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