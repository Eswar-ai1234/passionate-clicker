from sqlalchemy import text
from database import engine

with engine.begin() as connection:
    connection.execute(text("""
        ALTER TABLE clients
        ADD COLUMN IF NOT EXISTS reset_token_hash VARCHAR(255);
    """))

    connection.execute(text("""
        ALTER TABLE clients
        ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMP;
    """))

print("✅ Password reset fields added successfully!")