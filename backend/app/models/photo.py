from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime

from database import Base


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)

    gallery_id = Column(
        Integer,
        ForeignKey("galleries.id", ondelete="CASCADE"),
        nullable=False
    )

    filename = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )