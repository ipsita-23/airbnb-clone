from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
import crud, models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

import os

SECRET_KEY = os.environ.get("SECRET_KEY", "change_this_secret_for_production")
REFRESH_SECRET = os.environ.get("REFRESH_SECRET", os.environ.get("SECRET_KEY", "change_this_secret_for_production"))
ALGORITHM = os.environ.get("ALGORITHM", "HS256")

ENV = os.environ.get("ENV", "development")


def _get_token_from_request(request: Request):
    # Prefer Authorization header, fall back to cookie `access_token`
    auth: str = request.headers.get("authorization") or ""
    if auth.startswith("Bearer "):
        return auth.split(" ")[1]
    token = request.cookies.get("access_token")
    return token


def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = _get_token_from_request(request)
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user
