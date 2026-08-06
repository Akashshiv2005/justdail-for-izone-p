from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    business_name = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=True)
    # Legacy column kept nullable for data migration – will be dropped later
    category = Column(String, index=True, nullable=True)
    description = Column(String)
    short_description = Column(String, nullable=True)

    # Location
    address = Column(String)
    area = Column(String, nullable=True, index=True)
    city = Column(String, index=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True, default="India")
    pincode = Column(String)
    
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=True)
    state_id = Column(Integer, ForeignKey("states.id"), nullable=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=True)
    locality_id = Column(Integer, ForeignKey("localities.id"), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    google_map_url = Column(String, nullable=True)

    # Ranking & Status
    is_verified = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    average_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)

    # Contact
    phone = Column(String)
    whatsapp = Column(String)
    email = Column(String)
    website = Column(String)

    # Media & Admin
    logo_url = Column(String)
    cover_image_url = Column(String, nullable=True)
    verification_doc_url = Column(String)
    pan_card_doc_url = Column(String)
    gstin_doc_url = Column(String)
    approval_status = Column(String, default="Pending")  # Pending, Approved, Rejected

    # Business Hours
    opening_time = Column(String, nullable=True)
    closing_time = Column(String, nullable=True)
    working_days = Column(String, nullable=True)

    # SEO
    seo_title = Column(String, nullable=True)
    seo_description = Column(String, nullable=True)
    seo_keywords = Column(String, nullable=True)

    # Analytics Counters
    profile_views = Column(Integer, default=0)
    call_clicks = Column(Integer, default=0)
    whatsapp_clicks = Column(Integer, default=0)
    website_clicks = Column(Integer, default=0)
    direction_requests = Column(Integer, default=0)
    bookmark_count = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User")
    reviews = relationship("Review", back_populates="business")
    category_mappings = relationship("BusinessCategoryMapping", back_populates="business", cascade="all, delete-orphan")
    master_service_mappings = relationship("BusinessServiceMapping", back_populates="business", cascade="all, delete-orphan")

    @property
    def primary_category(self):
        """Return the first mapped Category object, or None."""
        if self.category_mappings:
            return self.category_mappings[0].category
        return None

    @property
    def primary_subcategory(self):
        """Return the first mapped Subcategory object, or None."""
        if self.category_mappings:
            return self.category_mappings[0].subcategory
        return None

