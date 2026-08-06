from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Subcategory(Base):
    __tablename__ = "subcategories"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    icon = Column(String, nullable=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    banner_url = Column(String, nullable=True)
    seo_title = Column(String, nullable=True)
    seo_description = Column(String, nullable=True)
    seo_keywords = Column(String, nullable=True)
    canonical_url = Column(String, nullable=True)
    schema_org_json = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)

    # Relationships
    category = relationship("Category", back_populates="subcategories")
    keywords = relationship("CategoryKeyword", back_populates="subcategory", cascade="all, delete-orphan")
    master_services = relationship("MasterService", back_populates="subcategory", cascade="all, delete-orphan")
