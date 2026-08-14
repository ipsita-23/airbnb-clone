from sqlalchemy.orm import Session
from passlib.context import CryptContext

import models

# use pbkdf2_sha256 to avoid platform bcrypt issues in some environments
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, email: str, password: str, name: str = None):
    hashed = get_password_hash(password)
    user = models.User(email=email, hashed_password=hashed, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_listing(db: Session, listing_data: dict):
    listing = models.Listing(**listing_data)
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


def get_listing(db: Session, listing_id: int):
    return db.query(models.Listing).filter(models.Listing.id == listing_id).first()


def update_listing(db: Session, listing_id: int, updates: dict):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        return None
    for k, v in updates.items():
        if hasattr(listing, k):
            setattr(listing, k, v)
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


def delete_listing(db: Session, listing_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        return False
    db.delete(listing)
    db.commit()
    return True


def list_listings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Listing).offset(skip).limit(limit).all()


def create_booking(db: Session, booking_data: dict):
    booking = models.Booking(**booking_data)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def bookings_for_listing(db: Session, listing_id: int):
    return db.query(models.Booking).filter(models.Booking.listing_id == listing_id).all()


def create_review(db: Session, review_data: dict):
    review = models.Review(**review_data)
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
