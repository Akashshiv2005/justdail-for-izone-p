from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class SearchConfig(Base):
    """
    Super Admin configuration for the Search Ranking Engine.
    There should only be one row in this table.
    """
    __tablename__ = "search_config"

    id = Column(Integer, primary_key=True, index=True)
    
    # Distance settings
    default_radius_km = Column(Float, default=5.0)
    max_fallback_radius_km = Column(Float, default=50.0)
    
    # Ranking Weights (should sum up to 100 or be used relatively)
    weight_distance = Column(Float, default=40.0)
    weight_category_match = Column(Float, default=15.0)
    weight_business_name = Column(Float, default=10.0)
    weight_rating = Column(Float, default=10.0)
    weight_reviews = Column(Float, default=5.0)
    weight_verified = Column(Float, default=5.0)
    weight_premium = Column(Float, default=10.0)
    weight_profile_completion = Column(Float, default=5.0)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RecentSearch(Base):
    """
    Stores popular/recent searches for analytics and auto-suggestions.
    """
    __tablename__ = "recent_searches"

    id = Column(Integer, primary_key=True, index=True)
    query_term = Column(String, index=True)
    location_term = Column(String, nullable=True, index=True)
    search_count = Column(Integer, default=1)
    last_searched_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
