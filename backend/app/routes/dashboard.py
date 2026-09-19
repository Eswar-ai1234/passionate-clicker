from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from app.models.client import Client
from app.models.booking import Booking
from app.models.gallery import Gallery
from app.models.photo import Photo
from security import require_admin


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# =========================================================
# DASHBOARD STATS - ADMIN ONLY
# =========================================================

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    total_clients = db.query(Client).count()

    active_galleries = db.query(Gallery).count()

    new_bookings = (
        db.query(Booking)
        .filter(Booking.status == "New")
        .count()
    )

    completed_shoots = (
        db.query(Client)
        .filter(Client.status == "Completed")
        .count()
    )

    return {
        "total_clients": total_clients,
        "active_galleries": active_galleries,
        "new_bookings": new_bookings,
        "completed_shoots": completed_shoots,
    }


# =========================================================
# DASHBOARD GALLERIES - ADMIN ONLY
# =========================================================

@router.get("/galleries")
def get_dashboard_galleries(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    galleries = (
        db.query(Gallery)
        .order_by(Gallery.id.desc())
        .limit(6)
        .all()
    )

    result = []

    for gallery in galleries:

        photo_count = (
            db.query(Photo)
            .filter(Photo.gallery_id == gallery.id)
            .count()
        )

        result.append({
            "id": gallery.id,
            "client_name": gallery.client_name,
            "gallery_name": gallery.gallery_name,
            "event_type": gallery.event_type,
            "event_date": str(gallery.event_date),
            "gallery_code": gallery.gallery_code,
            "photo_count": photo_count,
        })

    return result


# =========================================================
# DASHBOARD BOOKINGS - ADMIN ONLY
# =========================================================

@router.get("/bookings")
def get_dashboard_bookings(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    bookings = (
        db.query(Booking)
        .order_by(Booking.id.desc())
        .limit(5)
        .all()
    )

    return [
        {
            "id": booking.id,
            "client_name": booking.client_name,
            "service": booking.service,
            "shoot_date": str(booking.shoot_date),
            "status": booking.status,
        }
        for booking in bookings
    ]