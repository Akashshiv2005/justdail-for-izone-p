import math
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, func
from app.database import get_db
from app.models.business import Business
from app.models.business_category_mapping import BusinessCategoryMapping
from app.models.category import Category
from app.models.subcategory import Subcategory
from app.models.search_config import SearchConfig, RecentSearch
from app.models.business_extras import GalleryImage, Service
from app.models.review import Review
from app.models.user import User
from typing import Optional, List, Dict, Any

router = APIRouter()

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth surface (in km)."""
    if None in (lat1, lon1, lat2, lon2):
        return float('inf')
    R = 6371.0 # Earth radius in kilometers
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def calculate_score(biz: Business, distance: float, q: str, config: SearchConfig) -> float:
    """Calculate the ranking score for a business based on admin configuration."""
    score = 0.0
    
    # 1. Distance Score (Inversely proportional, closer = higher score)
    if distance <= config.default_radius_km:
        score += config.weight_distance
    elif distance <= config.max_fallback_radius_km:
        score += config.weight_distance * (1 - (distance / config.max_fallback_radius_km))
        
    # 2. Rating & Reviews
    score += (biz.average_rating / 5.0) * config.weight_rating
    
    # Normalize reviews (cap at 500 for full score)
    review_factor = min(biz.total_reviews / 500.0, 1.0)
    score += review_factor * config.weight_reviews
    
    # 3. Premium & Verified
    if biz.is_verified:
        score += config.weight_verified
    if biz.is_premium:
        score += config.weight_premium
        
    # 4. Profile Completion
    completion = 0
    if biz.phone: completion += 20
    if biz.logo_url: completion += 20
    if biz.address: completion += 20
    if biz.description: completion += 20
    if biz.working_days: completion += 20
    score += (completion / 100.0) * config.weight_profile_completion
    
    # 5. Text Match relevance (Name, Category, Keywords)
    if q:
        q_lower = q.lower()
        if biz.business_name and q_lower in biz.business_name.lower():
            score += config.weight_business_name
            if biz.business_name.lower().startswith(q_lower):
                score += (config.weight_business_name * 0.5) # Bonus for exact prefix match
            if biz.business_name.lower() == q_lower:
                score += (config.weight_business_name * 1.0) # Huge bonus for EXACT keyword match
                
        if biz.category and q_lower in biz.category.lower():
            score += config.weight_category_match
            if biz.category.lower() == q_lower:
                score += (config.weight_category_match * 1.0) # Bonus for exact category match

        if biz.seo_keywords and q_lower in biz.seo_keywords.lower():
            score += (config.weight_category_match * 0.5) # Keywords match gives a relevance boost
            
    # 6. Business Activity (Recency)
    # Recency gives a small progressive boost (max +10) if the business was active/updated recently
    now = datetime.now(timezone.utc)
    active_date = biz.updated_at or biz.created_at
    if active_date:
        if active_date.tzinfo is None:
            active_date = active_date.replace(tzinfo=timezone.utc)
        days_since_active = (now - active_date).days
        if days_since_active < 30:
            score += 10 # High activity
        elif days_since_active < 90:
            score += 5  # Medium activity
        elif days_since_active < 365:
            score += 2  # Low activity
            
    return score


@router.get("/api/search")
def search_businesses(
    q: Optional[str] = None,
    city: Optional[str] = None,
    area: Optional[str] = None,
    category: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius: Optional[float] = None,
    db: Session = Depends(get_db)
):
    config = db.query(SearchConfig).first()
    if not config:
        config = SearchConfig()
        db.add(config)
        db.commit()

    # Log search for popular searches (if keyword exists)
    if q and len(q) > 2:
        recent = db.query(RecentSearch).filter(func.lower(RecentSearch.query_term) == q.lower()).first()
        if recent:
            recent.search_count += 1
        else:
            db.add(RecentSearch(query_term=q, location_term=city))
        db.commit()

    query = db.query(Business).filter(Business.approval_status == "Approved")

    if q:
        words = [w for w in q.strip().split() if w]
        word_conditions = []
        for w in words:
            # basic singularization for better matching
            if len(w) > 3 and w.lower().endswith('s'):
                w = w[:-1]
            term = f"%{w}%"
            word_conditions.append(
                or_(
                    Business.business_name.ilike(term),
                    Business.category.ilike(term),
                    Business.description.ilike(term),
                    Business.seo_keywords.ilike(term),
                    Category.name.ilike(term),
                    Subcategory.name.ilike(term)
                )
            )
        if word_conditions:
            query = query.outerjoin(Business.category_mappings).outerjoin(BusinessCategoryMapping.category).outerjoin(BusinessCategoryMapping.subcategory).filter(or_(*word_conditions))

    if category:
        cat_clean = category.replace(" ", "")
        query = query.filter(or_(
            func.replace(Business.category, ' ', '').ilike(f"%{cat_clean}%"),
            func.replace(Business.business_name, ' ', '').ilike(f"%{cat_clean}%")
        ))
        
    if city and not lat: # Fallback to strict city match if no coordinates
        city_aliases = [city]
        if city.lower() == "tiruchirappalli":
            city_aliases.append("trichy")
        elif city.lower() == "trichy":
            city_aliases.append("tiruchirappalli")
            
        city_conditions = [Business.city.ilike(f"%{c}%") for c in city_aliases]
        query = query.filter(or_(*city_conditions))
        
    if area:
        query = query.filter(Business.area.ilike(f"%{area}%"))

    # REAL-TIME GEO-SPATIAL SEARCH: Bounding Box Optimization
    target_radius = radius if radius else config.default_radius_km
    max_search_radius = max(target_radius, 50.0) 

    if lat is not None and lng is not None:
        lat_delta = max_search_radius / 111.0
        lon_delta = max_search_radius / (111.0 * math.cos(math.radians(lat)))
        
        geo_condition = and_(
            Business.latitude >= lat - lat_delta,
            Business.latitude <= lat + lat_delta,
            Business.longitude >= lng - lon_delta,
            Business.longitude <= lng + lon_delta
        )
        
        if city:
            city_aliases = [city]
            if city.lower() == "tiruchirappalli":
                city_aliases.append("trichy")
            elif city.lower() == "trichy":
                city_aliases.append("tiruchirappalli")
            city_conditions = [Business.city.ilike(f"%{c}%") for c in city_aliases]
            
            query = query.filter(or_(
                geo_condition,
                and_(Business.latitude.is_(None), or_(*city_conditions))
            ))
        else:
            query = query.filter(or_(
                geo_condition,
                Business.latitude.is_(None) # If no city, we just include them and rely on distance=inf
            ))

    # Fetch optimized dataset
    all_businesses = query.all()
    results = []

    if lat is not None and lng is not None:
        target_radius = radius if radius else config.default_radius_km
        fallback_stages = [target_radius, 10.0, 25.0, 50.0]
        
        for current_radius in fallback_stages:
            scored_results = []
            for biz in all_businesses:
                dist = haversine(lat, lng, biz.latitude, biz.longitude)
                
                include_no_coords = False
                if dist == float('inf'):
                    if city and biz.city:
                        biz_c = biz.city.lower()
                        c = city.lower()
                        if c in biz_c or biz_c in c or (c == "tiruchirappalli" and biz_c == "trichy") or (c == "trichy" and biz_c == "tiruchirappalli"):
                            include_no_coords = True
                    elif not city:
                        include_no_coords = True
                        
                if dist <= current_radius or include_no_coords:
                    score = calculate_score(biz, dist, q or "", config)
                    scored_results.append({
                        "business": biz,
                        "distance": round(dist, 1) if dist != float('inf') else None,
                        "score": score
                    })
            
            if len(scored_results) > 0:
                results = sorted(scored_results, key=lambda x: x["score"], reverse=True)
                break
                
        # Format for output
        out = []
        for r in results:
            b = r["business"].__dict__.copy()
            b["distance"] = r["distance"]
            b["search_score"] = r["score"]
            b.pop("_sa_instance_state", None)
            out.append(b)
        return out
    else:
        # No coordinates provided, sort by default factors (rating/reviews)
        scored_results = []
        for biz in all_businesses:
            score = calculate_score(biz, float('inf'), q or "", config)
            scored_results.append({
                "business": biz,
                "distance": None,
                "score": score
            })
        
        results = sorted(scored_results, key=lambda x: x["score"], reverse=True)
        out = []
        for r in results:
            b = r["business"].__dict__.copy()
            b["distance"] = r["distance"]
            b["search_score"] = r["score"]
            b.pop("_sa_instance_state", None)
            out.append(b)
        return out

@router.get("/api/search/suggestions")
def get_search_suggestions(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    """Auto-complete suggestions for businesses and categories."""
    term = f"%{q}%"
    
    # Businesses
    businesses = db.query(Business.business_name).filter(
        Business.business_name.ilike(term),
        Business.approval_status == "Approved"
    ).limit(5).all()
    
    # Categories
    categories = db.query(Category.name).filter(Category.name.ilike(term)).limit(5).all()
    
    suggestions = []
    suggestions.extend([{"type": "category", "text": c[0]} for c in categories])
    suggestions.extend([{"type": "business", "text": b[0]} for b in businesses])
    
    return suggestions

@router.get("/api/search/popular")
def get_popular_searches(db: Session = Depends(get_db)):
    """Fetch top recent/popular searches."""
    popular = db.query(RecentSearch).order_by(desc(RecentSearch.search_count)).limit(5).all()
    return [{"term": p.query_term, "count": p.search_count} for p in popular]

@router.get("/api/categories")
def get_all_categories(db: Session = Depends(get_db)):
    """Fetch all unique categories dynamically."""
    categories = db.query(Category.name).all()
    if not categories:
        # Fallback to distinct business categories if Category table is empty
        categories = db.query(Business.category).filter(Business.category.isnot(None)).distinct().all()
    return [{"name": cat[0]} for cat in categories if cat[0]]

@router.get("/api/business/{slug}")
def get_business_by_slug(slug: str, db: Session = Depends(get_db)):
    biz = db.query(Business).filter(Business.slug == slug, Business.approval_status == "Approved").first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
        
    gallery = db.query(GalleryImage).filter(GalleryImage.business_id == biz.id).all()
    
    from app.models.business_service_mapping import BusinessServiceMapping
    from app.models.master_service import MasterService
    
    mappings = db.query(BusinessServiceMapping).filter(BusinessServiceMapping.business_id == biz.id).all()
    services_data = []
    for m in mappings:
        ms = db.query(MasterService).filter(MasterService.id == m.master_service_id).first()
        if ms:
            services_data.append({
                "name": ms.name,
                "base_price": m.price,
                "description": m.description
            })
    
    # Fetch reviews with user info (only approved ones)
    reviews = db.query(Review).filter(Review.business_id == biz.id, Review.moderation_status == "approved").order_by(desc(Review.created_at)).all()
    reviews_data = []
    for r in reviews:
        user = db.query(User).filter(User.id == r.user_id).first()
        reviews_data.append({
            "id": r.id,
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at,
            "user": {"name": user.name if user else "Anonymous"}
        })
        
    from app.models.business_extras import Product
    products = db.query(Product).filter(Product.business_id == biz.id).all()
        
    return {
        "business": biz,
        "gallery": gallery,
        "services": services_data,
        "reviews": reviews_data,
        "products": products
    }

from pydantic import BaseModel

class PublicReviewCreate(BaseModel):
    customer_name: str
    rating: int
    comment: str

@router.post("/api/business/{slug}/rate")
def submit_public_review(slug: str, payload: PublicReviewCreate, db: Session = Depends(get_db)):
    biz = db.query(Business).filter(Business.slug == slug).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
        
    import time
    customer_name = payload.customer_name if payload.customer_name.strip() else "Anonymous"
    
    # Create dummy user for the review if needed, or find existing
    user = db.query(User).filter(User.name == customer_name).first()
    if not user:
        user = User(
            name=customer_name, 
            email=f"public_{int(time.time())}_{customer_name.replace(' ', '').lower()[:5]}@example.com", 
            phone=f"9999{int(time.time())}"[-10:], 
            hashed_password="dummy", 
            role="customer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    review = Review(
        business_id=biz.id,
        user_id=user.id,
        rating=payload.rating,
        comment=payload.comment,
        moderation_status="pending"  # Needs owner approval
    )
    db.add(review)
    
    # Optionally update average rating here or recalculate it dynamically later.
    db.commit()
    return {"message": "Review submitted successfully and is pending approval."}

