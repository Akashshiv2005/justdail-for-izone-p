from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class MasterService(Base):
    __tablename__ = "master_services"

    id = Column(Integer, primary_key=True, index=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    is_active = Column(Boolean, default=True)

    subcategory = relationship("Subcategory", back_populates="master_services")
    businesses = relationship("BusinessServiceMapping", back_populates="master_service")
