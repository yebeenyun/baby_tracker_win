from datetime import datetime
import os
from typing import Optional
from uuid import uuid4
from fastapi import FastAPI, Depends, File, Form, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .constants import API_URL, UI_URL, UPLOAD_DIR

from .database import Base, engine, SessionLocal
from . import models, schemas, crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        UI_URL,
        API_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# User
@app.post("/user/", response_model=schemas.UserResponse)
def create_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    # 이미 존재하는 이메일인지 확인
    existing_user = crud.get_user_by_email(db, data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return crud.create_user(db, data)


@app.post("/user/login")
def login_user(data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user or not crud.verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return {"id": user.id, "email": user.email, "name": user.name}


@app.get("/user/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@app.get("/user/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return crud.get_users(db)


@app.put("/user/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, data: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = crud.update_user(db, user_id, data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@app.delete("/user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {"message": "User deleted successfully"}


# Child
@app.post("/child/", response_model=schemas.ChildResponse)
async def create_child(
    user_id: int = Form(...),
    name: str = Form(...),
    birth_date: str = Form(...),
    gender: str = Form(None),
    feeding_interval: int = Form(120),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    photo_path = None

    # 🔹 사진 저장
    if photo:
        ext = photo.filename.split(".")[-1]
        filename = f"{uuid4()}.{ext}"
        file_location = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
        with open(file_location, "wb") as buffer:
            buffer.write(await photo.read())

        photo_path = f"/uploads/{filename}"

    # 🔹 DB 저장
    child = models.Child(
        user_id=user_id,
        name=name,
        birth_date=datetime.strptime(birth_date, "%Y-%m-%d").date(),
        gender=gender,
        photo=photo_path,
        feeding_interval=feeding_interval,
    )

    db.add(child)
    db.commit()
    db.refresh(child)

    return child


@app.get("/child/")
def get_children(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_children(db, user_id=user_id)


@app.get("/child/{child_id}", response_model=schemas.ChildResponse)
def get_child(child_id: int, db: Session = Depends(get_db)):
    child = crud.get_child(db, child_id=child_id)
    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child not found"
        )
    return child


@app.delete("/child/{child_id}")
def delete_child(child_id: int, db: Session = Depends(get_db)):
    success = crud.delete_child(db, child_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child not found"
        )
    return {"message": "Child deleted successfully"}


@app.get("/child/{child_id}/next_feeding_time")
def get_next_feeding_time(child_id: int, db: Session = Depends(get_db)):
    child = crud.get_child(db, child_id)
    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child not found"
        )
    
    feedings = crud.get_feedings(db, child_id)
    if not feedings:
        return {"message": "No feeding data", "remaining_time": None}
    
    last_feeding = max(feedings, key=lambda f: f.date_time)
    last_feeding_time = last_feeding.date_time
    next_feeding_time = last_feeding_time + timedelta(minutes=child.feeding_interval)
    current_time = datetime.utcnow()
    
    if next_feeding_time <= current_time:
        return {"message": "Time to feed!", "remaining_time": "0m 0s", "next_feeding": next_feeding_time.isoformat()}
    
    diff = next_feeding_time - current_time
    minutes = diff.seconds // 60
    seconds = diff.seconds % 60
    remaining_time = f"{minutes}m {seconds}s"
    
    return {
        "remaining_time": remaining_time,
        "next_feeding": next_feeding_time.isoformat()
    }

# Feeding
@app.post("/feeding/")
def create_feeding(data: schemas.FeedingCreate, db: Session = Depends(get_db)):
    return crud.create_feeding(db, data)


@app.get("/feeding/{child_id}")
def get_feedings(child_id: int, db: Session = Depends(get_db)):
    return crud.get_feedings(db, child_id)


@app.put("/feeding/{feeding_id}")
def update_feeding(feeding_id: int, data: schemas.FeedingCreate, db: Session = Depends(get_db)):
    feeding = crud.update_feeding(db, feeding_id, data)
    if not feeding:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feeding not found"
        )
    return feeding


@app.delete("/feeding/{feeding_id}")
def delete_feeding(feeding_id: int, db: Session = Depends(get_db)):
    success = crud.delete_feeding(db, feeding_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feeding not found"
        )
    return {"message": "Feeding deleted successfully"}


@app.get("/feeding/{child_id}")
def get_feedings(child_id: int, db: Session = Depends(get_db)):
    return crud.get_feedings(db, child_id)


# Excretion
@app.post("/excretion/")
def create_excretion(data: schemas.ExcretionCreate, db: Session = Depends(get_db)):
    return crud.create_excretion(db, data)


@app.get("/excretion/{child_id}")
def get_excretions(child_id: int, db: Session = Depends(get_db)):
    return crud.get_excretions(db, child_id)


# Growth
@app.post("/growth/")
def create_growth(data: schemas.GrowthCreate, db: Session = Depends(get_db)):
    return crud.create_growth(db, data)


@app.get("/growth/{child_id}")
def get_growth(child_id: int, db: Session = Depends(get_db)):
    return crud.get_growth(db, child_id)