import sys
with open('routes/owner.py', 'r') as f:
    text = f.read()

target = '    review = Review(\n        business_id=business_id,\n        user_id=1, # Default user id since owner added it manually'
if target not in text:
    target = target.replace('\n', '\r\n')

replacement = '''    customer_name = payload.col1 if payload.col1 and payload.col1.strip() else "Anonymous"
    user = db.query(User).filter(User.name == customer_name).first()
    if not user:
        user = User(
            name=customer_name, 
            email=f"{customer_name.replace(' ', '').lower()[:10]}@example.com", 
            phone="0000000000", 
            password_hash="dummy", 
            role="customer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    review = Review(
        business_id=business_id,
        user_id=user.id,'''

text = text.replace(target, replacement)
with open('routes/owner.py', 'w') as f:
    f.write(text)
print("Done!")
