from app.models.business import Business
from app.models.verification_models import BusinessOwnerProfile, BusinessDocument
from typing import Dict, Any, List

class QualityScoreEvaluator:
    @staticmethod
    def calculate_business_quality(business: Business, profile: BusinessOwnerProfile, docs: List[BusinessDocument]) -> Dict[str, Any]:
        score = 0.0
        breakdown = {}

        # 1. Profile Core Completion (30 pts)
        core_pts = 0.0
        if business.business_name: core_pts += 5
        if business.phone: core_pts += 5
        if business.email: core_pts += 5
        if business.address and business.city: core_pts += 5
        if business.description: core_pts += 5
        if business.logo_url: core_pts += 5
        score += core_pts
        breakdown["profile_completion"] = core_pts

        # 2. Document Verification (40 pts)
        doc_pts = 0.0
        verified_docs = [d for d in (docs or []) if getattr(d, 'status', '') == 'Verified']
        doc_pts = min(len(verified_docs) * 10.0, 40.0)
        score += doc_pts
        breakdown["document_verification"] = doc_pts

        # 3. Badges & Verification Status (30 pts)
        badge_pts = 0.0
        if getattr(profile, 'email_verified', False): badge_pts += 5
        if getattr(profile, 'mobile_verified', False): badge_pts += 5
        if getattr(profile, 'gst_number', None): badge_pts += 10
        if getattr(business, 'is_verified', False): badge_pts += 10
        score += badge_pts
        breakdown["badges_and_trust"] = badge_pts

        final_score = round(score, 1)

        # Award Badges dynamically based on completed scores
        badges = []
        if getattr(profile, 'mobile_verified', False): badges.append("Phone Verified")
        if getattr(profile, 'email_verified', False): badges.append("Email Verified")
        if getattr(profile, 'gst_number', None): badges.append("GST Verified")
        if business.is_verified: badges.append("Business Verified")
        if final_score >= 80: badges.append("Top Rated")

        return {
            "quality_score": final_score,
            "breakdown": breakdown,
            "badges": badges
        }
