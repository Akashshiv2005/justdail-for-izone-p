from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Using a standard Postgres URI. The user must provide the exact pgAdmin credentials.
# Format: postgresql://<username>:<password>@<host>:<port>/<dbname>
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost:5432/bizdial1")
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
