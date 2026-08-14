from database import engine, Base, SessionLocal
import models
import crud


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # create a demo user if not exists
        user = crud.get_user_by_email(db, "demo@airbnb.local")
        if not user:
            user = crud.create_user(db, "demo@airbnb.local", "demopass", name="Demo Host")

        # create sample listing
        listings = crud.list_listings(db)
        if not listings:
            crud.create_listing(db, {
                "title": "Cozy Studio in City Center",
                "description": "A comfortable studio near downtown.",
                "price": 75.0,
                "address": "123 Main St",
                "city": "Sampleville",
                "country": "Countryland",
                "host_id": user.id,
            })
    finally:
        db.close()


if __name__ == "__main__":
    seed()
