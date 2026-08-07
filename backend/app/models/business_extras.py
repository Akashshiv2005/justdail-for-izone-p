from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    name = Column(String, nullable=False)
    category = Column(String)
    price = Column(Float)
    stock_quantity = Column(Integer, default=0)
    image_url = Column(String)
    
class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    name = Column(String, nullable=False)
    duration = Column(String)
    base_price = Column(Float)
    popularity_score = Column(Integer, default=0)

class GalleryImage(Base):
    __tablename__ = "gallery_images"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    image_url = Column(String, nullable=False)
    title = Column(String)
    category = Column(String) # Exterior, Interior, Product
    views_count = Column(Integer, default=0)

class LeadStatus(str, enum.Enum):
    pending = "Pending"
    contacted = "Contacted"
    converted = "Converted"
    rejected = "Rejected"

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    service_interest = Column(String)
    status = Column(Enum(LeadStatus), default=LeadStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class StaffRole(str, enum.Enum):
    manager = "Manager"
    technician = "Technician"

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    name = Column(String, nullable=False)
    role = Column(Enum(StaffRole), default=StaffRole.technician)
    email = Column(String)
    phone = Column(String)
    status = Column(String, default="Active")

class Promotion(Base):
    __tablename__ = "promotions"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    campaign_name = Column(String, nullable=False)
    campaign_type = Column(String)
    budget = Column(Float)
    clicks = Column(Integer, default=0)
    status = Column(String, default="Active")

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    subject = Column(String, nullable=False)
    category = Column(String)
    message = Column(String)
    status = Column(String, default="Open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    amount = Column(Float, nullable=False)
    description = Column(String)
    status = Column(String, default="Unpaid")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
