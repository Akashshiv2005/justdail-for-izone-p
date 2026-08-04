import os
from sqlalchemy import create_engine, text

db_url = os.getenv('DATABASE_URL', 'postgresql://postgres:1234@localhost:5432/bizdial')
try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in result]
        print(f"Found {len(tables)} tables:")
        for table in tables:
            count = conn.execute(text(f'SELECT COUNT(*) FROM "{table}"')).scalar()
            print(f"- {table}: {count} rows")
except Exception as e:
    print('Error:', e)
