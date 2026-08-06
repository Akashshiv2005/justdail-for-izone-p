from sqlalchemy.orm import Session
from app.models.user import User
from app.models.business import Business
from app.models.verification_models import BusinessOwnerProfile
from typing import Dict, Any, List

class DuplicateDetectionEngine:
    @staticmethod
    def check_duplicates(db: Session, email: str, phone: str, gst_number: str = None, pan_number: str = None, business_name: str = None) -> Dict[str, Any]:
        flags: List[str] = []

        # Duplicate Email
        if email:
            if db.query(User).filter(User.email.ilike(email)).first():
                flags.append("Duplicate Email Address detected")

        # Duplicate Phone
        if phone:
            if db.query(User).filter(User.phone == phone).first():
                flags.append("Duplicate Mobile Number detected")

        # Duplicate GSTIN
        if gst_number:
            if db.query(BusinessOwnerProfile).filter(BusinessOwnerProfile.gst_number.ilike(gst_number)).first():
                flags.append("Duplicate GSTIN Number registered")

        # Duplicate PAN
        if pan_number:
            if db.query(BusinessOwnerProfile).filter(BusinessOwnerProfile.pan_number.ilike(pan_number)).first():
                flags.append("Duplicate PAN Number registered")

        # Duplicate Business Name
        if business_name:
            if db.query(Business).filter(Business.business_name.ilike(business_name)).first():
                flags.append("Matching Business Name registered")

        return {
            "has_duplicate": len(flags) > 0,
            "flags": flags,
            "risk_score": min(len(flags) * 25, 100)
        }
