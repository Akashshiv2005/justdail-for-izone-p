from app.database import engine
from sqlalchemy import text

with engine.begin() as conn:
    print("Dropping old schemas...")
    conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
    conn.execute(text("DROP SCHEMA IF EXISTS bizdial CASCADE"))
    
    print("Creating bizdial schema...")
    conn.execute(text("CREATE SCHEMA bizdial"))
    conn.execute(text("GRANT ALL ON SCHEMA bizdial TO postgres"))
    conn.execute(text("GRANT ALL ON SCHEMA bizdial TO public"))

    print("Creating public schema just in case...")
    conn.execute(text("CREATE SCHEMA public"))
    
    print("Creating alembic_version table manually...")
    conn.execute(text("CREATE TABLE IF NOT EXISTS bizdial.alembic_version (version_num VARCHAR(32) NOT NULL, CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num))"))
    conn.commit()

print("Schema 'bizdial' created and cleaned!")
