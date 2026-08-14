from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, get_db
from routers import auth, listings, bookings, reviews, payments
from routers import upload
from fastapi.staticfiles import StaticFiles

# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API")
# 1. Define the allowed origins
origins = [
    "http://localhost:3000",      # React local development
    "http://localhost:5173",      # Vite local development
    "https://yourfrontend.com",   # Production frontend domain
]

# 2. Add the CORS middleware to your app instance
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows requests from these origins
    allow_credentials=True,           # Allows cookies and auth headers
    allow_methods=["*"],              # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allows all HTTP headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Airbnb Clone API"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Execute a simple query to check the database connection
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")


# include routers
app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(payments.router)
app.include_router(upload.router)

import os
# ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

# serve uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
