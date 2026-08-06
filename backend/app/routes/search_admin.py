from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.search_config import SearchConfig
from app.auth_utils import get_current_admin
from pydantic import BaseModel

router = APIRouter(dependencies=[Depends(get_current_admin)])

class SearchConfigUpdate(BaseModel):
    default_radius_km: float
    max_fallback_radius_km: float
    weight_distance: float
    weight_category_match: float
    weight_business_name: float
    weight_rating: float
    weight_reviews: float
    weight_verified: float
    weight_premium: float
    weight_profile_completion: float

@router.get("/api/admin/search/config")
def get_search_config(db: Session = Depends(get_db)):
    config = db.query(SearchConfig).first()
    if not config:
        config = SearchConfig()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@router.put("/api/admin/search/config")
def update_search_config(payload: SearchConfigUpdate, db: Session = Depends(get_db)):
    config = db.query(SearchConfig).first()
    if not config:
        config = SearchConfig()
        db.add(config)
    
    config.default_radius_km = payload.default_radius_km
    config.max_fallback_radius_km = payload.max_fallback_radius_km
    config.weight_distance = payload.weight_distance
    config.weight_category_match = payload.weight_category_match
    config.weight_business_name = payload.weight_business_name
    config.weight_rating = payload.weight_rating
    config.weight_reviews = payload.weight_reviews
    config.weight_verified = payload.weight_verified
    config.weight_premium = payload.weight_premium
    config.weight_profile_completion = payload.weight_profile_completion
    
    db.commit()
    db.refresh(config)
    return config
