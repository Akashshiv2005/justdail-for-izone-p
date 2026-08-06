from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.business import Business
from app.models.verification_models import BusinessOwnerProfile, BusinessDocument, VerificationStatusEnum, VerificationAuditLog
from app.verification_engine.duplicate_check import DuplicateDetectionEngine
from app.verification_engine.quality_score import QualityScoreEvaluator
from app.auth_utils import get_password_hash, get_current_admin
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os, shutil

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ----------------- OTP SIMULATION -----------------
@router.post("/api/auth/send-otp")
def send_otp(destination: str = Form(...), type: str = Form(...)):
    # Simulates sending Email/Mobile OTP
    return {"message": f"OTP sent successfully to {destination}", "otp_code": "123456"}

@router.post("/api/auth/verify-otp")
def verify_otp(destination: str = Form(...), otp_code: str = Form(...)):
    if otp_code == "123456" or otp_code == "999999":
        return {"status": "verified", "message": "OTP verification successful"}
    raise HTTPException(status_code=400, detail="Invalid OTP code")

# ----------------- ENTERPRISE REGISTRATION -----------------
@router.post("/api/auth/register-enterprise")
async def register_enterprise_business(
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    password: str = Form(...),
    business_name: str = Form(...),
    display_name: str = Form(None),
    business_type: str = Form("Proprietorship"),
    category: str = Form(...),
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
    # 1. Duplicate Checks
    dup_res = DuplicateDetectionEngine.check_duplicates(db, email, phone, gst_number, pan_number, business_name)
    if dup_res["has_duplicate"]:
        raise HTTPException(status_code=400, detail=" | ".join(dup_res["flags"]))

    # 2. Create User
    user = User(
        name=full_name,
        email=email,
        phone=phone,
        hashed_password=get_password_hash(password),
        role=RoleEnum.owner
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 3. Create Business
    business = Business(
        owner_id=user.id,
        business_name=business_name,
        short_description=display_name,
        category=category,
        description=description,
        phone=phone,
        whatsapp=whatsapp,
        website=website,
        address=address,
        area=area,
        city=city or "Trichy",
        pincode=pincode,
        google_map_url=map_url,
        is_verified=False,
        approval_status="Pending",
        working_days=working_days,
        seo_title=seo_title,
        seo_description=seo_description,
        seo_keywords=seo_keywords,
        slug=seo_slug
    )
    db.add(business)
    db.commit()
    db.refresh(business)

    # 4. Create Business Owner Profile
    profile = BusinessOwnerProfile(
        business_id=business.id,
        email_verified=True,
        mobile_verified=True,
        business_type=business_type,
        pan_number=pan_number,
        gst_number=gst_number,
        service_radius_km=float(service_radius) if service_radius else 10.0,
        location_type=location_type or "Store",
        facebook_url=facebook,
        instagram_url=instagram,
        linkedin_url=linkedin,
        twitter_url=twitter,
        features=[s.strip() for s in services_offered.split(",")] if services_offered else [],
        working_hours={"sunday": sunday_hours} if sunday_hours else None,
        verification_status=VerificationStatusEnum.pending
    )
    db.add(profile)
    
    if category or sub_category:
        from app.models.business_category_mapping import BusinessCategoryMapping
        from app.models.category import Category
        from app.models.subcategory import Subcategory
        cat = db.query(Category).filter(Category.name == category).first() if category else None
        subcat = db.query(Subcategory).filter(Subcategory.name == sub_category).first() if sub_category else None
        mapping = BusinessCategoryMapping(
            business_id=business.id,
            category_id=cat.id if cat else None,
            subcategory_id=subcat.id if subcat else None
        )
        db.add(mapping)
    db.add(profile)
    db.commit()

    # 5. Handle Documents
    def save_file(doc_file: UploadFile, doc_type: str):
        loc = os.path.join(UPLOAD_DIR, f"{business.id}_{doc_type}_{doc_file.filename}")
        with open(loc, "wb") as buf:
            shutil.copyfileobj(doc_file.file, buf)
        rel_path = f"/uploads/{business.id}_{doc_type}_{doc_file.filename}"
        b_doc = BusinessDocument(
            business_id=business.id,
            doc_type=doc_type,
            document_url=rel_path,
            status=VerificationStatusEnum.pending
        )
        db.add(b_doc)

    if business_reg_doc: save_file(business_reg_doc, "Registration Certificate")
    if pan_doc: save_file(pan_doc, "PAN Card")
    if gstin_doc: save_file(gstin_doc, "GST Certificate")
    
    if logo_file:
        loc = os.path.join(UPLOAD_DIR, f"{business.id}_logo_{logo_file.filename}")
        with open(loc, "wb") as buf:
            shutil.copyfileobj(logo_file.file, buf)
        business.logo_url = f"/uploads/{business.id}_logo_{logo_file.filename}"
        
    if cover_file:
        loc = os.path.join(UPLOAD_DIR, f"{business.id}_cover_{cover_file.filename}")
        with open(loc, "wb") as buf:
            shutil.copyfileobj(cover_file.file, buf)
        business.cover_image_url = f"/uploads/{business.id}_cover_{cover_file.filename}"

    db.commit()

    # 6. Calculate Quality Score
    docs = db.query(BusinessDocument).filter(BusinessDocument.business_id == business.id).all()
    q_score = QualityScoreEvaluator.calculate_business_quality(business, profile, docs)
    profile.quality_score = q_score["quality_score"]
    profile.badges = q_score["badges"]
    db.commit()

    return {
        "message": "Enterprise Registration submitted successfully. Pending Admin Verification.",
        "business_id": business.id,
        "quality_score": profile.quality_score
    }

# ----------------- ADMIN VERIFICATION PANEL -----------------
@router.get("/api/admin/verification/list", dependencies=[Depends(get_current_admin)])
def get_verification_requests(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Business)
    if status:
        query = query.filter(Business.approval_status == status)
    
    businesses = query.all()
    results = []
    for b in businesses:
        owner = db.query(User).filter(User.id == b.owner_id).first()
        profile = db.query(BusinessOwnerProfile).filter(BusinessOwnerProfile.business_id == b.id).first()
        docs = db.query(BusinessDocument).filter(BusinessDocument.business_id == b.id).all()

        results.append({
            "business_id": b.id,
            "business_name": b.business_name,
            "category": b.category,
            "city": b.city,
            "owner_name": owner.name if owner else "Unknown",
            "owner_email": owner.email if owner else "-",
            "owner_phone": owner.phone if owner else "-",
            "approval_status": b.approval_status or "Pending",
            "is_verified": b.is_verified,
            "quality_score": profile.quality_score if profile else 50.0,
            "badges": profile.badges if profile else ["Phone Verified"],
            "documents": [
                {
                    "id": d.id,
                    "doc_type": d.doc_type,
                    "document_url": d.document_url,
                    "status": d.status.value
                } for d in docs
            ]
        })
    return results

@router.post("/api/admin/verification/approve-doc", dependencies=[Depends(get_current_admin)])
def approve_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(BusinessDocument).filter(BusinessDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.status = VerificationStatusEnum.verified
    
    # Recalculate Quality Score
    b = db.query(Business).filter(Business.id == doc.business_id).first()
    p = db.query(BusinessOwnerProfile).filter(BusinessOwnerProfile.business_id == doc.business_id).first()
    docs = db.query(BusinessDocument).filter(BusinessDocument.business_id == doc.business_id).all()

    if b and p:
        q_res = QualityScoreEvaluator.calculate_business_quality(b, p, docs)
        p.quality_score = q_res["quality_score"]
        p.badges = q_res["badges"]

    db.commit()
    return {"message": "Document approved", "quality_score": p.quality_score if p else 0}
