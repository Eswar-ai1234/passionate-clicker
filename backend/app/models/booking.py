from sqlalchemy import Column, Integer, String, Date, Text
from database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    client_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=False
    )

    service = Column(
        String(100),
        nullable=False
    )

    shoot_date = Column(
        Date,
        nullable=False
    )

    location = Column(
        String(200),
        nullable=False
    )

    message = Column(
        Text,
        nullable=True
    )

    status = Column(
        String(30),
        default="New",
        nullable=False
    )