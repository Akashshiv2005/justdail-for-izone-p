from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, default="text-slate-800")
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
