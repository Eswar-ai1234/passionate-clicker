from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from app.models.gallery import Gallery
from security import require_admin


router = APIRouter(
    prefix="/galleries",
    tags=["Galleries"]
)


# =========================================================
# CREATE GALLERY - ADMIN ONLY
# =========================================================

@router.post("/")
def create_gallery(
    client_name: str,
    gallery_name: str,
    event_type: str,
    event_date: str,
    gallery_code: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    existing_gallery = (
        db.query(Gallery)
        .filter(Gallery.gallery_code == gallery_code)
        .first()
    )

    if existing_gallery:
        raise HTTPException(
            status_code=400,
            detail="Gallery code already exists. Please use a different code."
        )

    try:
        event_date_value = datetime.strptime(
            event_date,
            "%Y-%m-%d"
        ).date()
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD."
        )

    gallery = Gallery(
        client_name=client_name,
        gallery_name=gallery_name,
        event_type=event_type,
        event_date=event_date_value,
        gallery_code=gallery_code,
    )

    db.add(gallery)
    db.commit()
    db.refresh(gallery)

    return {
        "message": "Gallery created successfully",
        "gallery_id": gallery.id,
        "gallery_code": gallery.gallery_code,
        "client_name": gallery.client_name,
        "gallery_name": gallery.gallery_name,
        "event_type": gallery.event_type,
        "event_date": str(gallery.event_date),
    }


# =========================================================
# GET ALL GALLERIES - ADMIN ONLY
# =========================================================

@router.get("/")
def get_galleries(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    galleries = (
        db.query(Gallery)
        .order_by(Gallery.id.desc())
        .all()
    )

    return [
        {
            "id": gallery.id,
            "client_name": gallery.client_name,
            "gallery_name": gallery.gallery_name,
            "event_type": gallery.event_type,
            "event_date": str(gallery.event_date),
            "gallery_code": gallery.gallery_code,
            "created_at": (
                gallery.created_at.isoformat()
                if gallery.created_at
                else None
            ),
        }
        for gallery in galleries
    ]


# =========================================================
# GET SINGLE GALLERY BY CODE - CLIENT ACCESS
# =========================================================

@router.get("/code/{gallery_code}")
def get_gallery_by_code(
    gallery_code: str,
    db: Session = Depends(get_db)
):
    gallery = (
        db.query(Gallery)
        .filter(Gallery.gallery_code == gallery_code)
        .first()
    )

    if not gallery:
        raise HTTPException(
            status_code=404,
            detail="Gallery not found."
        )

    return {
        "id": gallery.id,
        "client_name": gallery.client_name,
        "gallery_name": gallery.gallery_name,
        "event_type": gallery.event_type,
        "event_date": str(gallery.event_date),
        "gallery_code": gallery.gallery_code,
        "created_at": (
            gallery.created_at.isoformat()
            if gallery.created_at
            else None
        ),
    }


# =========================================================
# GET GALLERY BY ID - ADMIN ONLY
# =========================================================

@router.get("/{gallery_id}")
def get_gallery(
    gallery_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
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

    return {
        "id": gallery.id,
        "client_name": gallery.client_name,
        "gallery_name": gallery.gallery_name,
        "event_type": gallery.event_type,
        "event_date": str(gallery.event_date),
        "gallery_code": gallery.gallery_code,
        "created_at": (
            gallery.created_at.isoformat()
            if gallery.created_at
            else None
        ),
    }


# =========================================================
# DELETE GALLERY - ADMIN ONLY
# =========================================================

@router.delete("/{gallery_id}")
def delete_gallery(
    gallery_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
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

    db.delete(gallery)
    db.commit()

    return {
        "message": "Gallery deleted successfully",
        "gallery_id": gallery_id,
    }