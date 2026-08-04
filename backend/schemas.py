from pydantic import BaseModel
from typing import Optional, List


class BusinessOut(BaseModel):
    id: int
    business_name: str
    category: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    is_verified: bool = False
    average_rating: float = 0.0
    total_reviews: int = 0
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    approval_status: str = "Pending"

    class Config:
        from_attributes = True


class BusinessProfileUpdate(BaseModel):
    address: Optional[str] = None
    google_map_url: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None


# ── Category Schemas ──────────────────────────────────────


class CategoryOut(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_org_json: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True
    display_order: int = 0
    subcategories: List['SubcategoryOut'] = []

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str
    icon: Optional[str] = None
    slug: Optional[str] = None  # auto-generated if not provided
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_org_json: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True
    display_order: int = 0


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_org_json: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


# ── Subcategory Schemas ───────────────────────────────────


class SubcategoryOut(BaseModel):
    id: int
    category_id: int
    name: str
    icon: Optional[str] = None
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_org_json: Optional[str] = None
    is_active: bool = True
    display_order: int = 0

    class Config:
        from_attributes = True


class SubcategoryCreate(BaseModel):
    category_id: int
    name: str
    icon: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_org_json: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class SubcategoryUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    icon: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    schema_org_json: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


# ── Business–Category Mapping Schema ─────────────────────


class BusinessCategoryAssign(BaseModel):
    category_id: int
    subcategory_id: Optional[int] = None


# ── Master Service Schemas ──────────────────────────────────

class MasterServiceOut(BaseModel):
    id: int
    subcategory_id: int
    name: str
    is_active: bool

    class Config:
        from_attributes = True


class MasterServiceCreate(BaseModel):
    subcategory_id: int
    name: str
    is_active: bool = True


class MasterServiceUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None


# ── Other Schemas (unchanged) ────────────────────────────


class TestimonialOut(BaseModel):
    id: int
    name: str
    role: str
    text: str
    avatar_url: Optional[str] = None
    rating: float = 5.0

    class Config:
        from_attributes = True


class BrandOut(BaseModel):
    id: int
    name: str
    color: str

    class Config:
        from_attributes = True


class StatsOut(BaseModel):
    businesses: int
    reviews: int
    cities: int
    users: int


class HomepageDataResponse(BaseModel):
    categories: list[CategoryOut]
    featured_businesses: list[BusinessOut]
    top_picks: list[dict]
    testimonials: list[TestimonialOut]
    brands: list[BrandOut]
    stats: StatsOut

try:
    CategoryOut.model_rebuild()
except AttributeError:
    CategoryOut.update_forward_refs()

