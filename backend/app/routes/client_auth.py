import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db
from app.models.client import Client
from security import (
    verify_password,
    create_client_access_token,
    hash_password,
)


router = APIRouter(
    prefix="/client-auth",
    tags=["Client Authentication"]
)


class ClientLoginRequest(BaseModel):
    email: EmailStr
    password: str


class ClientRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str


# =====================================================
# CLIENT LOGIN
# =====================================================

@router.post("/login")
def client_login(
    data: ClientLoginRequest,
    db: Session = Depends(get_db)
):
    email = data.email.strip().lower()

    client = (
        db.query(Client)
        .filter(Client.email == email)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if not client.password_hash:
        raise HTTPException(
            status_code=403,
            detail="Client account is not configured yet."
        )

    if not verify_password(
        data.password,
        client.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    token = create_client_access_token(str(client.id))

    return {
        "message": "Client login successful",
        "access_token": token,
        "token_type": "bearer",
        "client": {
            "id": client.id,
            "name": client.name,
            "email": client.email
        }
    }


# =====================================================
# CREATE ACCOUNT
# =====================================================

@router.post("/register")
def register_client(
    data: ClientRegisterRequest,
    db: Session = Depends(get_db)
):
    name = data.name.strip()
    email = data.email.strip().lower()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required."
        )

    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters."
        )

    existing_client = (
        db.query(Client)
        .filter(Client.email == email)
        .first()
    )

    if existing_client:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )

    client = Client(
        name=name,
        email=email,
        phone="Not provided",
        service="Not provided",
        shoot_date=datetime.now(timezone.utc).date(),
        status="Pending",
        password_hash=hash_password(data.password)
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    return {
        "message": "Account created successfully.",
        "client_id": client.id
    }


# =====================================================
# FORGOT PASSWORD
# =====================================================

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    email = data.email.strip().lower()

    client = (
        db.query(Client)
        .filter(Client.email == email)
        .first()
    )

    message = (
        "If this email is registered, "
        "a password reset link has been sent."
    )

    if not client:
        return {"message": message}

    # Generate secure random token
    raw_token = secrets.token_urlsafe(32)

    # Store only the hash in database
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=30)
    )

    client.reset_token_hash = token_hash
    client.reset_token_expires_at = expires_at

    db.commit()

    # Temporary development reset link.
    # Actual email sending will be connected next.
    reset_link = (
        "http://localhost:5173/reset-password"
        f"?token={raw_token}"
    )

    print("\n========================================")
    print("PASSWORD RESET LINK")
    print("Client:", client.email)
    print("Expires:", expires_at)
    print(reset_link)
    print("========================================\n")

    return {
        "message": message
    }


# =====================================================
# RESET PASSWORD
# =====================================================

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters."
        )

    token_hash = hashlib.sha256(
        data.token.encode("utf-8")
    ).hexdigest()

    client = (
        db.query(Client)
        .filter(
            Client.reset_token_hash == token_hash
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    if not client.reset_token_expires_at:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    expires_at = client.reset_token_expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if datetime.now(timezone.utc) > expires_at:
        client.reset_token_hash = None
        client.reset_token_expires_at = None
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="This reset link has expired."
        )

    # Change password
    client.password_hash = hash_password(data.password)

    # Make token one-time use
    client.reset_token_hash = None
    client.reset_token_expires_at = None

    db.commit()

    return {
        "message": "Password reset successfully."
    }