from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class CategoryKeyword(Base):
    __tablename__ = "category_keywords"

    id = Column(Integer, primary_key=True, index=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True, index=True)
    keyword = Column(String, nullable=False, index=True)

    subcategory = relationship("Subcategory", back_populates="keywords")
    category = relationship("Category", back_populates="keywords")
