from app.database import engine
# pyrefly: ignore [missing-import]
from sqlalchemy import text

with engine.begin() as conn:
    print("Dropping schema public cascade...")
    conn.execute(text("DROP SCHEMA public CASCADE"))
    print("Creating schema public...")
    conn.execute(text("CREATE SCHEMA public"))
    conn.execute(text("GRANT ALL ON SCHEMA public TO postgres"))
    conn.execute(text("GRANT ALL ON SCHEMA public TO public"))

print("Schema reset successfully!")
