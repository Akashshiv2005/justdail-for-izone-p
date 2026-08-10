import re
import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, Response, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.location import Country, State, District, City, Area, Locality, LocationSEO, LocationSlug, LocationKeyword
from app.models.business import Business
from app.models.category import Category
from app.auth_utils import get_current_admin
from pydantic import BaseModel
from typing import Optional, List

from app.config import get_frontend_url

router = APIRouter()

def slugify(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text

# ──────────────────────────────────────────
# PUBLIC ROUTES
# ──────────────────────────────────────────

@router.get("/api/location/hierarchy")
def get_location_hierarchy(db: Session = Depends(get_db)):
    """Returns the full India > Tamil Nadu > Districts hierarchy."""
    countries = db.query(Country).filter(Country.is_active == True).all()
    result = []
    for c in countries:
        c_data = {"id": c.id, "name": c.name, "slug": c.slug, "states": []}
        states = db.query(State).filter(State.country_id == c.id, State.is_active == True).all()
        for s in states:
            s_data = {"id": s.id, "name": s.name, "slug": s.slug, "districts": []}
            districts = db.query(District).filter(District.state_id == s.id, District.is_active == True).all()
            for d in districts:
                cities = db.query(City).filter(City.district_id == d.id, City.is_active == True).all()
                d_data = {
                    "id": d.id, "name": d.name, "slug": d.slug,
                    "cities": [{"id": ci.id, "name": ci.name, "slug": ci.slug, "type": ci.type} for ci in cities]
                }
                s_data["districts"].append(d_data)
            c_data["states"].append(s_data)
        result.append(c_data)
    return result

@router.get("/api/location/districts")
def get_all_districts(db: Session = Depends(get_db)):
    districts = db.query(District).filter(District.is_active == True).order_by(District.name).all()
    return [{"id": d.id, "name": d.name, "slug": d.slug} for d in districts]

@router.get("/api/location/districts/{district_slug}/cities")
def get_cities_by_district(district_slug: str, db: Session = Depends(get_db)):
    district = db.query(District).filter(District.slug == district_slug).first()
    if not district:
        raise HTTPException(status_code=404, detail="District not found")
    cities = db.query(City).filter(City.district_id == district.id, City.is_active == True).all()
    return [{"id": c.id, "name": c.name, "slug": c.slug, "type": c.type} for c in cities]

@router.get("/api/location/cities/{city_id}/areas")
def get_areas_by_city(city_id: int, db: Session = Depends(get_db)):
    areas = db.query(Area).filter(Area.city_id == city_id, Area.is_active == True).all()
    return [{"id": a.id, "name": a.name, "slug": a.slug} for a in areas]

@router.get("/api/location/resolve")
def resolve_location_seo(
    slug: str = Query(..., description="e.g. state/tamil-nadu or mobile-shops/tiruchirappalli"),
    request: Request = None,
    db: Session = Depends(get_db)
):
    """Resolves a location slug to SEO metadata, breadcrumbs, businesses, and schema."""
    location_slug = db.query(LocationSlug).filter(LocationSlug.slug == slug).first()
    if not location_slug:
        raise HTTPException(status_code=404, detail="Location page not found")

    seo = db.query(LocationSEO).filter(
        LocationSEO.entity_type == location_slug.entity_type,
        LocationSEO.entity_id == location_slug.entity_id,
        LocationSEO.category_id == location_slug.category_id
    ).first()

    meta = {
        "title": seo.seo_title if seo else slug.replace("-", " ").title(),
        "description": seo.meta_description if seo else "",
        "keywords": seo.keywords if seo else "",
        "canonical": f"/{slug}",
        "og_title": seo.og_title or (seo.seo_title if seo else ""),
        "og_description": seo.og_description or (seo.meta_description if seo else ""),
    }

    # Build breadcrumbs
    breadcrumbs = [{"name": "Home", "url": "/"}]
    entity_type = location_slug.entity_type

    if entity_type == "state":
        s = db.query(State).filter(State.id == location_slug.entity_id).first()
        if s:
            breadcrumbs.append({"name": s.name, "url": f"/state/{s.slug}"})

    elif entity_type == "district":
        d = db.query(District).filter(District.id == location_slug.entity_id).first()
        if d:
            s = db.query(State).filter(State.id == d.state_id).first()
            if s:
                breadcrumbs.append({"name": s.name, "url": f"/state/{s.slug}"})
            breadcrumbs.append({"name": d.name, "url": f"/state/{s.slug}/{d.slug}" if s else f"/{d.slug}"})

    elif entity_type in ("category_district", "category_area"):
        parts = slug.split("/")
        breadcrumbs.append({"name": parts[0].replace("-", " ").title(), "url": f"/{parts[0]}"})
        if len(parts) > 1:
            breadcrumbs.append({"name": parts[1].replace("-", " ").title(), "url": f"/{slug}"})

    # Fetch businesses
    query = db.query(Business).filter(Business.approval_status == "Approved")
    if entity_type in ("district", "category_district") and location_slug.entity_id:
        query = query.filter(Business.district_id == location_slug.entity_id)
    elif entity_type in ("area", "category_area") and location_slug.entity_id:
        query = query.filter(Business.area_id == location_slug.entity_id)

    if location_slug.category_id and location_slug.category_id > 0:
        cat = db.query(Category).filter(Category.id == location_slug.category_id).first()
        if cat:
            query = query.filter(Business.category.ilike(f"%{cat.name}%"))

    businesses = query.order_by(Business.average_rating.desc()).limit(20).all()
    biz_list = []
    for b in businesses:
        biz_list.append({
            "id": b.id,
            "business_name": b.business_name,
            "category": b.category,
            "city": b.city,
            "area": b.area,
            "address": b.address,
            "phone": b.phone,
            "whatsapp": b.whatsapp,
            "average_rating": b.average_rating,
            "total_reviews": b.total_reviews,
            "is_verified": b.is_verified,
            "logo_url": b.logo_url,
        })

    # JSON-LD Schema
    base_url = get_frontend_url(request)
    schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": bc["name"], "item": f"{base_url}{bc['url']}" if base_url else bc["url"]}
            for i, bc in enumerate(breadcrumbs)
        ]
    }

    return {
        "meta": meta,
        "breadcrumbs": breadcrumbs,
        "schema": schema,
        "businesses": biz_list,
        "entity_type": entity_type,
        "entity_id": location_slug.entity_id,
    }

@router.get("/api/location/search-index")
def get_search_index(db: Session = Depends(get_db)):
    """Returns a flat list for full-text search of all indexed location slugs."""
    slugs = db.query(LocationSlug).all()
    result = []
    for s in slugs:
        seo = db.query(LocationSEO).filter(
            LocationSEO.entity_type == s.entity_type,
            LocationSEO.entity_id == s.entity_id,
            LocationSEO.category_id == s.category_id
        ).first()
        result.append({
            "slug": s.slug,
            "entity_type": s.entity_type,
            "title": seo.seo_title if seo else s.slug.replace("-", " ").title(),
            "url": f"/{s.slug}"
        })
    return result

# ──────────────────────────────────────────
# SITEMAPS
# ──────────────────────────────────────────

@router.get("/state-sitemap.xml")
def state_sitemap(request: Request, db: Session = Depends(get_db)):
    base_url = get_frontend_url(request)
    states = db.query(State).filter(State.is_active == True).all()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for s in states:
        lines.append(f"<url><loc>{base_url}/state/{s.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>")
    lines.append("</urlset>")
    return Response(content="\n".join(lines), media_type="application/xml")

@router.get("/district-sitemap.xml")
def district_sitemap(request: Request, db: Session = Depends(get_db)):
    base_url = get_frontend_url(request)
    districts = db.query(District).filter(District.is_active == True).all()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for d in districts:
        state = db.query(State).filter(State.id == d.state_id).first()
        if state:
            lines.append(f"<url><loc>{base_url}/state/{state.slug}/{d.slug}</loc><changefreq>weekly</changefreq><priority>0.85</priority></url>")
    lines.append("</urlset>")
    return Response(content="\n".join(lines), media_type="application/xml")

@router.get("/city-sitemap.xml")
def city_sitemap(request: Request, db: Session = Depends(get_db)):
    base_url = get_frontend_url(request)
    cities = db.query(City).filter(City.is_active == True).all()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for c in cities:
        lines.append(f"<url><loc>{base_url}/search?city={c.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")
    lines.append("</urlset>")
    return Response(content="\n".join(lines), media_type="application/xml")

@router.get("/area-sitemap.xml")
def area_sitemap(request: Request, db: Session = Depends(get_db)):
    base_url = get_frontend_url(request)
    areas = db.query(Area).filter(Area.is_active == True).all()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for a in areas:
        lines.append(f"<url><loc>{base_url}/search?area={a.slug}</loc><changefreq>weekly</changefreq><priority>0.75</priority></url>")
    lines.append("</urlset>")
    return Response(content="\n".join(lines), media_type="application/xml")

@router.get("/category-sitemap.xml")
def category_sitemap(request: Request, db: Session = Depends(get_db)):
    base_url = get_frontend_url(request)
    slugs = db.query(LocationSlug).filter(LocationSlug.entity_type.in_(["category_district", "category_area"])).all()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for s in slugs[:500]:  # limit
        lines.append(f"<url><loc>{base_url}/{s.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")
    lines.append("</urlset>")
    return Response(content="\n".join(lines), media_type="application/xml")

@router.get("/business-sitemap.xml")
def business_sitemap(request: Request, db: Session = Depends(get_db)):
    base_url = get_frontend_url(request)
    businesses = db.query(Business).filter(Business.approval_status == "Approved").all()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for b in businesses:
        slug = b.slug or b.id
        lines.append(f"<url><loc>{base_url}/business/{slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>")
    lines.append("</urlset>")
    return Response(content="\n".join(lines), media_type="application/xml")

# ──────────────────────────────────────────
# ADMIN CRUD ROUTES
# ──────────────────────────────────────────

class CountryCreate(BaseModel):
    name: str
    slug: Optional[str] = None

class StateCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    country_id: int

class DistrictCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    state_id: int

class CityCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    district_id: int
    type: Optional[str] = "Major City"

class AreaCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    city_id: int

# ----- Countries -----
@router.get("/api/admin/locations/countries", dependencies=[Depends(get_current_admin)])
def list_countries(db: Session = Depends(get_db)):
    return db.query(Country).all()

@router.post("/api/admin/locations/countries", dependencies=[Depends(get_current_admin)])
def create_country(payload: CountryCreate, db: Session = Depends(get_db)):
    obj = Country(name=payload.name, slug=payload.slug or slugify(payload.name))
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.delete("/api/admin/locations/countries/{country_id}", dependencies=[Depends(get_current_admin)])
def delete_country(country_id: int, db: Session = Depends(get_db)):
    obj = db.query(Country).filter(Country.id == country_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    db.delete(obj); db.commit()
    return {"detail": "Deleted"}

# ----- States -----
@router.get("/api/admin/locations/states", dependencies=[Depends(get_current_admin)])
def list_states(db: Session = Depends(get_db)):
    return db.query(State).all()

@router.post("/api/admin/locations/states", dependencies=[Depends(get_current_admin)])
def create_state(payload: StateCreate, db: Session = Depends(get_db)):
    obj = State(name=payload.name, slug=payload.slug or slugify(payload.name), country_id=payload.country_id)
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.put("/api/admin/locations/states/{state_id}", dependencies=[Depends(get_current_admin)])
def update_state(state_id: int, payload: StateCreate, db: Session = Depends(get_db)):
    obj = db.query(State).filter(State.id == state_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    obj.name = payload.name; obj.slug = payload.slug or slugify(payload.name)
    db.commit(); db.refresh(obj)
    return obj

@router.delete("/api/admin/locations/states/{state_id}", dependencies=[Depends(get_current_admin)])
def delete_state(state_id: int, db: Session = Depends(get_db)):
    obj = db.query(State).filter(State.id == state_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    db.delete(obj); db.commit()
    return {"detail": "Deleted"}

# ----- Districts -----
@router.get("/api/admin/locations/districts", dependencies=[Depends(get_current_admin)])
def list_districts(db: Session = Depends(get_db)):
    districts = db.query(District).order_by(District.name).all()
    result = []
    for d in districts:
        state = db.query(State).filter(State.id == d.state_id).first()
        result.append({
            "id": d.id, "name": d.name, "slug": d.slug, "is_active": d.is_active,
            "state_id": d.state_id, "state_name": state.name if state else ""
        })
    return result

@router.post("/api/admin/locations/districts", dependencies=[Depends(get_current_admin)])
def create_district(payload: DistrictCreate, db: Session = Depends(get_db)):
    obj = District(name=payload.name, slug=payload.slug or slugify(payload.name), state_id=payload.state_id)
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.put("/api/admin/locations/districts/{district_id}", dependencies=[Depends(get_current_admin)])
def update_district(district_id: int, payload: DistrictCreate, db: Session = Depends(get_db)):
    obj = db.query(District).filter(District.id == district_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    obj.name = payload.name; obj.slug = payload.slug or slugify(payload.name)
    db.commit(); db.refresh(obj)
    return obj

@router.delete("/api/admin/locations/districts/{district_id}", dependencies=[Depends(get_current_admin)])
def delete_district(district_id: int, db: Session = Depends(get_db)):
    obj = db.query(District).filter(District.id == district_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    obj.is_active = False; db.commit()
    return {"detail": "Disabled"}

# ----- Cities -----
@router.get("/api/admin/locations/cities", dependencies=[Depends(get_current_admin)])
def list_cities(district_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    q = db.query(City)
    if district_id: q = q.filter(City.district_id == district_id)
    return q.order_by(City.name).all()

@router.post("/api/admin/locations/cities", dependencies=[Depends(get_current_admin)])
def create_city(payload: CityCreate, db: Session = Depends(get_db)):
    obj = City(name=payload.name, slug=payload.slug or slugify(payload.name), district_id=payload.district_id, type=payload.type)
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.put("/api/admin/locations/cities/{city_id}", dependencies=[Depends(get_current_admin)])
def update_city(city_id: int, payload: CityCreate, db: Session = Depends(get_db)):
    obj = db.query(City).filter(City.id == city_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    obj.name = payload.name; obj.slug = payload.slug or slugify(payload.name); obj.type = payload.type
    db.commit(); db.refresh(obj)
    return obj

@router.delete("/api/admin/locations/cities/{city_id}", dependencies=[Depends(get_current_admin)])
def delete_city(city_id: int, db: Session = Depends(get_db)):
    obj = db.query(City).filter(City.id == city_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    obj.is_active = False; db.commit()
    return {"detail": "Disabled"}

# ----- Areas -----
@router.get("/api/admin/locations/areas", dependencies=[Depends(get_current_admin)])
def list_areas(city_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Area)
    if city_id: q = q.filter(Area.city_id == city_id)
    return q.order_by(Area.name).all()

@router.post("/api/admin/locations/areas", dependencies=[Depends(get_current_admin)])
def create_area(payload: AreaCreate, db: Session = Depends(get_db)):
    obj = Area(name=payload.name, slug=payload.slug or slugify(payload.name), city_id=payload.city_id)
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.put("/api/admin/locations/areas/{area_id}", dependencies=[Depends(get_current_admin)])
def update_area(area_id: int, payload: AreaCreate, db: Session = Depends(get_db)):
    obj = db.query(Area).filter(Area.id == area_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    obj.name = payload.name; obj.slug = payload.slug or slugify(payload.name)
    db.commit(); db.refresh(obj)
    return obj

@router.delete("/api/admin/locations/areas/{area_id}", dependencies=[Depends(get_current_admin)])
def delete_area(area_id: int, db: Session = Depends(get_db)):
    obj = db.query(Area).filter(Area.id == area_id).first()
    if not obj: raise HTTPException(status_code=404, detail="Not found")
    obj.is_active = False; db.commit()
    return {"detail": "Disabled"}

# ----- Stats -----
@router.get("/api/admin/locations/stats", dependencies=[Depends(get_current_admin)])
def location_stats(db: Session = Depends(get_db)):
    return {
        "countries": db.query(Country).count(),
        "states": db.query(State).count(),
        "districts": db.query(District).count(),
        "cities": db.query(City).count(),
        "areas": db.query(Area).count(),
        "localities": db.query(Locality).count(),
        "seo_pages": db.query(LocationSEO).count(),
        "slugs": db.query(LocationSlug).count(),
    }

# ----- CSV Export -----
@router.get("/api/admin/locations/export/districts", dependencies=[Depends(get_current_admin)])
def export_districts_csv(db: Session = Depends(get_db)):
    districts = db.query(District).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "slug", "state_id", "is_active"])
    for d in districts:
        writer.writerow([d.id, d.name, d.slug, d.state_id, d.is_active])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=districts.csv"})

@router.get("/api/admin/locations/export/cities", dependencies=[Depends(get_current_admin)])
def export_cities_csv(db: Session = Depends(get_db)):
    cities = db.query(City).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "slug", "district_id", "type", "is_active"])
    for c in cities:
        writer.writerow([c.id, c.name, c.slug, c.district_id, c.type, c.is_active])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=cities.csv"})
