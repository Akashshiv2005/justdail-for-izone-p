import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise ValueError("DATABASE_URL environment variable is required. Please set DATABASE_URL in your .env file.")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

conn = psycopg2.connect(db_url)
cur = conn.cursor()
cur.execute("UPDATE bizdial1.businesses SET logo_url = '/uploads/2_Business Logo_134281330995550312.jpg' WHERE id = 2")
conn.commit()
print('Updated Parashy Cafe logo in DB with relative URL')
