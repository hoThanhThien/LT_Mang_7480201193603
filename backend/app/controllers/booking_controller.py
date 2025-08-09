from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.booking_model import Booking
from app.schemas.booking_schema import Booking as BookingSchema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/bookings", response_model=list[BookingSchema])
def get_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).all()
