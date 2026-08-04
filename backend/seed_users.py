import sys
import os

from database import SessionLocal
import models.brand
import models.business
import models.business_category_mapping
import models.business_extras
import models.business_service_mapping
import models.category
import models.category_keyword
import models.location
import models.master_service
import models.review
import models.search_config
import models.seo_models
import models.subcategory
import models.testimonial
import models.user
import models.verification_models

from models.user import User, RoleEnum
from models.business import Business
from auth_utils import get_password_hash

db = SessionLocal()

# Create Admin User
admin = db.query(User).filter(User.email == "admin@gmail.com").first()
if not admin:
    admin = User(
        name="Super Admin",
        email="admin@gmail.com",
        phone="9999999998", # Using a different phone to avoid unique violation if admin@justdial.com already exists
        hashed_password=get_password_hash("admin123"),
        role=RoleEnum.admin
    )
    db.add(admin)
    print("Created admin@gmail.com / admin123")
else:
    print("Admin exists")

# Create Owner User
owner = db.query(User).filter(User.email == "owner@gmail.com").first()
if not owner:
    owner = User(
        name="Test Owner",
        email="owner@gmail.com",
        phone="8888888887",
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
        phone="8888888887",
        city="Test City",
        is_verified=True,
        approval_status="Approved"
    )
    db.add(biz)
    print("Created owner@gmail.com / owner123")
else:
    print("Owner exists")

db.commit()
