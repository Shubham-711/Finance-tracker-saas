import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load .env variables if running locally
load_dotenv()

# Get DB URL from environment variable, or fall back to empty string
# In production (Render), we will set this variable in their dashboard.
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback for local testing if you haven't set the env var yet
    # (KEEP THIS PRIVATE OR USE A LOCAL .env FILE)
    DATABASE_URL = "postgresql://user:password@localhost:5432/finance_db"

# Fix for some hosting providers that start URL with "postgres://" instead of "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()