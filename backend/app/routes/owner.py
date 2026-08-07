from pydantic import BaseModel

class SupportTicketCreate(BaseModel):
    subject: str = "Help Center Request"
    message: str

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.business import Business
from app.models.user import User
from app.models.business_extras import Product, Service, Lead, GalleryImage, Staff, Invoice, Promotion, SupportTicket
from typing import Optional

import os
import shutil
from fastapi import UploadFile, File
from app.models.verification_models import BusinessDocument, VerificationStatusEnum

from app.auth_utils import get_current_owner

router = APIRouter(dependencies=[Depends(get_current_owner)])

@router.get("/api/owner/login-options")
def get_owner_login_options(db: Session = Depends(get_db)):
    businesses = db.query(Business).all()
    results = []
    for business in businesses:
        owner = db.query(User).filter(User.id == business.owner_id).first()
        if not owner:
            continue
        results.append({
            "owner_id": owner.id,
            "business_id": business.id,
            "owner_name": owner.name,
            "business_name": business.business_name,
            "email": owner.email,
            "phone": owner.phone,
        })
    return results


@router.get("/api/owner/{business_id}/profile")
def get_owner_profile(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return {}

    owner = db.query(User).filter(User.id == business.owner_id).first()
    return {
        "business_id": business.id,
        "owner_id": business.owner_id,
        "owner_name": owner.name if owner else "Owner",
        "owner_email": owner.email if owner else "",
        "owner_phone": owner.phone if owner else "",
        "business_name": business.business_name,
        "category": business.primary_category.name if business.primary_category else business.category,
        "primary_category_id": business.primary_category.id if business.primary_category else None,
        "primary_subcategory_id": business.primary_subcategory.id if business.primary_subcategory else None,
        "subcategory": business.primary_subcategory.name if business.primary_subcategory else "",
        "address": business.address,
        "city": business.city,
        "pincode": business.pincode,
        "phone": business.phone,
        "whatsapp": business.whatsapp,
        "website": business.website,
        "is_verified": business.is_verified,
        "average_rating": business.average_rating,
        "total_reviews": business.total_reviews,
        "profile_views": business.profile_views,
        "latitude": business.latitude,
        "longitude": business.longitude,
        "google_map_url": business.google_map_url,
        "logo_url": business.logo_url,
        "cover_image_url": business.cover_image_url,
    }

class ProfileContactUpdate(BaseModel):
    address: Optional[str] = None
    google_map_url: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None

@router.put("/api/owner/{business_id}/profile/contact")
def update_owner_contact(business_id: int, payload: ProfileContactUpdate, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    if payload.address is not None:
        business.address = payload.address
    if payload.google_map_url is not None:
        business.google_map_url = payload.google_map_url
        import re
        match = re.search(r'@([-.\d]+),([-.\d]+)', payload.google_map_url)
        if match:
            business.latitude = float(match.group(1))
            business.longitude = float(match.group(2))
            
    if payload.phone is not None:
        business.phone = payload.phone
    if payload.whatsapp is not None:
        business.whatsapp = payload.whatsapp
        
    db.commit()
    db.refresh(business)
    return {"status": "success"}

class CategoryUpdate(BaseModel):
    category_id: int
    subcategory_id: int

@router.put("/api/owner/{business_id}/profile/category")
def update_owner_category(business_id: int, payload: CategoryUpdate, db: Session = Depends(get_db)):
    from app.models.business_category_mapping import BusinessCategoryMapping
    from app.models.category import Category
    from app.models.subcategory import Subcategory
    
    mapping = db.query(BusinessCategoryMapping).filter(BusinessCategoryMapping.business_id == business_id).first()
    if not mapping:
        mapping = BusinessCategoryMapping(business_id=business_id)
        db.add(mapping)
    
    mapping.category_id = payload.category_id
    mapping.subcategory_id = payload.subcategory_id
    
    # Update legacy string field
    cat = db.query(Category).filter(Category.id == payload.category_id).first()
    business = db.query(Business).filter(Business.id == business_id).first()
    if cat and business:
        business.category = cat.name
        
    db.commit()
    return {"message": "Category mapped successfully"}

@router.get("/api/owner/{business_id}/stats")
def get_owner_stats(business_id: int, db: Session = Depends(get_db)):
    from app.models.review import Review
    business = db.query(Business).filter(Business.id == business_id).first()
    leads_count = db.query(Lead).filter(Lead.business_id == business_id).count()
    pending_leads_count = db.query(Lead).filter(Lead.business_id == business_id, Lead.status == "Pending").count()
    pending_reviews_count = db.query(Review).filter(Review.business_id == business_id, Review.moderation_status == "pending").count()
    
    return {
        "profile_views": business.profile_views if business else 0,
        "leads_generated": leads_count,
        "customer_messages": business.whatsapp_clicks if business else 0,
        "profile_rating": business.average_rating if business else 0.0,
        "new_inquiries_count": pending_leads_count,
        "new_reviews_count": pending_reviews_count
    }

# ======================== PRODUCTS ========================

@router.get("/api/owner/{business_id}/products")
def get_owner_products(business_id: int, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.business_id == business_id).all()

class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None
    price: Optional[float] = 0
    stock_quantity: Optional[int] = 0

@router.post("/api/owner/{business_id}/products")
def create_product(business_id: int, payload: ProductCreate, db: Session = Depends(get_db)):
    product = Product(business_id=business_id, name=payload.name, category=payload.category, price=payload.price, stock_quantity=payload.stock_quantity)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/api/owner/{business_id}/products/{item_id}")
def update_product(business_id: int, item_id: int, payload: ProductCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == item_id, Product.business_id == business_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.name = payload.name
    if payload.category is not None: product.category = payload.category
    if payload.price is not None: product.price = payload.price
    if payload.stock_quantity is not None: product.stock_quantity = payload.stock_quantity
    db.commit()
    return product

@router.delete("/api/owner/{business_id}/products/{item_id}")
def delete_product(business_id: int, item_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == item_id, Product.business_id == business_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}

# ======================== SERVICES (Master Service Mappings) ========================

from app.models.business_service_mapping import BusinessServiceMapping
from app.models.master_service import MasterService

class OwnerServiceCreate(BaseModel):
    master_service_id: Optional[int] = None
    custom_name: Optional[str] = None
    price: Optional[float] = 0
    description: Optional[str] = None

@router.get("/api/owner/{business_id}/master-services")
def get_available_master_services(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return []
    
    # Allow querying all master services or only for the selected subcategory
    subcat_id = business.primary_subcategory.id if business.primary_subcategory else None
    
    if subcat_id:
        return db.query(MasterService).filter(MasterService.subcategory_id == subcat_id).all()
    return db.query(MasterService).all()

@router.get("/api/owner/{business_id}/services")
def get_owner_services(business_id: int, db: Session = Depends(get_db)):
    mappings = db.query(BusinessServiceMapping).filter(BusinessServiceMapping.business_id == business_id).all()
    results = []
    for m in mappings:
        ms = db.query(MasterService).filter(MasterService.id == m.master_service_id).first()
        results.append({
            "id": m.id,
            "master_service_id": m.master_service_id,
            "name": ms.name if ms else "Unknown Service",
            "base_price": m.price,
            "duration": m.description, # using description field for any extra text for now
            "popularity_score": 0
        })
    return results

@router.post("/api/owner/{business_id}/services")
def create_service(business_id: int, payload: OwnerServiceCreate, db: Session = Depends(get_db)):
    ms_id = payload.master_service_id
    
    if not ms_id and payload.custom_name:
        business = db.query(Business).filter(Business.id == business_id).first()
        if not business or not business.primary_subcategory:
            raise HTTPException(status_code=400, detail="Business has no subcategory mapped")
            
        new_ms = MasterService(
            subcategory_id=business.primary_subcategory.id,
            name=payload.custom_name,
            is_active=True
        )
        db.add(new_ms)
        db.commit()
        db.refresh(new_ms)
        ms_id = new_ms.id
        
    mapping = BusinessServiceMapping(
        business_id=business_id, 
        master_service_id=ms_id, 
        price=payload.price,
        description=payload.description
    )
    db.add(mapping)
    db.commit()
    db.refresh(mapping)
    
    ms = db.query(MasterService).filter(MasterService.id == mapping.master_service_id).first()
    return {
        "id": mapping.id,
        "name": ms.name if ms else "",
        "base_price": mapping.price,
        "duration": mapping.description
    }

@router.put("/api/owner/{business_id}/services/{item_id}")
def update_service(business_id: int, item_id: int, payload: OwnerServiceCreate, db: Session = Depends(get_db)):
    mapping = db.query(BusinessServiceMapping).filter(BusinessServiceMapping.id == item_id, BusinessServiceMapping.business_id == business_id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Service mapping not found")
    
    if payload.price is not None: mapping.price = payload.price
    if payload.description is not None: mapping.description = payload.description
    db.commit()
    
    ms = db.query(MasterService).filter(MasterService.id == mapping.master_service_id).first()
    return {
        "id": mapping.id,
        "name": ms.name if ms else "",
        "base_price": mapping.price,
        "duration": mapping.description
    }

@router.delete("/api/owner/{business_id}/services/{item_id}")
def delete_service(business_id: int, item_id: int, db: Session = Depends(get_db)):
    mapping = db.query(BusinessServiceMapping).filter(BusinessServiceMapping.id == item_id, BusinessServiceMapping.business_id == business_id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Service mapping not found")
    db.delete(mapping)
    db.commit()
    return {"message": "Service mapping deleted"}

# ======================== LEADS ========================

class LeadCreate(BaseModel):
    customer_name: str
    customer_phone: str
    service_interest: Optional[str] = None

@router.get("/api/owner/{business_id}/leads")
def get_owner_leads(business_id: int, db: Session = Depends(get_db)):
    return db.query(Lead).filter(Lead.business_id == business_id).all()

@router.post("/api/owner/{business_id}/leads")
def create_lead(business_id: int, payload: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(business_id=business_id, customer_name=payload.customer_name, customer_phone=payload.customer_phone, service_interest=payload.service_interest)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

class LeadUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    service_interest: Optional[str] = None
    status: Optional[str] = None

@router.put("/api/owner/{business_id}/leads/{item_id}")
def update_lead(business_id: int, item_id: int, payload: LeadUpdate, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == item_id, Lead.business_id == business_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    if payload.customer_name is not None:
        lead.customer_name = payload.customer_name
    if payload.customer_phone is not None:
        lead.customer_phone = payload.customer_phone
    if payload.service_interest is not None:
        lead.service_interest = payload.service_interest
    if payload.status is not None:
        lead.status = payload.status
        
    db.commit()
    return lead

@router.delete("/api/owner/{business_id}/leads/{item_id}")
def delete_lead(business_id: int, item_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == item_id, Lead.business_id == business_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted"}

# ======================== GALLERY ========================

class GalleryCreate(BaseModel):
    image_url: str
    title: Optional[str] = None
    category: Optional[str] = "General"

@router.get("/api/owner/{business_id}/gallery")
def get_owner_gallery(business_id: int, db: Session = Depends(get_db)):
    return db.query(GalleryImage).filter(GalleryImage.business_id == business_id).all()

@router.post("/api/owner/{business_id}/gallery")
def create_gallery_image(business_id: int, payload: GalleryCreate, db: Session = Depends(get_db)):
    img = GalleryImage(business_id=business_id, image_url=payload.image_url, title=payload.title, category=payload.category)
    db.add(img)
    db.commit()
    db.refresh(img)
    return img

@router.put("/api/owner/{business_id}/gallery/{item_id}")
def update_gallery_image(business_id: int, item_id: int, payload: GalleryCreate, db: Session = Depends(get_db)):
    img = db.query(GalleryImage).filter(GalleryImage.id == item_id, GalleryImage.business_id == business_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    img.image_url = payload.image_url
    img.title = payload.title
    img.category = payload.category
    db.commit()
    db.refresh(img)
    return img

@router.delete("/api/owner/{business_id}/gallery/{item_id}")
def delete_gallery_image(business_id: int, item_id: int, db: Session = Depends(get_db)):
    img = db.query(GalleryImage).filter(GalleryImage.id == item_id, GalleryImage.business_id == business_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    db.delete(img)
    db.commit()
    return {"message": "Image deleted"}

# ======================== STAFF ========================

class StaffCreate(BaseModel):
    name: str
    role: Optional[str] = "Technician"
    email: Optional[str] = None
    phone: Optional[str] = None

@router.get("/api/owner/{business_id}/staff")
def get_owner_staff(business_id: int, db: Session = Depends(get_db)):
    return db.query(Staff).filter(Staff.business_id == business_id).all()

@router.post("/api/owner/{business_id}/staff")
def create_staff(business_id: int, payload: StaffCreate, db: Session = Depends(get_db)):
    from app.models.business_extras import StaffRole
    role_val = StaffRole.manager if payload.role == "Manager" else StaffRole.technician
    staff = Staff(business_id=business_id, name=payload.name, role=role_val, email=payload.email, phone=payload.phone)
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return staff

@router.put("/api/owner/{business_id}/staff/{item_id}")
def update_staff(business_id: int, item_id: int, payload: StaffCreate, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == item_id, Staff.business_id == business_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    staff.name = payload.name
    if payload.email is not None: staff.email = payload.email
    if payload.phone is not None: staff.phone = payload.phone
    db.commit()
    return staff

@router.delete("/api/owner/{business_id}/staff/{item_id}")
def delete_staff(business_id: int, item_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == item_id, Staff.business_id == business_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    db.delete(staff)
    db.commit()
    return {"message": "Staff deleted"}

# ======================== PROMOTIONS ========================

class PromotionCreate(BaseModel):
    campaign_name: str
    campaign_type: Optional[str] = None
    budget: Optional[float] = 0

@router.get("/api/owner/{business_id}/promotions")
def get_owner_promotions(business_id: int, db: Session = Depends(get_db)):
    return db.query(Promotion).filter(Promotion.business_id == business_id).all()

@router.post("/api/owner/{business_id}/promotions")
def create_promotion(business_id: int, payload: PromotionCreate, db: Session = Depends(get_db)):
    promo = Promotion(business_id=business_id, campaign_name=payload.campaign_name, campaign_type=payload.campaign_type, budget=payload.budget)
    db.add(promo)
    db.commit()
    db.refresh(promo)
    return promo

@router.delete("/api/owner/{business_id}/promotions/{promo_id}")
def delete_promotion(business_id: int, promo_id: int, db: Session = Depends(get_db)):
    promo = db.query(Promotion).filter(Promotion.id == promo_id, Promotion.business_id == business_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promotion not found")
    db.delete(promo)
    db.commit()
    return {"message": "Promotion deleted successfully"}

# ======================== DOCUMENTS ========================

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/api/owner/{business_id}/documents")
def get_owner_documents(business_id: int, db: Session = Depends(get_db)):
    docs = db.query(BusinessDocument).filter(BusinessDocument.business_id == business_id).all()
    return [
        {
            "id": d.id,
            "doc_type": d.doc_type,
            "document_url": d.document_url,
            "status": d.status.value,
            "rejection_reason": d.rejection_reason,
            "uploaded_at": d.uploaded_at
        } for d in docs
    ]

@router.post("/api/owner/{business_id}/documents")
def upload_owner_document(business_id: int, doc_type: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    loc = os.path.join(UPLOAD_DIR, f"{business_id}_{doc_type}_{file.filename}")
    with open(loc, "wb") as buf:
        shutil.copyfileobj(file.file, buf)
    rel_path = f"/uploads/{business_id}_{doc_type}_{file.filename}"
    
    b_doc = BusinessDocument(
        business_id=business_id,
        doc_type=doc_type,
        document_url=rel_path,
        status=VerificationStatusEnum.pending
    )
    db.add(b_doc)
    db.commit()
    db.refresh(b_doc)
    return {"message": "Document uploaded successfully", "id": b_doc.id}

@router.put("/api/owner/{business_id}/documents/{doc_id}")
def update_owner_document(business_id: int, doc_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    b_doc = db.query(BusinessDocument).filter(BusinessDocument.id == doc_id, BusinessDocument.business_id == business_id).first()
    if not b_doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    loc = os.path.join(UPLOAD_DIR, f"{business_id}_{b_doc.doc_type}_{file.filename}")
    with open(loc, "wb") as buf:
        shutil.copyfileobj(file.file, buf)
    rel_path = f"/uploads/{business_id}_{b_doc.doc_type}_{file.filename}"
    
    b_doc.document_url = rel_path
    b_doc.status = VerificationStatusEnum.pending
    b_doc.rejection_reason = None
    
    db.commit()
    return {"message": "Document updated successfully", "id": b_doc.id}

# ======================== INVOICES ========================

@router.get("/api/owner/{business_id}/invoices")
def get_owner_invoices(business_id: int, db: Session = Depends(get_db)):
    return db.query(Invoice).filter(Invoice.business_id == business_id).all()

# ======================== REVIEWS ========================

@router.get("/api/owner/{business_id}/reviews")
def get_owner_reviews(business_id: int, db: Session = Depends(get_db)):
    from app.models.review import Review
    from app.models.user import User
    reviews = db.query(Review).filter(Review.business_id == business_id).order_by(Review.created_at.desc()).all()
    results = []
    for r in reviews:
        user = db.query(User).filter(User.id == r.user_id).first()
        results.append({
            "id": r.id,
            "customer_name": user.name if user else "Anonymous",
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "status": "Active" if r.moderation_status == "approved" else "Inactive"
        })
    return results

class OwnerReviewCreate(BaseModel):
    customer_name: str = "Anonymous"
    rating: int = 5
    comment: str = ""
    status: str = "Active"

@router.post("/api/owner/{business_id}/reviews")
def create_owner_review(business_id: int, payload: OwnerReviewCreate, db: Session = Depends(get_db)):
    from app.models.review import Review
    from app.models.user import User
    from datetime import datetime
    rating = int(str(payload.rating).replace(" Stars", "").replace(" Star", "")) if payload.rating else 5
    date_val = datetime.now()
    customer_name = payload.customer_name if payload.customer_name and payload.customer_name.strip() else "Anonymous"
    user = db.query(User).filter(User.name == customer_name).first()
    if not user:
        user = User(
            name=customer_name, 
            email=f"dummy_{int(datetime.now().timestamp())}_{customer_name.replace(' ', '').lower()[:5]}@example.com", 
            phone=f"0000{int(datetime.now().timestamp())}"[-10:], 
            hashed_password="dummy", 
            role="customer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    review = Review(
        business_id=business_id,
        user_id=user.id,
        rating=rating,
        comment=payload.comment,
        moderation_status="approved" if payload.status == "Active" else "pending",
        created_at=date_val
    )
    db.add(review)
    db.commit()
    return {"message": "Review added"}

@router.put("/api/owner/{business_id}/reviews/{item_id}")
def update_owner_review(business_id: int, item_id: int, payload: OwnerReviewCreate, db: Session = Depends(get_db)):
    from app.models.review import Review
    from app.models.user import User
    
    review = db.query(Review).filter(Review.id == item_id, Review.business_id == business_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    user = db.query(User).filter(User.id == review.user_id).first()
    if user and payload.customer_name:
        user.name = payload.customer_name

    review.rating = int(str(payload.rating).replace(" Stars", "").replace(" Star", "")) if payload.rating else 5
    review.comment = payload.comment
    review.moderation_status = "approved" if payload.status == "Active" else "pending"
    db.commit()
    return {"message": "Review updated"}

@router.delete("/api/owner/{business_id}/reviews/{item_id}")
def delete_owner_review(business_id: int, item_id: int, db: Session = Depends(get_db)):
    from app.models.review import Review
    review = db.query(Review).filter(Review.id == item_id, Review.business_id == business_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}

# ======================== ANALYTICS & SETTINGS DUMMIES ========================

@router.get("/api/owner/{business_id}/analytics")
def get_owner_analytics(business_id: int):
    return []

@router.get("/api/owner/{business_id}/settings")
def get_owner_settings(business_id: int):
    return []

@router.get("/api/owner/{business_id}/support")
def get_owner_support(business_id: int):
    return []

# ======================== PLATFORM REVIEWS (BizDial Testimonials) ========================

class PlatformReviewCreate(BaseModel):
    rating: float
    review_text: str
    title: Optional[str] = None

@router.post("/api/owner/{business_id}/platform-review")
def submit_platform_review(business_id: int, payload: PlatformReviewCreate, db: Session = Depends(get_db)):
    from app.models.testimonial import Testimonial
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    owner = db.query(User).filter(User.id == business.owner_id).first()

    role = payload.title or f"Owner at {business.business_name}"
    name = owner.name if owner else "Business Owner"

    testimonial = Testimonial(
        name=name,
        role=role,
        text=payload.review_text,
        rating=payload.rating,
        is_active=False,
        status="pending",
        business_id=business_id,
        owner_id=business.owner_id,
    )
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return {"message": "Review submitted successfully! It will appear after admin approval.", "id": testimonial.id}

@router.get("/api/owner/{business_id}/platform-reviews")
def get_owner_platform_reviews(business_id: int, db: Session = Depends(get_db)):
    from app.models.testimonial import Testimonial
    reviews = db.query(Testimonial).filter(Testimonial.business_id == business_id).all()
    return [
        {
            "id": r.id,
            "rating": r.rating,
            "review_text": r.text,
            "role": r.role,
            "status": r.status or ("approved" if r.is_active else "pending"),
            "created_at": None,
        }
    ]

class OwnerPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

@router.put("/api/owner/{business_id}/password")
def update_owner_password(business_id: int, payload: OwnerPasswordUpdate, db: Session = Depends(get_db)):
    from app.auth_utils import verify_password, get_password_hash
    
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    user = db.query(User).filter(User.id == business.owner_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Owner not found")
        
    if not verify_password(payload.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

# ======================== SUPPORT TICKET ========================

@router.post("/api/owner/{business_id}/support-ticket")
def create_support_ticket(business_id: int, ticket: SupportTicketCreate, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    new_ticket = SupportTicket(
        business_id=business_id,
        subject=ticket.subject,
        message=ticket.message,
        category="Help Center",
        status="Open"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return {"message": "Support ticket created successfully", "id": new_ticket.id}
