from sqlalchemy import Column, Integer, String, Date, Text, DateTime
from database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), nullable=False)

    phone = Column(String(20), nullable=False)

    service = Column(String(100), nullable=False)

    shoot_date = Column(Date, nullable=False)

    status = Column(
        String(30),
        default="Pending",
        nullable=False
    )

    notes = Column(Text, nullable=True)

    # Client portal login password (stored as a hash)
    password_hash = Column(String(255), nullable=True)

    # Password reset fields
    reset_token_hash = Column(String(255), nullable=True)

    reset_token_expires_at = Column(
        DateTime,
        nullable=True
    )