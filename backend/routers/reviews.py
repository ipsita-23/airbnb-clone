from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud, schemas
from database import get_db
from dependencies import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=schemas.ReviewRead)
def create_review(review_in: schemas.ReviewCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = review_in.dict()
    data["author_id"] = current_user.id
    r = crud.create_review(db, data)
    return r
