import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base

# Models
from app.models.client import Client
from app.models.booking import Booking
from app.models.gallery import Gallery
from app.models.photo import Photo

# Routes
from app.routes.bookings import router as booking_router
from app.routes.galleries import router as gallery_router
from app.routes.photos import router as photo_router
from app.routes.dashboard import router as dashboard_router
from app.routes.clients import router as client_router
from app.routes.auth import router as auth_router
from app.routes.client_auth import router as client_auth_router
# =========================================================
# DATABASE
# =========================================================

# Create all database tables
Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Passionate Clicker API",
    description="Backend API for Passionate Clicker Photography",
    version="1.0.0",
)
# =========================================================
# STATIC UPLOADED FILES
# =========================================================

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "https://passionate-clicker.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# API ROUTES
# =========================================================

# Booking routes
app.include_router(booking_router)
app.include_router(gallery_router)
app.include_router(photo_router)
app.include_router(dashboard_router)
app.include_router(client_router)
app.include_router(auth_router)
app.include_router(client_auth_router)
# =========================================================
# BASIC ROUTES
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Passionate Clicker API is running",
        "status": "success",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }