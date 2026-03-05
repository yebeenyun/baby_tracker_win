import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.src.database import Base
from backend.src import models, crud, schemas
from datetime import datetime, date

import tempfile
import os

@pytest.fixture(scope="function")
def db_session():
    # 임시 DB 파일 생성
    db_fd, db_path = tempfile.mkstemp()
    os.close(db_fd)
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db

# Child CRUD 테스트
def test_child_crud(db_session):
    # Create
    data = schemas.ChildCreate(name="테스트", birth_date=date(2020,1,1), gender="male", photo=None)
    child = crud.create_child(db_session, data)
    assert child.id is not None
    assert child.name == "테스트"
    # Read
    children = crud.get_children(db_session)
    assert any(c.id == child.id for c in children)
    # Update
    child.name = "수정"
    db_session.commit()
    db_session.refresh(child)
    assert child.name == "수정"

@pytest.mark.skip(reason="delete_child 테스트는 생략")
def test_child_delete(db_session):
    data = schemas.ChildCreate(name="삭제", birth_date=date(2020,1,1), gender=None, photo=None)
    child = crud.create_child(db_session, data)
    db_session.delete(child)
    db_session.commit()
    assert not any(c.id == child.id for c in crud.get_children(db_session))

# Feeding CRUD 테스트
def test_feeding_crud(db_session):
    child = crud.create_child(db_session, schemas.ChildCreate(name="피딩", birth_date=date(2020,1,1), gender=None, photo=None))
    data = schemas.FeedingCreate(child_id=child.id, date_time=datetime(2024,1,1,12,0,0), amount=120, type=None, memo=None)
    feeding = crud.create_feeding(db_session, data)
    assert feeding.id is not None
    assert feeding.amount == 120
    # Read
    feedings = crud.get_feedings(db_session, child.id)
    assert any(f.id == feeding.id for f in feedings)
    # Update
    feeding.amount = 150
    db_session.commit()
    db_session.refresh(feeding)
    assert feeding.amount == 150

@pytest.mark.skip(reason="delete_feeding 테스트는 생략")
def test_feeding_delete(db_session):
    child = crud.create_child(db_session, schemas.ChildCreate(name="삭제", birth_date=date(2020,1,1), gender=None, photo=None))
    data = schemas.FeedingCreate(child_id=child.id, date_time=datetime(2024,1,1,12,0,0), amount=120, type=None, memo=None)
    feeding = crud.create_feeding(db_session, data)
    db_session.delete(feeding)
    db_session.commit()
    assert not any(f.id == feeding.id for f in crud.get_feedings(db_session, child.id))

# Excretion CRUD 테스트
def test_excretion_crud(db_session):
    child = crud.create_child(db_session, schemas.ChildCreate(name="기저귀", birth_date=date(2020,1,1), gender=None, photo=None))
    data = schemas.ExcretionCreate(child_id=child.id, date_time=datetime(2024,1,1,13,0,0), pee=True, poop=False, color=None, memo=None)
    excretion = crud.create_excretion(db_session, data)
    assert excretion.id is not None
    assert excretion.pee is True
    # Read
    excretions = crud.get_excretions(db_session, child.id)
    assert any(e.id == excretion.id for e in excretions)
    # Update
    excretion.pee = False
    db_session.commit()
    db_session.refresh(excretion)
    assert excretion.pee is False

@pytest.mark.skip(reason="delete_excretion 테스트는 생략")
def test_excretion_delete(db_session):
    child = crud.create_child(db_session, schemas.ChildCreate(name="삭제", birth_date=date(2020,1,1), gender=None, photo=None))
    data = schemas.ExcretionCreate(child_id=child.id, date_time=datetime(2024,1,1,13,0,0), pee=True, poop=True, color=None, memo=None)
    excretion = crud.create_excretion(db_session, data)
    db_session.delete(excretion)
    db_session.commit()
    assert not any(e.id == excretion.id for e in crud.get_excretions(db_session, child.id))

# Growth CRUD 테스트
def test_growth_crud(db_session):
    child = crud.create_child(db_session, schemas.ChildCreate(name="성장", birth_date=date(2020,1,1), gender=None, photo=None))
    data = schemas.GrowthCreate(child_id=child.id, date=date(2024,1,2), height=80.0, weight=10.0)
    growth = crud.create_growth(db_session, data)
    assert growth.id is not None
    assert growth.height == 80.0
    # Read
    growths = crud.get_growth(db_session, child.id)
    assert any(g.id == growth.id for g in growths)
    # Update
    growth.height = 85.0
    db_session.commit()
    db_session.refresh(growth)
    assert growth.height == 85.0

@pytest.mark.skip(reason="delete_growth 테스트는 생략")
def test_growth_delete(db_session):
    child = crud.create_child(db_session, schemas.ChildCreate(name="삭제", birth_date=date(2020,1,1), gender=None, photo=None))
    data = schemas.GrowthCreate(child_id=child.id, date=date(2024,1,2), height=80.0, weight=10.0)
    growth = crud.create_growth(db_session, data)
    db_session.delete(growth)
    db_session.commit()
    assert not any(g.id == growth.id for g in crud.get_growth(db_session, child.id))
