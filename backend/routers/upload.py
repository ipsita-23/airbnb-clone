from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from uuid import uuid4

router = APIRouter(prefix="/upload", tags=["upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), '..', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")
    ext = os.path.splitext(file.filename)[1] or '.jpg'
    filename = f"{uuid4().hex}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, filename)
    with open(dest_path, 'wb') as f:
        content = await file.read()
        f.write(content)
    # Serve uploaded files from /uploads/<filename>
    return {"url": f"/uploads/{filename}"}
