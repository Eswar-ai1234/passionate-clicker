from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from app.models.client import Client
from security import require_admin


router = APIRouter(
    prefix="/clients",
    tags=["Clients"]
)


@router.get("/")
def get_clients(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    clients = (
        db.query(Client)
        .order_by(Client.id.desc())
        .all()
    )

    return [
        {
            "id": client.id,
            "name": client.name,
            "email": client.email,
            "phone": client.phone,
            "service": client.service,
            "shoot_date": str(client.shoot_date),
            "status": client.status,
            "notes": client.notes,
        }
        for client in clients
    ]


@router.post("/")
def create_client(
    name: str,
    email: str,
    phone: str,
    service: str,
    shoot_date: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
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

    client = Client(
        name=name,
        email=email,
        phone=phone,
        service=service,
        shoot_date=shoot_date_value,
        status="Pending",
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    return {
        "message": "Client created successfully",
        "client_id": client.id,
        "name": client.name,
        "status": client.status,
    }


@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    client = (
        db.query(Client)
        .filter(Client.id == client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found."
        )

    db.delete(client)
    db.commit()

    return {
        "message": "Client deleted successfully",
        "client_id": client_id,
    }