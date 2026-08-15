from database import engine, Base, SessionLocal
import models
import crud


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # create a demo user if not exists
        user = crud.get_user_by_email(db, "demo@example.com")
        if not user:
            user = crud.create_user(db, "demo@example.com", "demopass", name="Demo Host")

        # create sample listings
        listings = crud.list_listings(db)
        if not listings:
            sample_listings = [
                {
                    "title": "Cozy Studio in City Center",
                    "description": "A comfortable studio near downtown.",
                    "price": 2500.0,
                    "address": "123 Main St",
                    "city": "Chandigarh",
                    "country": "India",
                    "latitude": 30.7333,
                    "longitude": 76.7794,
                    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
                    "host_id": user.id,
                },
                {
                    "title": "Mountain View Villa",
                    "description": "A beautiful villa with scenic views.",
                    "price": 5000.0,
                    "address": "456 Hill Rd",
                    "city": "Kasauli",
                    "country": "India",
                    "latitude": 31.0082,
                    "longitude": 76.9610,
                    "image": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
                    "host_id": user.id,
                },
                {
                    "title": "Modern Apartment",
                    "description": "A modern apartment with all amenities.",
                    "price": 3000.0,
                    "address": "789 Highway Blvd",
                    "city": "Zirakpur",
                    "country": "India",
                    "latitude": 30.6422,
                    "longitude": 76.8152,
                    "image": "https://images.unsplash.com/photo-1502672260266-1c1e52d15461?w=800&q=80",
                    "host_id": user.id,
                },
                {
                    "title": "Luxury Penthouse",
                    "description": "Spacious penthouse overlooking the city skyline.",
                    "price": 8000.0,
                    "address": "101 Skyline Ave",
                    "city": "Chandigarh",
                    "country": "India",
                    "latitude": 30.7400,
                    "longitude": 76.7900,
                    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
                    "host_id": user.id,
                }
            ]
            for listing in sample_listings:
                crud.create_listing(db, listing)
    finally:
        db.close()


if __name__ == "__main__":
    seed()
