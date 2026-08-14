from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from jose import JWTError, jwt

import crud, schemas
from database import get_db
from dependencies import SECRET_KEY, ALGORITHM, REFRESH_SECRET, ENV
from dependencies import _get_token_from_request

router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # default 24 hours
ACCESS_TOKEN_SHORT_MINUTES = 60  # 1 hour
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_token(data: dict, secret: str, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/register", response_model=schemas.UserRead)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, email=user_in.email, password=user_in.password, name=user_in.name)
    return user


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.UserCreate, response: Response, request: Request, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_token({"sub": str(user.id)}, SECRET_KEY, timedelta(minutes=ACCESS_TOKEN_SHORT_MINUTES))
    refresh_token = create_token({"sub": str(user.id)}, REFRESH_SECRET, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    secure_flag = True if ENV == 'production' else False
    # set HttpOnly cookies
    response.set_cookie(key="access_token", value=access_token, httponly=True, samesite="lax", secure=secure_flag, path='/')
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, samesite="lax", secure=secure_flag, path='/auth/refresh')
    return {"access_token": access_token, "token_type": "bearer"}



@router.get("/me", response_model=schemas.UserRead)
def read_current_user(request: Request, db: Session = Depends(get_db)):
    token = _get_token_from_request(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(crud.models.User).filter(crud.models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post('/refresh', response_model=schemas.Token)
def refresh_token(request: Request, response: Response):
    refresh = request.cookies.get('refresh_token')
    if not refresh:
        raise HTTPException(status_code=401, detail='No refresh token')
    try:
        payload = jwt.decode(refresh, REFRESH_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get('sub')
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid refresh token')
    access_token = create_token({'sub': user_id}, SECRET_KEY, timedelta(minutes=ACCESS_TOKEN_SHORT_MINUTES))
    secure_flag = True if ENV == 'production' else False
    response.set_cookie(key='access_token', value=access_token, httponly=True, samesite='lax', secure=secure_flag, path='/')
    return {'access_token': access_token, 'token_type': 'bearer'}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/auth/refresh")
    return {"status": "logged_out"}
