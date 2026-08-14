from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

import crud, schemas
from database import get_db
from dependencies import get_current_user

router = APIRouter(prefix="/listings", tags=["listings"])


@router.post("/", response_model=schemas.ListingRead)
def create_listing(listing_in: schemas.ListingCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    listing_data = listing_in.dict()
    listing_data["host_id"] = current_user.id
    listing = crud.create_listing(db, listing_data)
    return listing


@router.get("/", response_model=List[schemas.ListingRead])
def get_listings(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.list_listings(db, skip=skip, limit=limit)


@router.get("/{listing_id}", response_model=schemas.ListingRead)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = crud.get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.put("/{listing_id}", response_model=schemas.ListingRead)
def update_listing(listing_id: int, listing_in: schemas.ListingCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    listing = crud.get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the host can update this listing")
    updated = crud.update_listing(db, listing_id, listing_in.dict())
    return updated


@router.delete("/{listing_id}")
def delete_listing(listing_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    listing = crud.get_listing(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the host can delete this listing")
    ok = crud.delete_listing(db, listing_id)
    return {"deleted": ok}
