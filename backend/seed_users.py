import sys
import os

# Add backend directory to sys.path
sys.path.append(r'd:\izone justdial\backend')

from database import SessionLocal
from models.user import User, RoleEnum
from models.business import Business
from auth_utils import get_password_hash

db = SessionLocal()

# Create Admin User
admin = db.query(User).filter(User.email == "admin@justdial.com").first()
if not admin:
    admin = User(
        name="Super Admin",
        email="admin@justdial.com",
        phone="9999999999",
        hashed_password=get_password_hash("admin123"),
        role=RoleEnum.admin
    )
    db.add(admin)
    print("Created admin@justdial.com / admin123")
else:
    print("Admin exists")

# Create Owner User
owner = db.query(User).filter(User.email == "owner@justdial.com").first()
if not owner:
    owner = User(
        name="Test Owner",
        email="owner@justdial.com",
        phone="8888888888",
        hashed_password=get_password_hash("owner123"),
        role=RoleEnum.owner
    )
    db.add(owner)
    db.flush() # To get owner.id
    
    # Create Business for owner
    biz = Business(
        owner_id=owner.id,
        business_name="Test Business",
        category="Test Category",
        phone="8888888888",
        city="Test City",
        is_verified=True,
        approval_status="Approved"
    )
    db.add(biz)
    print("Created owner@justdial.com / owner123")
else:
    print("Owner exists")

db.commit()
