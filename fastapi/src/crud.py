from .models import Child, Feeding, Excretion, Growth


# Child
def create_child(db, data):
    obj = Child(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_children(db):
    return db.query(Child).all()


# Feeding
def create_feeding(db, data):
    obj = Feeding(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_feedings(db, child_id):
    return db.query(Feeding).filter_by(child_id=child_id).all()


# Excretion
def create_excretion(db, data):
    obj = Excretion(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_excretions(db, child_id):
    return db.query(Excretion).filter_by(child_id=child_id).all()


# Growth
def create_growth(db, data):
    obj = Growth(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_growth(db, child_id):
    return db.query(Growth).filter_by(child_id=child_id).all()