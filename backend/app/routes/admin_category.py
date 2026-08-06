from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.category import Category
from app.models.subcategory import Subcategory
from app.schemas import (
    CategoryOut,
    CategoryCreate,
    CategoryUpdate,
    SubcategoryOut,
    SubcategoryCreate,
    SubcategoryUpdate,
    MasterServiceOut,
    MasterServiceCreate,
    MasterServiceUpdate
)
from app.models.master_service import MasterService

router = APIRouter(prefix="/api/admin/categories", tags=["admin", "category"])

# ── Category Endpoints ────────────────────────────────────────

@router.get("/", response_model=List[CategoryOut])
def list_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.display_order).offset(skip).limit(limit).all()

@router.post("/", response_model=CategoryOut)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    if db.query(Category).filter(Category.name == payload.name).first():
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    slug = payload.slug or payload.name.lower().replace(" ", "-")
    category = Category(
        name=payload.name,
        icon=payload.icon,
        slug=slug,
        description=payload.description,
        image_url=payload.image_url,
        banner_url=payload.banner_url,
        seo_title=payload.seo_title,
        seo_description=payload.seo_description,
        seo_keywords=payload.seo_keywords,
        is_featured=payload.is_featured,
        is_active=payload.is_active,
        display_order=payload.display_order,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.put("/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, payload: CategoryUpdate, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(cat, attr, value)
    if "name" in payload.dict(exclude_unset=True) and not payload.slug:
        cat.slug = cat.name.lower().replace(" ", "-")
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}

# ── Subcategory Endpoints ────────────────────────────────────────

subrouter = APIRouter(prefix="/api/admin/subcategories", tags=["admin", "subcategory"])

@subrouter.get("/", response_model=List[SubcategoryOut])
def list_subcategories(
    category_id: int = Query(None), skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    query = db.query(Subcategory)
    if category_id:
        query = query.filter(Subcategory.category_id == category_id)
    return query.order_by(Subcategory.display_order).offset(skip).limit(limit).all()

@subrouter.post("/", response_model=SubcategoryOut)
def create_subcategory(payload: SubcategoryCreate, db: Session = Depends(get_db)):
    parent = db.query(Category).filter(Category.id == payload.category_id).first()
    if not parent:
        raise HTTPException(status_code=400, detail="Parent category does not exist")
    if db.query(Subcategory).filter(
        Subcategory.category_id == payload.category_id,
        Subcategory.name == payload.name,
    ).first():
        raise HTTPException(status_code=400, detail="Subcategory with this name already exists in the parent category")
    slug = payload.slug or payload.name.lower().replace(" ", "-")
    sub = Subcategory(
        category_id=payload.category_id,
        name=payload.name,
        icon=payload.icon,
        slug=slug,
        description=payload.description,
        image_url=payload.image_url,
        banner_url=payload.banner_url,
        seo_title=payload.seo_title,
        seo_description=payload.seo_description,
        seo_keywords=payload.seo_keywords,
        is_active=payload.is_active,
        display_order=payload.display_order,
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub

@subrouter.put("/{sub_id}", response_model=SubcategoryOut)
def update_subcategory(sub_id: int, payload: SubcategoryUpdate, db: Session = Depends(get_db)):
    sub = db.query(Subcategory).filter(Subcategory.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(sub, attr, value)
    if "name" in payload.dict(exclude_unset=True) and not payload.slug:
        sub.slug = sub.name.lower().replace(" ", "-")
    db.commit()
    db.refresh(sub)
    return sub

@subrouter.delete("/{sub_id}")
def delete_subcategory(sub_id: int, db: Session = Depends(get_db)):
    sub = db.query(Subcategory).filter(Subcategory.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    db.delete(sub)
    db.commit()
    return {"message": "Subcategory deleted"}

# ── Master Service Endpoints ────────────────────────────────────────

service_router = APIRouter(prefix="/api/admin/services", tags=["admin", "master_service"])

@service_router.get("/", response_model=List[MasterServiceOut])
def list_master_services(
    subcategory_id: int = Query(None), skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    query = db.query(MasterService)
    if subcategory_id:
        query = query.filter(MasterService.subcategory_id == subcategory_id)
    return query.offset(skip).limit(limit).all()

@service_router.post("/", response_model=MasterServiceOut)
def create_master_service(payload: MasterServiceCreate, db: Session = Depends(get_db)):
    parent = db.query(Subcategory).filter(Subcategory.id == payload.subcategory_id).first()
    if not parent:
        raise HTTPException(status_code=400, detail="Parent subcategory does not exist")
    svc = MasterService(
        subcategory_id=payload.subcategory_id,
        name=payload.name,
        is_active=payload.is_active,
    )
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return svc

@service_router.put("/{service_id}", response_model=MasterServiceOut)
def update_master_service(service_id: int, payload: MasterServiceUpdate, db: Session = Depends(get_db)):
    svc = db.query(MasterService).filter(MasterService.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(svc, attr, value)
    db.commit()
    db.refresh(svc)
    return svc

@service_router.delete("/{service_id}")
def delete_master_service(service_id: int, db: Session = Depends(get_db)):
    svc = db.query(MasterService).filter(MasterService.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(svc)
    db.commit()
    return {"message": "Service deleted"}
