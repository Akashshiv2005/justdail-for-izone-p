from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)

    states = relationship("State", back_populates="country")

class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    country_id = Column(Integer, ForeignKey("countries.id"))
    is_active = Column(Boolean, default=True)

    country = relationship("Country", back_populates="states")
    districts = relationship("District", back_populates="state")

class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    state_id = Column(Integer, ForeignKey("states.id"))
    is_active = Column(Boolean, default=True)

    state = relationship("State", back_populates="districts")
    cities = relationship("City", back_populates="district")

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, index=True, nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"))
    type = Column(String, default="Major City") # Major City, Municipality, Town Panchayat, Popular Area, Locality, Neighbourhood
    is_active = Column(Boolean, default=True)

    district = relationship("District", back_populates="cities")
    areas = relationship("Area", back_populates="city")

class Area(Base):
    __tablename__ = "areas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, index=True, nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"))
    is_active = Column(Boolean, default=True)

    city = relationship("City", back_populates="areas")
    localities = relationship("Locality", back_populates="area")

class Locality(Base):
    __tablename__ = "localities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, index=True, nullable=False)
    area_id = Column(Integer, ForeignKey("areas.id"))
    is_active = Column(Boolean, default=True)

    area = relationship("Area", back_populates="localities")

class LocationSEO(Base):
    __tablename__ = "location_seo"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String, index=True, nullable=False) # state, district, city, area, locality, category_city, category_area
    entity_id = Column(Integer, nullable=True) # ID of state, district, city, area, locality
    category_id = Column(Integer, nullable=True) # ID of category (for category_city / category_area SEO)
    seo_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    keywords = Column(Text, nullable=True)
    canonical_url = Column(String, nullable=True)
    og_title = Column(String, nullable=True)
    og_description = Column(Text, nullable=True)
    og_image = Column(String, nullable=True)
    schema_json = Column(JSON, nullable=True)

class LocationSlug(Base):
    __tablename__ = "location_slugs"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    entity_type = Column(String, index=True, nullable=False) # country, state, district, city, area, locality, category_city, category_area
    entity_id = Column(Integer, nullable=True)
    category_id = Column(Integer, nullable=True)

class LocationKeyword(Base):
    __tablename__ = "location_keywords"

    id = Column(Integer, primary_key=True, index=True)
    location_type = Column(String, index=True, nullable=False) # district, city, area
    location_id = Column(Integer, nullable=False)
    keyword = Column(String, index=True, nullable=False)
