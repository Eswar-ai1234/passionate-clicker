from database import SessionLocal
from app.models.client import Client
from security import verify_password

db = SessionLocal()

try:
    email = "testuser2@gmail.com"

    client = (
        db.query(Client)
        .filter(Client.email == email)
        .first()
    )

    if not client:
        print("❌ Client not found")
    else:
        print("Client ID:", client.id)
        print("Email:", client.email)
        print("Password hash exists:", bool(client.password_hash))
        print("Password hash:", client.password_hash)

        test_password = input("Enter the NEW password you used during reset: ")

        result = verify_password(
            test_password,
            client.password_hash
        )

        print("Password verification:", result)

finally:
    db.close()