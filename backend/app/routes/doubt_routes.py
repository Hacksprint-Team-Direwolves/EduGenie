from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.doubt import Doubt
from app.schemas.doubt_schema import DoubtCreate, DoubtOut

router = APIRouter()

@router.post("/", response_model=DoubtOut, status_code=status.HTTP_201_CREATED)
def create_doubt(payload: DoubtCreate, db: Session = Depends(get_db)):
    d = Doubt(text=payload.text)
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

@router.get("/", response_model=list[DoubtOut])
def list_doubts(db: Session = Depends(get_db)):
    return db.query(Doubt).order_by(Doubt.created_at.desc()).all()

@router.put("/{doubt_id}/resolve", response_model=DoubtOut)
def resolve_doubt(doubt_id: int, db: Session = Depends(get_db)):
    d = db.query(Doubt).filter(Doubt.id == doubt_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Doubt not found")
    d.status = "resolved"
    db.commit()
    db.refresh(d)
    return d
