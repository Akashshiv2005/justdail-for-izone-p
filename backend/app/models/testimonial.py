from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from app.database import Base

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    text = Column(String, nullable=False)
    avatar_url = Column(String)
    rating = Column(Float, default=5.0)
    is_active = Column(Boolean, default=True)
    # Track which business owner submitted this review (optional)
    business_id = Column(Integer, nullable=True)
    owner_id = Column(Integer, nullable=True)
    status = Column(String, default="pending")  # pending | approved | rejected
