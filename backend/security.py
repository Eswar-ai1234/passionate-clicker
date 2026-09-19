import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "passionate-clicker-change-this-secret"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    salt = os.urandom(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        200_000,
    )

    return salt.hex() + ":" + password_hash.hex()


def verify_password(
    password: str,
    stored_hash: str
) -> bool:

    try:
        salt_hex, hash_hex = stored_hash.split(":")

        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)

        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            200_000,
        )

        return hmac.compare_digest(
            actual_hash,
            expected_hash,
        )

    except (ValueError, TypeError):
        return False


# ADMIN TOKEN
def create_access_token(username: str) -> str:

    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": username,
        "role": "admin",
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# CLIENT TOKEN
def create_client_access_token(client_id: str) -> str:

    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": client_id,
        "role": "client",
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str):

    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
    )


# ADMIN-ONLY PROTECTION
def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    )
):

    token = credentials.credentials

    try:
        payload = decode_access_token(token)

        role = payload.get("role")
        username = payload.get("sub")

        configured_admin = os.getenv("ADMIN_USERNAME")

        if role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Admin access required."
            )

        if not configured_admin or username != configured_admin:
            raise HTTPException(
                status_code=403,
                detail="Admin access required."
            )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Admin session has expired. Please login again."
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin token."
        )