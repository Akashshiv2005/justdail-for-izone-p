from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from app.database import get_db
from app.models.business import Business
from app.models.category import Category
from app.models.testimonial import Testimonial
from app.models.brand import Brand
from app.models.user import User
from app.models.review import Review
from app.schemas import (
    BusinessOut, CategoryOut, TestimonialOut, BrandOut,
    StatsOut, HomepageDataResponse
)

router = APIRouter()


@router.get("/api/homepage", response_model=HomepageDataResponse)
def get_homepage_data(db: Session = Depends(get_db)):
    # Categories
    categories = db.query(Category).filter(Category.is_active == True).order_by(Category.display_order).all()

    # Featured businesses (approved, sorted by rating)
    featured = (
        db.query(Business)
        .filter(Business.approval_status == "Approved")
        .order_by(Business.is_verified.desc(), Business.average_rating.desc())
        .limit(5)
        .all()
    )

    # Top picks - group businesses by category, count listings
    category_counts = (
        db.query(
            Business.category,
            func.count(Business.id).label("count")
        )
        .filter(Business.approval_status == "Approved")
        .group_by(Business.category)
        .order_by(func.count(Business.id).desc())
        .limit(5)
        .all()
    )

    top_picks = []
    default_images = [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
    ]
    for i, (cat_name, count) in enumerate(category_counts):
        top_picks.append({
            "title": f"Best {cat_name}",
            "img": default_images[i % len(default_images)],
            "listings": f"{count}+ Listings",
        })

    # Testimonials
    testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).all()

    # Brands
    brands = db.query(Brand).filter(Brand.is_active == True).order_by(Brand.display_order).all()

    # Stats
    total_businesses = db.query(func.count(Business.id)).scalar() or 0
    total_reviews = db.query(func.count(Review.id)).scalar() or 0
    total_cities = db.query(func.count(distinct(Business.city))).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0

    stats = StatsOut(
        businesses=total_businesses,
        reviews=total_reviews,
        cities=total_cities,
        users=total_users,
    )

    return HomepageDataResponse(
        categories=[CategoryOut.model_validate(c) for c in categories],
        featured_businesses=[BusinessOut.model_validate(b) for b in featured],
        top_picks=top_picks,
        testimonials=[TestimonialOut.model_validate(t) for t in testimonials],
        brands=[BrandOut.model_validate(b) for b in brands],
        stats=stats,
    )


@router.get("/api/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).order_by(Category.display_order).all()
