from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class UserRead(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str]

    class Config:
        orm_mode = True


class ListingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image: Optional[str] = None


class ListingRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    price: float
    address: Optional[str]
    city: Optional[str]
    country: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    image: Optional[str]
    host_id: int

    class Config:
        orm_mode = True


class BookingCreate(BaseModel):
    listing_id: int
    start_date: str
    end_date: str
    total_price: float


class BookingRead(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    start_date: str
    end_date: str
    total_price: float

    class Config:
        orm_mode = True


class BookingWithListingRead(BookingRead):
    listing: Optional[ListingRead] = None

    class Config:
        orm_mode = True


class ReviewCreate(BaseModel):
    listing_id: int
    rating: int
    comment: Optional[str]


class ReviewRead(BaseModel):
    id: int
    listing_id: int
    author_id: int
    rating: int
    comment: Optional[str]

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
