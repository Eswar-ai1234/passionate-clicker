from sqlalchemy import text
from database import engine

with engine.begin() as connection:
    connection.execute(
        text("""
            ALTER TABLE clients
            ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
        """)
    )

print("✅ password_hash column added successfully!")