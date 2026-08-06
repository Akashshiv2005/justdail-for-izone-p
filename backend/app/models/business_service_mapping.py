from sqlalchemy import Column, Integer, ForeignKey, Float, String
from sqlalchemy.orm import relationship
from app.database import Base

class BusinessServiceMapping(Base):
    __tablename__ = "business_service_mappings"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False, index=True)
    master_service_id = Column(Integer, ForeignKey("master_services.id"), nullable=False, index=True)
    
    price = Column(Float, nullable=True)
    description = Column(String, nullable=True)

    master_service = relationship("MasterService", back_populates="businesses")
    business = relationship("Business", back_populates="master_service_mappings")
