from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, Base, get_db

# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API")

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
