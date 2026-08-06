from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base

class SEOKeyword(Base):
    """
    Business-scoped SEO keyword.

    Every keyword row belongs to exactly one Business. category/city are no
    longer free-text fields the admin types in — they are read-only snapshots
    copied from the linked Business at creation time, so the "routing" shown
    in the admin UI always reflects a real listing instead of an arbitrary
    unlinked string.
    """
    __tablename__ = "seo_keywords"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False, index=True)

    keyword = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=True)   # snapshot of business.category at creation
    sub_category = Column(String, nullable=True)
    city = Column(String, index=True, nullable=True)        # snapshot of business.city at creation
    area = Column(String, nullable=True)
    priority = Column(String, default="Medium") # High, Medium, Low
    monthly_search_volume = Column(Integer, nullable=True)  # left null unless admin supplies a real figure
    difficulty = Column(Integer, nullable=True)              # 0 to 100, null = not measured
    competition = Column(String, default="Medium")
    status = Column(String, default="Active")
    is_featured = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)
    target_url = Column(String, nullable=True)
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    schema_type = Column(String, default="LocalBusiness")
    is_indexed = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    business = relationship("Business", backref="seo_keyword_items")

class SEOTemplate(Base):
    __tablename__ = "seo_templates"

    id = Column(Integer, primary_key=True, index=True)
    template_name = Column(String, nullable=False)
    target_type = Column(String, index=True, nullable=False) # category_city, business, city, category
    title_template = Column(String, nullable=False)
    description_template = Column(Text, nullable=False)
    heading_template = Column(String, nullable=True)
    faq_template = Column(JSON, nullable=True)
    schema_template = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class CitySEO(Base):
    __tablename__ = "city_seo"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True, unique=True, nullable=False)
    state = Column(String, nullable=True)
    country = Column(String, default="India")
    slug = Column(String, index=True, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    seo_title = Column(String, nullable=True)
    seo_description = Column(Text, nullable=True)
    canonical_url = Column(String, nullable=True)
    popular_categories = Column(JSON, nullable=True) # list of category names
    landing_banner_url = Column(String, nullable=True)
    faq = Column(JSON, nullable=True) # list of {question, answer}

class CategorySEO(Base):
    __tablename__ = "category_seo"

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, index=True, unique=True, nullable=False)
    slug = Column(String, index=True, unique=True, nullable=False)
    seo_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    primary_keyword = Column(String, nullable=True)
    secondary_keywords = Column(JSON, nullable=True)
    faq = Column(JSON, nullable=True)
    image_url = Column(String, nullable=True)
    schema_type = Column(String, default="LocalBusiness")

class SEORedirect(Base):
    __tablename__ = "seo_redirects"

    id = Column(Integer, primary_key=True, index=True)
    source_path = Column(String, index=True, unique=True, nullable=False)
    target_path = Column(String, nullable=False)
    redirect_type = Column(Integer, default=301) # 301, 302
    is_active = Column(Boolean, default=True)

class SEORobots(Base):
    __tablename__ = "seo_robots"

    id = Column(Integer, primary_key=True, index=True)
    user_agent = Column(String, default="*")
    allow_paths = Column(JSON, default=list)
    disallow_paths = Column(JSON, default=list)
    crawl_delay = Column(Integer, default=1)
    sitemap_url = Column(String, default="/sitemap.xml")

class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, index=True, nullable=False)
    city = Column(String, index=True, nullable=True)
    category = Column(String, nullable=True)
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FeaturedSearch(Base):
    __tablename__ = "featured_searches"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    type = Column(String, default="Category") # Category, City, Business, Keyword
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
