import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from app.models.gallery import Gallery
from app.models.photo import Photo
from security import require_admin


router = APIRouter(
    prefix="/photos",
    tags=["Photos"]
)


# =========================================================
# UPLOAD PHOTO TO GALLERY - ADMIN ONLY
# =========================================================

@router.post("/upload/{gallery_id}")
async def upload_photo(
    gallery_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    # Check gallery
    gallery = (
        db.query(Gallery)
        .filter(Gallery.id == gallery_id)
        .first()
    )

    if not gallery:
        raise HTTPException(
            status_code=404,
            detail="Gallery not found."
        )

    # Allowed image types
    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    # Create gallery folder
    upload_folder = os.path.join(
        "uploads",
        "galleries",
        str(gallery_id)
    )

    os.makedirs(upload_folder, exist_ok=True)

    # Generate unique filename
    original_extension = os.path.splitext(
        file.filename
    )[1]

    unique_filename = (
        f"{uuid.uuid4().hex}{original_extension}"
    )

    file_path = os.path.join(
        upload_folder,
        unique_filename
    )

    # Save file
    file_content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    # Save photo information in database
    photo = Photo(
        gallery_id=gallery_id,
        filename=file.filename,
        file_path=file_path,
    )

    db.add(photo)
    db.commit()
    db.refresh(photo)

    return {
        "message": "Photo uploaded successfully",
        "photo_id": photo.id,
        "gallery_id": gallery_id,
        "filename": file.filename,
        "file_path": file_path,
    }


# =========================================================
# GET PHOTOS OF A GALLERY - VIEW ACCESS
# =========================================================

@router.get("/gallery/{gallery_id}")
def get_gallery_photos(
    gallery_id: int,
    db: Session = Depends(get_db)
):
    # Check gallery
    gallery = (
        db.query(Gallery)
        .filter(Gallery.id == gallery_id)
        .first()
    )

    if not gallery:
        raise HTTPException(
            status_code=404,
            detail="Gallery not found."
        )

    photos = (
        db.query(Photo)
        .filter(Photo.gallery_id == gallery_id)
        .order_by(Photo.id.desc())
        .all()
    )

    return [
        {
            "id": photo.id,
            "gallery_id": photo.gallery_id,
            "filename": photo.filename,
            "file_path": photo.file_path,
            "uploaded_at": (
                photo.uploaded_at.isoformat()
                if photo.uploaded_at
                else None
            ),
        }
        for photo in photos
    ]


# =========================================================
# DELETE PHOTO - ADMIN ONLY
# =========================================================

@router.delete("/{photo_id}")
def delete_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    photo = (
        db.query(Photo)
        .filter(Photo.id == photo_id)
        .first()
    )

    if not photo:
        raise HTTPException(
            status_code=404,
            detail="Photo not found."
        )

    # Delete physical file
    if os.path.exists(photo.file_path):
        os.remove(photo.file_path)

    # Delete database record
    db.delete(photo)
    db.commit()

    return {
        "message": "Photo deleted successfully",
        "photo_id": photo_id,
    }