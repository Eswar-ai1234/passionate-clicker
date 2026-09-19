import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from security import verify_password, create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest):

    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password_hash = os.getenv("ADMIN_PASSWORD_HASH")

    if not admin_username or not admin_password_hash:
        raise HTTPException(
            status_code=500,
            detail="Admin credentials are not configured."
        )

    if data.username != admin_username:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    if not verify_password(
        data.password,
        admin_password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    access_token = create_access_token(
        data.username
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }