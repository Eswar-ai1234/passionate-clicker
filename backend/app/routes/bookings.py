from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from app.models.booking import Booking
from security import require_admin


router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


# =========================================================
# GET ALL BOOKINGS - ADMIN ONLY
# =========================================================

@router.get("/")
def get_bookings(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    bookings = (
        db.query(Booking)
        .order_by(Booking.id.desc())
        .all()
    )

    return [
        {
            "id": booking.id,
            "client_name": booking.client_name,
            "email": booking.email,
            "phone": booking.phone,
            "service": booking.service,
            "shoot_date": str(booking.shoot_date),
            "location": booking.location,
            "message": booking.message,
            "status": booking.status,
        }
        for booking in bookings
    ]


# =========================================================
# CREATE BOOKING - PUBLIC
# =========================================================

@router.post("/")
def create_booking(
    client_name: str,
    email: str,
    phone: str,
    service: str,
    shoot_date: str,
    location: str,
    message: str = "",
    db: Session = Depends(get_db)
):
    try:
        shoot_date_value = datetime.strptime(
            shoot_date,
            "%Y-%m-%d"
        ).date()

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD."
        )

    booking = Booking(
        client_name=client_name,
        email=email,
        phone=phone,
        service=service,
        shoot_date=shoot_date_value,
        location=location,
        message=message,
        status="New",
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "message": "Booking created successfully",
        "booking_id": booking.id,
        "status": booking.status,
    }


# =========================================================
# UPDATE BOOKING STATUS - ADMIN ONLY
# =========================================================

@router.put("/{booking_id}/status")
def update_booking_status(
    booking_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found."
        )

    allowed_statuses = {
        "New",
        "Confirmed",
        "Completed",
        "Cancelled",
    }

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid booking status."
        )

    booking.status = status

    db.commit()
    db.refresh(booking)

    return {
        "message": "Booking status updated successfully",
        "booking_id": booking.id,
        "status": booking.status,
    }


# =========================================================
# DELETE BOOKING - ADMIN ONLY
# =========================================================

@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found."
        )

    db.delete(booking)
    db.commit()

    return {
        "message": "Booking deleted successfully",
        "booking_id": booking_id,
    }