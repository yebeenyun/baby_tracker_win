from datetime import datetime
import os
from uuid import uuid4
from fastapi import FastAPI, Depends, File, Form, UploadFile
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


@app.post("/child/", response_model=schemas.ChildResponse)
async def create_child(
    name: str = Form(...),
    birth_date: str = Form(...),
    gender: str = Form(None),
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
        name=name,
        birth_date=datetime.strptime(birth_date, "%Y-%m-%d"),
        gender=gender,
        photo=photo_path,
    )

    db.add(child)
    db.commit()
    db.refresh(child)

    return child

@app.get("/child/")
def get_children(db: Session = Depends(get_db)):
    return crud.get_children(db)


@app.post("/feeding/")
def create_feeding(data: schemas.FeedingCreate, db: Session = Depends(get_db)):
    return crud.create_feeding(db, data)


@app.get("/feeding/{child_id}")
def get_feedings(child_id: int, db: Session = Depends(get_db)):
    return crud.get_feedings(db, child_id)


@app.post("/excretion/")
def create_excretion(data: schemas.ExcretionCreate, db: Session = Depends(get_db)):
    return crud.create_excretion(db, data)


@app.get("/excretion/{child_id}")
def get_excretions(child_id: int, db: Session = Depends(get_db)):
    return crud.get_excretions(db, child_id)


@app.post("/growth/")
def create_growth(data: schemas.GrowthCreate, db: Session = Depends(get_db)):
    return crud.create_growth(db, data)


@app.get("/growth/{child_id}")
def get_growth(child_id: int, db: Session = Depends(get_db)):
    return crud.get_growth(db, child_id)