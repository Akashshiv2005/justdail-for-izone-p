from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.business import Business
from app.auth_utils import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import os
import shutil

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/api/auth/register")
async def register_business(
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone: str = Form(...),
    business_name: str = Form(...),
    display_name: str = Form(None),
    business_type: str = Form(None),
    category: str = Form(None),
    sub_category: str = Form(None),
    description: str = Form(None),
    city: str = Form(None),
    area: str = Form(None),
    pincode: str = Form(None),
    address: str = Form(None),
    service_radius: str = Form("10"),
    location_type: str = Form("Store"),
    map_url: str = Form(None),
    whatsapp: str = Form(None),
    website: str = Form(None),
    facebook: str = Form(None),
    instagram: str = Form(None),
    twitter: str = Form(None),
    linkedin: str = Form(None),
    pan_number: str = Form(None),
    gst_number: str = Form(None),
    working_days: str = Form(None),
    sunday_hours: str = Form(None),
    services_offered: str = Form(None),
    seo_slug: str = Form(None),
    seo_title: str = Form(None),
    seo_description: str = Form(None),
    seo_keywords: str = Form(None),
    business_reg_doc: UploadFile = File(None),
    pan_doc: UploadFile = File(None),
    gstin_doc: UploadFile = File(None),
    logo_file: UploadFile = File(None),
    cover_file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create Owner User
    hashed_pw = get_password_hash(password)
    new_user = User(
        name=full_name,
        email=email,
        phone=phone,
        hashed_password=hashed_pw,
        role=RoleEnum.owner
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Handle File Upload
    reg_url = ""
    pan_url = ""
    gstin_url = ""
    logo_url = ""
    cover_url = ""

    def save_file(upload_file: UploadFile):
        file_location = os.path.join(UPLOAD_DIR, upload_file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        return f"/uploads/{upload_file.filename}"

    if business_reg_doc: reg_url = save_file(business_reg_doc)
    if pan_doc: pan_url = save_file(pan_doc)
    if gstin_doc: gstin_url = save_file(gstin_doc)
    if logo_file: logo_url = save_file(logo_file)
    if cover_file: cover_url = save_file(cover_file)

    from app.map_utils import extract_coordinates_from_url
    coords = extract_coordinates_from_url(map_url)
    lat = coords[0] if coords else None
    lng = coords[1] if coords else None

    # Create Business Pending Approval
    new_business = Business(
        owner_id=new_user.id,
        business_name=business_name,
        short_description=display_name,
        category=category,
        description=description,
        phone=phone,
        whatsapp=whatsapp,
        website=website,
        address=address,
        area=area,
        city=city or "Trichy",  # default to Trichy if not provided
        pincode=pincode,
        google_map_url=map_url,
        latitude=lat,
        longitude=lng,
        verification_doc_url=reg_url,
        pan_card_doc_url=pan_url,
        gstin_doc_url=gstin_url,
        logo_url=logo_url,
        cover_image_url=cover_url,
        is_verified=False,
        approval_status="Pending",
        working_days=working_days,
        seo_title=seo_title,
        seo_description=seo_description,
        seo_keywords=seo_keywords,
        slug=seo_slug
    )
    db.add(new_business)
    db.commit()
    db.refresh(new_business)

    from app.models.verification_models import BusinessOwnerProfile
    profile = BusinessOwnerProfile(
        business_id=new_business.id,
        business_type=business_type or "Proprietorship",
        pan_number=pan_number,
        gst_number=gst_number,
        service_radius_km=float(service_radius) if service_radius else 10.0,
        location_type=location_type or "Store",
        facebook_url=facebook,
        instagram_url=instagram,
        linkedin_url=linkedin,
        twitter_url=twitter,
        features=[s.strip() for s in services_offered.split(",")] if services_offered else []
    )
    db.add(profile)
    
    if category or sub_category:
        from app.models.business_category_mapping import BusinessCategoryMapping
        from app.models.category import Category
        from app.models.subcategory import Subcategory
        cat = db.query(Category).filter(Category.name == category).first() if category else None
        subcat = db.query(Subcategory).filter(Subcategory.name == sub_category).first() if sub_category else None
        mapping = BusinessCategoryMapping(
            business_id=new_business.id,
            category_id=cat.id if cat else None,
            subcategory_id=subcat.id if subcat else None
        )
        db.add(mapping)

    db.commit()
    
    return {"message": "Registration successful. Pending admin approval."}

from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

@router.post("/api/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Verify role
    if payload.role == "owner":
        business = db.query(Business).filter(Business.owner_id == user.id).first()
        if not business:
            raise HTTPException(status_code=400, detail="No business associated with this account")
        if business.approval_status == "Pending":
            raise HTTPException(status_code=403, detail="Your business registration is pending admin approval")
        elif business.approval_status == "Rejected":
            raise HTTPException(status_code=403, detail="Your business registration request was rejected by the admin")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value}, expires_delta=access_token_expires
        )
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value
            },
            "business": {
                "id": business.id,
                "name": business.business_name
            }
        }
    elif payload.role == "admin":
        if user.role != RoleEnum.admin:
            raise HTTPException(status_code=403, detail="Unauthorized role access")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value}, expires_delta=access_token_expires
        )
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value
            }
        }
    raise HTTPException(status_code=400, detail="Invalid role specified")


class ForgotPasswordRequest(BaseModel):
    email: str
    new_password: str

@router.post("/api/auth/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email, User.role == RoleEnum.owner).first()
    if not user:
        raise HTTPException(status_code=404, detail="Business owner with this email not found")
    
    user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

