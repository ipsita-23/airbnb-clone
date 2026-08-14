from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud, schemas
from database import get_db
from dependencies import get_current_user

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/", response_model=schemas.BookingRead)
def create_booking(booking_in: schemas.BookingCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    existing = crud.bookings_for_listing(db, booking_in.listing_id)
    for b in existing:
        if b.start_date == booking_in.start_date and b.end_date == booking_in.end_date:
            raise HTTPException(status_code=400, detail="Dates already booked")
    booking_data = booking_in.dict()
    booking_data["guest_id"] = current_user.id
    booking = crud.create_booking(db, booking_data)
    return booking


@router.get("/me", response_model=list[schemas.BookingWithListingRead])
def get_my_bookings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.bookings_for_user(db, current_user.id)
