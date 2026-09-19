from sqlalchemy import Column, Integer, String, Date, DateTime
from datetime import datetime

from database import Base


class Gallery(Base):
    __tablename__ = "galleries"

    id = Column(Integer, primary_key=True, index=True)

    client_name = Column(String(100), nullable=False)

    gallery_name = Column(String(150), nullable=False)

    event_type = Column(String(100), nullable=False)

    event_date = Column(Date, nullable=False)

    gallery_code = Column(String(50), unique=True, nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)