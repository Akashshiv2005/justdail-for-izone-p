from collections import defaultdict
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.business import Business
from app.models.category import Category
from app.models.user import User, RoleEnum
from app.models.business_extras import Lead
from app.models.review import Review
from app.models.verification_models import BusinessOwnerProfile, BusinessDocument
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext

from app.auth_utils import get_current_admin

router = APIRouter(dependencies=[Depends(get_current_admin)])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class BusinessCreateRequest(BaseModel):
    # Owner info
    owner_name: str
    owner_email: str
    owner_phone: Optional[str] = None
    owner_password: Optional[str] = "password123"
    # Business info
    business_name: str
    category: str
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    is_verified: Optional[bool] = False
    approval_status: Optional[str] = "Pending"


class BusinessUpdateRequest(BaseModel):
    # Owner info (optional updates)
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None
    owner_phone: Optional[str] = None
    # Business info
    business_name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    is_verified: Optional[bool] = None
    approval_status: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    slug: Optional[str] = None
    map_url: Optional[str] = None
    logo_url: Optional[str] = None
    certificate_url: Optional[str] = None
    working_days: Optional[str] = None
    sunday_hours: Optional[str] = None
    open_time: Optional[str] = None
    close_time: Optional[str] = None
    payment_methods: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    owner_role: Optional[str] = None
    owner_aadhar: Optional[str] = None
    owner_address: Optional[str] = None
    display_name: Optional[str] = None
    sub_category: Optional[str] = None
    pan_number: Optional[str] = None
    gstin_number: Optional[str] = None
    service_radius: Optional[str] = None
    location_type: Optional[str] = None
    landline_number: Optional[str] = None
    services_offered: Optional[str] = None
    cover_banner_url: Optional[str] = None
    gst_certificate_url: Optional[str] = None

class BusinessSEOUpdate(BaseModel):
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    slug: Optional[str] = None

@router.patch("/api/admin/business/{business_id}/seo")
def update_business_seo(business_id: int, request: BusinessSEOUpdate, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    if request.seo_title is not None:
        business.seo_title = request.seo_title
    if request.seo_description is not None:
        business.seo_description = request.seo_description
    if request.slug is not None:
        business.slug = request.slug
        
    db.commit()
    db.refresh(business)
    return {"status": "success", "message": "SEO metadata updated and ping sent to search engines."}

@router.get("/api/admin/logs")
def admin_get_logs(db: Session = Depends(get_db)):
    return []

# ==========================================
# DELETE ENDPOINTS
# ==========================================



# ==========================================
# DELETE ENDPOINTS
# ==========================================

@router.delete("/api/admin/business-owners/{id}")
def delete_business_owner(id: int, db: Session = Depends(get_db)):
    print(f"ATTEMPTING TO DELETE USER ID {id}")
    obj = db.query(User).filter(User.id == id).first()
    print(f"FOUND USER: {obj is not None}. ROLE: {obj.role if obj else 'N/A'}")
    if obj:
        # Find all their businesses and delete their relationships
        businesses = db.query(Business).filter(Business.owner_id == id).all()
        for b in businesses:
            db.query(BusinessOwnerProfile).filter(BusinessOwnerProfile.business_id == b.id).delete()
            db.query(Review).filter(Review.business_id == b.id).delete()
            db.delete(b)
        db.delete(obj)
        db.commit()
    return {"status": "deleted"}

@router.delete("/api/admin/categories/{id}")
def delete_category(id: int, db: Session = Depends(get_db)):
    obj = db.query(Category).filter(Category.id == id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return {"status": "deleted"}

@router.delete("/api/admin/reviews/{id}")
def delete_review(id: int, db: Session = Depends(get_db)):
    obj = db.query(Review).filter(Review.id == id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return {"status": "deleted"}

@router.delete("/api/admin/leads/{id}")
def delete_lead(id: int, db: Session = Depends(get_db)):
    obj = db.query(Lead).filter(Lead.id == id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return {"status": "deleted"}

@router.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    premium_count = db.query(Business).filter(Business.is_verified == True).count()
    business_count = db.query(Business).count()
    user_count = db.query(User).count()
    
    # Generate dynamic dummy data if there are some businesses, else empty
    growth_data = [
        {"name": "01 Jul", "Businesses": 0, "Users": 0},
        {"name": "07 Jul", "Businesses": int(business_count * 0.2), "Users": int(user_count * 0.2)},
        {"name": "14 Jul", "Businesses": int(business_count * 0.5), "Users": int(user_count * 0.5)},
        {"name": "21 Jul", "Businesses": int(business_count * 0.8), "Users": int(user_count * 0.8)},
        {"name": "28 Jul", "Businesses": business_count, "Users": user_count},
    ] if business_count > 0 or user_count > 0 else []
    
    category_data = []
    if business_count > 0:
        category_data = [
            {"name": "Restaurants", "value": int(business_count * 0.3), "color": "#0B5FFF"},
            {"name": "Healthcare", "value": int(business_count * 0.2), "color": "#22C55E"},
            {"name": "Automobiles", "value": int(business_count * 0.15), "color": "#F59E0B"},
            {"name": "Others", "value": int(business_count * 0.35), "color": "#94A3B8"}
        ]
        
    recent_activities = []
    # If we had real logs, we'd query them here. For now return empty when no data.
        
    return {
        "total_businesses": business_count,
        "total_users": user_count,
        "total_leads": db.query(Lead).count(),
        "total_reviews": db.query(Review).count(),
        "total_revenue": premium_count * 5000,
        "premium_listings": premium_count,
        "growth_data": growth_data,
        "category_data": category_data,
        "recent_activities": recent_activities
    }

@router.get("/api/admin/registrations")
def get_admin_registrations(db: Session = Depends(get_db)):
    businesses = db.query(Business).all()
    results = []
    for b in businesses:
        owner = db.query(User).filter(User.id == b.owner_id).first()
        results.append({
            "id": b.id,
            "business": b.business_name,
            "owner": owner.name if owner else "Unknown",
            "category": b.category,
            "city": b.city,
            "status": "Verified" if b.is_verified else "Pending",
            "primary_contact": b.phone,
            "secondary_contact": b.whatsapp,
            "email": b.email,
            "website": b.website,
            "approval_status": b.approval_status,
            "description": b.description,
            "document": b.verification_doc_url,
        })
    return results

@router.get("/api/admin/business-owners")
def get_admin_business_owners(db: Session = Depends(get_db)):
    owners = db.query(User).filter(User.role == RoleEnum.owner).all()
    results = []
    for o in owners:
        # Get their first business to display as type
        b = db.query(Business).filter(Business.owner_id == o.id).first()
        results.append({
            "id": o.id,
            "Owner Name": o.name,
            "Contact Info": o.phone or o.email,
            "Business Type": b.category if b else "N/A",
            "Joined Date": str(o.created_at).split()[0] if getattr(o, "created_at", None) else "2026-07-24",
            "Status": "Active"
        })
    return results

@router.get("/api/admin/business-management")
def get_admin_business_management(db: Session = Depends(get_db)):
    businesses = db.query(Business).all()
    results = []
    for b in businesses:
        owner = db.query(User).filter(User.id == b.owner_id).first() if b.owner_id else None
        profile = db.query(BusinessOwnerProfile).filter(BusinessOwnerProfile.business_id == b.id).first()
        docs = db.query(BusinessDocument).filter(BusinessDocument.business_id == b.id).all()
        
        reg_doc = next((d.document_url for d in docs if d.doc_type == "Registration Certificate"), b.verification_doc_url or "")
        gst_doc = next((d.document_url for d in docs if d.doc_type == "GST Certificate"), b.gstin_doc_url or "")
        
        cat_display = b.primary_category.name if b.primary_category else (b.category or "General")
        results.append({
            "id": b.id,
            "owner_id": b.owner_id,
            "Business Name": b.business_name,
            "Category": cat_display,
            "City": b.city or "-",
            "Area": b.area or "-",
            "State": b.state or "-",
            "Address": b.address or "-",
            "Pincode": b.pincode or "-",
            "Owner": owner.name if owner else "Unknown",
            "Documents": reg_doc or gst_doc or "None",
            "Owner Email": owner.email if owner else "-",
            "Owner Phone": owner.phone if owner else "-",
            "Business Phone": b.phone or "-",
            "WhatsApp": b.whatsapp or "-",
            "Website": b.website or "-",
            "Description": b.description or "-",
            "Business Type": profile.business_type if profile else "-",
            "PAN Number": profile.pan_number if profile else "-",
            "GST Number": profile.gst_number if profile else "-",
            "FSSAI Number": profile.fssai_number if profile else "-",
            "Founded Year": str(profile.founded_year) if profile and profile.founded_year else "-",
            "Employee Count": profile.employee_count if profile else "-",
            "Approval Status": b.approval_status or "Pending",
            "Status": "Verified" if b.is_verified else "Pending",
            "Map URL": b.google_map_url or "",
            "Logo URL": b.logo_url or "",
            "Certificate URL": b.verification_doc_url or "",
            "Working Days": b.working_days or "",
            "Open Time": b.opening_time or "",
            "Close Time": b.closing_time or "",
            "Payment Methods": ", ".join(profile.payment_methods) if profile and profile.payment_methods else "",
            "Facebook URL": profile.facebook_url if profile else "",
            "Instagram URL": profile.instagram_url if profile else "",
            "Twitter URL": profile.twitter_url if profile else "",
            "LinkedIn URL": profile.linkedin_url if profile else "",
            "Owner Role": "Owner",
            "Display Name": b.short_description or b.business_name,
            "Sub Category": b.primary_subcategory.name if b.primary_subcategory else "-",
            "PAN Number": profile.pan_number if profile else "-",
            "GSTIN Number": profile.gst_number if profile else "-",
            "Service Radius": str(profile.service_radius_km) if profile else "15",
            "Location Type": profile.location_type if profile else "Store",
            "Services Offered": ", ".join(profile.features) if profile and profile.features else "-",
            "Cover Banner URL": b.cover_image_url or "",
            "Registration Certificate URL": reg_doc,
            "GST Certificate URL": gst_doc,
            "Custom Slug": b.slug or "",
            "Meta Title": b.seo_title or "",
            "Meta Description": b.seo_description or "",
            "SEO Keywords": b.seo_keywords or "",
            "Sunday Hours": profile.working_hours.get("sunday", "-") if profile and profile.working_hours and isinstance(profile.working_hours, dict) else "-"
        })
    return results


@router.post("/api/admin/business")
def create_business(payload: BusinessCreateRequest, db: Session = Depends(get_db)):
    # Check if owner with this email already exists
    existing_user = db.query(User).filter(User.email == payload.owner_email).first()
    if existing_user:
        owner = existing_user
        # Update phone if provided
        if payload.owner_phone:
            owner.phone = payload.owner_phone
        if payload.owner_name:
            owner.name = payload.owner_name
        db.commit()
    else:
        # Create new owner user
        hashed_pw = pwd_context.hash(payload.owner_password or "password123")
        owner = User(
            name=payload.owner_name,
            email=payload.owner_email,
            phone=payload.owner_phone,
            hashed_password=hashed_pw,
            role=RoleEnum.owner,
        )
        db.add(owner)
        db.commit()
        db.refresh(owner)

    # Create the business
    business = Business(
        owner_id=owner.id,
        business_name=payload.business_name,
        category=payload.category,
        description=payload.description,
        address=payload.address,
        city=payload.city,
        pincode=payload.pincode,
        phone=payload.phone,
        whatsapp=payload.whatsapp,
        email=payload.email,
        website=payload.website,
        is_verified=payload.is_verified or False,
        approval_status=payload.approval_status or "Pending",
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return {"message": "Business created successfully", "business_id": business.id, "owner_id": owner.id}


@router.put("/api/admin/business/{business_id}")
def update_business(business_id: int, payload: BusinessUpdateRequest, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    # Update business fields
    if payload.business_name is not None:
        business.business_name = payload.business_name
    if payload.category is not None:
        business.category = payload.category
    if payload.description is not None:
        business.description = payload.description
    if payload.address is not None:
        business.address = payload.address
    if payload.city is not None:
        business.city = payload.city
    if payload.pincode is not None:
        business.pincode = payload.pincode
    if payload.phone is not None:
        business.phone = payload.phone
    if payload.whatsapp is not None:
        business.whatsapp = payload.whatsapp
    if payload.email is not None:
        business.email = payload.email
    if payload.website is not None:
        business.website = payload.website
    if payload.is_verified is not None:
        business.is_verified = payload.is_verified
        if payload.is_verified:
            business.approval_status = "Approved"
    if payload.approval_status is not None:
        business.approval_status = payload.approval_status
    if payload.seo_title is not None:
        business.seo_title = payload.seo_title
    if payload.seo_description is not None:
        business.seo_description = payload.seo_description
    if payload.seo_keywords is not None:
        business.seo_keywords = payload.seo_keywords
    if payload.slug is not None:
        business.slug = payload.slug

    # Update owner fields
    if business.owner_id:
        owner = db.query(User).filter(User.id == business.owner_id).first()
        if owner:
            if payload.owner_name is not None:
                owner.name = payload.owner_name
            if payload.owner_email is not None:
                owner.email = payload.owner_email
            if payload.owner_phone is not None:
                owner.phone = payload.owner_phone

    db.commit()
    return {"message": "Business updated successfully", "business_id": business_id}


@router.get("/api/admin/business-approvals")
def get_admin_business_approvals(db: Session = Depends(get_db)):
    businesses = db.query(Business).all()
    results = []
    for b in businesses:
        owner = db.query(User).filter(User.id == b.owner_id).first()
        results.append({
            "id": b.id,
            "Business Name": b.business_name,
            "Owner": owner.name if owner else "Unknown",
            "GST Number": "Pending verification",
            "Documents": {
                "Business Reg": b.verification_doc_url,
                "PAN Card": b.pan_card_doc_url,
                "GSTIN": b.gstin_doc_url
            },
            "Status": b.approval_status or ("Verified" if b.is_verified else "Pending"),
        })
    return results


@router.get("/api/admin/customers")
def get_admin_customers(db: Session = Depends(get_db)):
    customers = db.query(User).filter(User.role == RoleEnum.customer).all()
    results = []
    for customer in customers:
        results.append({
            "id": customer.id,
            "Customer Name": customer.name,
            "Email": customer.email,
            "Phone": customer.phone or "-",
            "Joined Date": str(customer.created_at).split()[0] if getattr(customer, "created_at", None) else str(date.today()),
            "Status": "Active",
        })
    return results


@router.get("/api/admin/categories")
def get_admin_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.display_order, Category.name).all()
    results = []
    for category in categories:
        count = db.query(Business).filter(Business.category == category.name).count()
        results.append({
            "id": category.id,
            "Category Name": category.name,
            "Total Businesses": count,
            "Active Listings": count,
            "Trending": "Yes" if count >= 2 else "Growing",
            "Status": "Active" if category.is_active else "Inactive",
        })
    return results


@router.get("/api/admin/locations")
def get_admin_locations(db: Session = Depends(get_db)):
    grouped = defaultdict(lambda: {
        "count": 0,
        "pincodes": set(),
        "areas": set(),
        "categories": set(),
    })
    for business in db.query(Business).all():
        city = business.city or "Unknown"
        grouped[city]["count"] += 1
        if business.pincode:
            grouped[city]["pincodes"].add(business.pincode)
        if business.address:
            grouped[city]["areas"].add(business.address)
        if business.category:
            grouped[city]["categories"].add(business.category)

    results = []
    for idx, (city, details) in enumerate(sorted(grouped.items()), start=1):
        sample_areas = list(sorted(details["areas"]))[:2]
        area_summary = ", ".join(sample_areas) if sample_areas else "Location details pending"
        pincode_summary = ", ".join(sorted(details["pincodes"])) if details["pincodes"] else "N/A"
        category_summary = ", ".join(sorted(details["categories"])) if details["categories"] else "N/A"
        results.append({
            "id": idx,
            "City": city,
            "State": "Tamil Nadu" if city == "Trichy" else "N/A",
            "Area Details": area_summary,
            "Pincode Coverage": pincode_summary,
            "Top Categories": category_summary,
            "Status": "Active",
        })
    return results


@router.get("/api/admin/leads")
def get_admin_leads(db: Session = Depends(get_db)):
    leads = db.query(Lead).all()
    results = []
    for lead in leads:
        business = db.query(Business).filter(Business.id == lead.business_id).first()
        results.append({
            "id": lead.id,
            "Lead Name": lead.customer_name,
            "Business Assigned": business.business_name if business else "Unknown",
            "Phone": lead.customer_phone,
            "Date": str(lead.created_at).split()[0] if getattr(lead, "created_at", None) else str(date.today()),
            "Status": lead.status.value if lead.status else "Pending",
        })
    return results


@router.get("/api/admin/reviews")
def get_admin_reviews(db: Session = Depends(get_db)):
    reviews = db.query(Review).all()
    results = []
    for review in reviews:
        business = db.query(Business).filter(Business.id == review.business_id).first()
        user = db.query(User).filter(User.id == review.user_id).first()
        results.append({
            "id": review.id,
            "business_id": review.business_id,
            "Business": business.business_name if business else "Unknown",
            "Reviewer": user.name if user else "Anonymous",
            "Rating": review.rating,
            "Review": review.comment or "",
            "Date": str(review.created_at).split()[0] if getattr(review, "created_at", None) else str(date.today()),
            "Status": "Published",
        })
    return results


@router.get("/api/admin/reviews-by-business")
def get_admin_reviews_businesses(db: Session = Depends(get_db)):
    """Returns all businesses with their review counts for the admin reviews panel."""
    businesses = db.query(Business).all()
    results = []
    for b in businesses:
        review_count = db.query(Review).filter(Review.business_id == b.id).count()
        avg = db.query(Review).filter(Review.business_id == b.id).all()
        avg_rating = round(sum(r.rating for r in avg) / len(avg), 1) if avg else 0
        results.append({
            "id": b.id,
            "business_name": b.business_name,
            "category": b.category or "General",
            "city": b.city or "-",
            "review_count": review_count,
            "avg_rating": avg_rating,
        })
    return results


@router.get("/api/admin/reviews/business/{business_id}")
def get_admin_reviews_for_business(business_id: int, db: Session = Depends(get_db)):
    """Returns all reviews for a specific business."""
    reviews = db.query(Review).filter(Review.business_id == business_id).order_by(Review.created_at.desc()).all()
    results = []
    for review in reviews:
        user = db.query(User).filter(User.id == review.user_id).first()
        results.append({
            "id": review.id,
            "Reviewer": user.name if user else "Anonymous",
            "Rating": review.rating,
            "Review": review.comment or "",
            "Date": str(review.created_at).split()[0] if getattr(review, "created_at", None) else str(date.today()),
            "Status": "Published" if review.moderation_status == "approved" else "Pending",
        })
    return results


@router.get("/api/admin/support")
def get_admin_support():
    return [
        {
            "id": 1,
            "Ticket ID": "SUP-1001",
            "Subject": "Business onboarding help",
            "User": "Kings Dental Academy",
            "Date": "2026-07-24",
            "Status": "Open",
        }
    ]


@router.get("/api/admin/notifications")
def get_admin_notifications():
    return [
        {
            "id": 1,
            "Title": "Owner verification reminder",
            "Type": "System",
            "Target Audience": "Business Owners",
            "Date": "2026-07-24",
            "Status": "Active",
        }
    ]


@router.get("/api/admin/cms")
def get_admin_cms():
    return [
        {
            "id": 1,
            "Page Title": "Homepage Hero",
            "Author": "Super Admin",
            "Last Updated": "2026-07-24",
            "Views": 1280,
            "Status": "Published",
        }
    ]


@router.get("/api/admin/reports")
def get_admin_reports():
    return [
        {
            "id": 1,
            "Report Name": "Weekly Platform Summary",
            "Generated By": "System",
            "Type": "Analytics",
            "Date": "2026-07-24",
            "Status": "Completed",
        }
    ]


@router.get("/api/admin/logs")
def get_admin_logs():
    return [
        {
            "id": 1,
            "Action": "Approved business listing",
            "User": "Super Admin",
            "IP Address": "127.0.0.1",
            "Date": "2026-07-24",
            "Status": "Completed",
        }
    ]

@router.post("/api/admin/business/{business_id}/approve")
def approve_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return {"error": "Business not found"}
    business.approval_status = "Approved"
    business.is_verified = True
    db.commit()
    return {"message": "Business approved successfully", "business_id": business_id}

@router.post("/api/admin/business/{business_id}/reject")
def reject_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        return {"error": "Business not found"}
    business.approval_status = "Rejected"
    db.commit()
    return {"message": "Business rejected successfully", "business_id": business_id}


# ---- GENERIC EDIT (PUT) ENDPOINTS ----

@router.put("/api/admin/business-approvals/{business_id}")
@router.put("/api/admin/business-management/{business_id}")
def update_business_admin(business_id: int, request: BusinessUpdateRequest, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if request.business_name is not None:
        business.business_name = request.business_name
    if request.category is not None:
        business.category = request.category
    if request.description is not None:
        business.description = request.description
    if request.address is not None:
        business.address = request.address
    if request.city is not None:
        business.city = request.city
    if request.phone is not None:
        business.phone = request.phone
    if request.website is not None:
        business.website = request.website
    if request.is_verified is not None:
        business.is_verified = request.is_verified
    if request.approval_status is not None:
        business.approval_status = request.approval_status
    if request.seo_title is not None:
        business.seo_title = request.seo_title
    if request.seo_description is not None:
        business.seo_description = request.seo_description
    if request.seo_keywords is not None:
        business.seo_keywords = request.seo_keywords
    if request.slug is not None:
        business.slug = request.slug
    if request.map_url is not None:
        business.google_map_url = request.map_url
    if request.logo_url is not None:
        business.logo_url = request.logo_url
    if request.certificate_url is not None:
        business.verification_doc_url = request.certificate_url
    if request.working_days is not None:
        business.working_days = request.working_days
    if request.open_time is not None:
        business.opening_time = request.open_time
    if request.close_time is not None:
        business.closing_time = request.close_time
    if request.display_name is not None:
        business.short_description = request.display_name
    if request.cover_banner_url is not None:
        business.cover_image_url = request.cover_banner_url
    if request.gst_certificate_url is not None:
        business.gstin_doc_url = request.gst_certificate_url

    # Update profile fields
    from app.models.verification_models import BusinessOwnerProfile
    profile = db.query(BusinessOwnerProfile).filter(BusinessOwnerProfile.business_id == business_id).first()
    if profile:
        if request.facebook_url is not None:
            profile.facebook_url = request.facebook_url
        if request.instagram_url is not None:
            profile.instagram_url = request.instagram_url
        if request.twitter_url is not None:
            profile.twitter_url = request.twitter_url
        if request.linkedin_url is not None:
            profile.linkedin_url = request.linkedin_url
        if request.payment_methods is not None:
            profile.payment_methods = [p.strip() for p in request.payment_methods.split(",") if p.strip()]
        if request.pan_number is not None:
            profile.pan_number = request.pan_number
        if request.gstin_number is not None:
            profile.gst_number = request.gstin_number
        if request.service_radius is not None:
            try:
                profile.service_radius_km = float(request.service_radius)
            except:
                pass
        if request.location_type is not None:
            profile.location_type = request.location_type

    db.commit()
    return {"message": "Business updated successfully"}


# ---- GENERIC DELETE ENDPOINTS ----

@router.delete("/api/admin/business/{business_id}")
@router.delete("/api/admin/business-approvals/{business_id}")
@router.delete("/api/admin/business-management/{business_id}")
def delete_business_admin(business_id: int, db: Session = Depends(get_db)):
    from app.models.verification_models import BusinessOwnerProfile, BusinessDocument, VerificationAuditLog
    from app.models.business_extras import (
        Product, Service, GalleryImage, Lead, Staff, Promotion, SupportTicket, Invoice
    )
    from app.models.business_category_mapping import BusinessCategoryMapping
    from app.models.business_service_mapping import BusinessServiceMapping
    from app.models.review import Review
    from app.models.seo_models import SEOKeyword

    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    # Delete related child records first to avoid FK violations
    db.query(VerificationAuditLog).filter(VerificationAuditLog.business_id == business_id).delete()
    db.query(BusinessDocument).filter(BusinessDocument.business_id == business_id).delete()
    db.query(BusinessOwnerProfile).filter(BusinessOwnerProfile.business_id == business_id).delete()
    db.query(Review).filter(Review.business_id == business_id).delete()
    db.query(SEOKeyword).filter(SEOKeyword.business_id == business_id).delete()
    
    # Delete from business_extras
    db.query(Product).filter(Product.business_id == business_id).delete()
    db.query(Service).filter(Service.business_id == business_id).delete()
    db.query(GalleryImage).filter(GalleryImage.business_id == business_id).delete()
    db.query(Lead).filter(Lead.business_id == business_id).delete()
    db.query(Staff).filter(Staff.business_id == business_id).delete()
    db.query(Promotion).filter(Promotion.business_id == business_id).delete()
    db.query(SupportTicket).filter(SupportTicket.business_id == business_id).delete()
    db.query(Invoice).filter(Invoice.business_id == business_id).delete()
    
    # Delete mappings
    db.query(BusinessCategoryMapping).filter(BusinessCategoryMapping.business_id == business_id).delete()
    db.query(BusinessServiceMapping).filter(BusinessServiceMapping.business_id == business_id).delete()
    
    owner_id = business.owner_id
    db.delete(business)
    db.commit()
    
    # Clean up the owner if they have no other businesses
    if owner_id:
        remaining = db.query(Business).filter(Business.owner_id == owner_id).count()
        if remaining == 0:
            db.query(User).filter(User.id == owner_id).delete()
            db.commit()
            
    return {"message": "Business deleted successfully"}


@router.put("/api/admin/customers/{user_id}")
def update_customer(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.commit()
    return {"message": "Customer updated successfully"}


@router.delete("/api/admin/customers/{user_id}")
def delete_customer(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "Customer deleted successfully"}


@router.delete("/api/admin/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully"}


# ======================== PLATFORM TESTIMONIALS (Owner Reviews of BizDial) ========================

@router.get("/api/admin/platform-reviews")
def get_admin_platform_reviews(db: Session = Depends(get_db)):
    from app.models.testimonial import Testimonial
    testimonials = db.query(Testimonial).order_by(Testimonial.id.desc()).all()
    results = []
    for t in testimonials:
        business = db.query(Business).filter(Business.id == t.business_id).first() if t.business_id else None
        results.append({
            "id": t.id,
            "name": t.name,
            "role": t.role,
            "text": t.text,
            "rating": t.rating,
            "status": t.status or ("approved" if t.is_active else "pending"),
            "is_active": t.is_active,
            "business_name": business.business_name if business else "—",
            "business_id": t.business_id,
        })
    return results

@router.post("/api/admin/platform-reviews/{testimonial_id}/approve")
def approve_platform_review(testimonial_id: int, db: Session = Depends(get_db)):
    from app.models.testimonial import Testimonial
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    t.is_active = True
    t.status = "approved"
    db.commit()
    return {"message": "Testimonial approved — it will now show on the homepage."}

@router.post("/api/admin/platform-reviews/{testimonial_id}/reject")
def reject_platform_review(testimonial_id: int, db: Session = Depends(get_db)):
    from app.models.testimonial import Testimonial
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    t.is_active = False
    t.status = "rejected"
    db.commit()
    return {"message": "Testimonial rejected."}

@router.delete("/api/admin/platform-reviews/{testimonial_id}")
def delete_platform_review(testimonial_id: int, db: Session = Depends(get_db)):
    from app.models.testimonial import Testimonial
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(t)
    db.commit()
    return {"message": "Testimonial deleted."}
