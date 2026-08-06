from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base

class VerificationStatusEnum(str, enum.Enum):
    not_started = "Not Started"
    pending = "Pending"
    under_review = "Under Review"
    verified = "Verified"
    rejected = "Rejected"
    need_more_docs = "Need More Documents"
    expired = "Expired"
    suspended = "Suspended"

class BusinessOwnerProfile(Base):
    __tablename__ = "business_owner_profiles"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    
    # Step 1: Verification Flags
    email_verified = Column(Boolean, default=False)
    mobile_verified = Column(Boolean, default=False)
    whatsapp_verified = Column(Boolean, default=False)

    # Step 2: Legal Info
    business_type = Column(String, default="Proprietorship") # Proprietorship, Private Limited, etc.
    business_reg_number = Column(String, nullable=True)
    pan_number = Column(String, index=True, nullable=True)
    gst_number = Column(String, index=True, nullable=True)
    fssai_number = Column(String, nullable=True)
    founded_year = Column(Integer, nullable=True)
    employee_count = Column(String, default="1-10")
    annual_turnover = Column(String, nullable=True)

    # Step 3: Coordinates & Radius
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    service_radius_km = Column(Float, default=10.0)
    location_type = Column(String, default="Store") # Store, Office, Home Service, Online

    # Step 4: Social Links
    facebook_url = Column(String, nullable=True)
    instagram_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    twitter_url = Column(String, nullable=True)
    youtube_url = Column(String, nullable=True)
    telegram_url = Column(String, nullable=True)

    # Step 5: Working Hours
    working_hours = Column(JSON, nullable=True) # { monday: "9:00 AM - 9:00 PM", ... }
    is_24x7 = Column(Boolean, default=False)
    has_emergency_service = Column(Boolean, default=False)
    requires_appointment = Column(Boolean, default=False)

    # Step 6 & 10: Features & Amenities
    features = Column(JSON, default=list) # ["Parking", "WiFi", "Card Payment", "AC"]
    payment_methods = Column(JSON, default=list) # ["Cash", "UPI", "Card"]

    # Step 9: Bank Details
    account_holder = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)
    branch_name = Column(String, nullable=True)
    ifsc_code = Column(String, nullable=True)
    account_number = Column(String, nullable=True)
    upi_id = Column(String, nullable=True)
    payment_qr_url = Column(String, nullable=True)

    # Quality Score & Ranking
    quality_score = Column(Float, default=0.0)
    verification_status = Column(Enum(VerificationStatusEnum), default=VerificationStatusEnum.pending)
    badges = Column(JSON, default=list) # ["Phone Verified", "GST Verified", "Top Rated"]

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class BusinessDocument(Base):
    __tablename__ = "business_documents"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    doc_type = Column(String, nullable=False) # GST, PAN, Aadhaar, License, FSSAI, Electricity Bill, Rental Agreement
    document_url = Column(String, nullable=False)
    document_number = Column(String, nullable=True)
    status = Column(Enum(VerificationStatusEnum), default=VerificationStatusEnum.pending)
    rejection_reason = Column(String, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

class VerificationAuditLog(Base):
    __tablename__ = "verification_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    action = Column(String, nullable=False) # Document Approved, Status Changed, Badge Awarded
    performed_by = Column(String, default="Super Admin")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
