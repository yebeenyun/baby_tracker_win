from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from . import models, schemas, crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/child/")
def create_child(data: schemas.ChildCreate, db: Session = Depends(get_db)):
    return crud.create_child(db, data)


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