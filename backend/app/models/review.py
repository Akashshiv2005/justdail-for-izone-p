from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    rating = Column(Float, nullable=False)
    comment = Column(String)
    
    moderation_status = Column(String, default="pending") # pending, approved, rejected, flagged
    toxicity_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="reviews")
    user = relationship("User")
