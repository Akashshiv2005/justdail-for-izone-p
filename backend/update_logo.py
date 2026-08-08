import psycopg2
conn = psycopg2.connect('postgresql://postgres:postgre%40123@localhost:5432/bizdial1')
cur = conn.cursor()
cur.execute("UPDATE bizdial1.businesses SET logo_url = 'http://127.0.0.1:8000/uploads/2_Business Logo_134281330995550312.jpg' WHERE id = 2")
conn.commit()
print('Updated Parashy Cafe logo in DB')
