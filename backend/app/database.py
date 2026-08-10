from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

from app.config import DATABASE_URL

SQLALCHEMY_DATABASE_URL = DATABASE_URL or os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required. Please set DATABASE_URL in your .env file.")
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from sqlalchemy import MetaData
metadata_obj = MetaData(schema="bizdial1")
Base = declarative_base(metadata=metadata_obj)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
