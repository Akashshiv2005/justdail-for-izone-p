from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class BusinessCategoryMapping(Base):
    __tablename__ = "business_category_mapping"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=True, index=True)

    # Relationships
    business = relationship("Business", back_populates="category_mappings")
    category = relationship("Category")
    subcategory = relationship("Subcategory")

