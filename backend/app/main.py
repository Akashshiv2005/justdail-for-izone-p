from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models.user
import app.models.business
import app.models.review
import app.models.business_extras
import app.models.category
import app.models.subcategory
import app.models.business_category_mapping
import app.models.testimonial
import app.models.brand
import app.models.seo_models
import app.models.verification_models
import app.models.location
import app.models.search_config
import app.models.master_service
import app.models.category_keyword
import app.models.business_service_mapping
from app.routes.search import router as search_router
from app.routes.homepage import router as homepage_router
from app.routes.auth import router as auth_router
from app.routes.owner import router as owner_router
from app.routes.admin import router as admin_router
from app.routes.seo import router as seo_router
from app.routes.verification import router as verification_router
from app.routes.admin_category import router as admin_category_router, subrouter as admin_subcategory_router, service_router as admin_service_router
from app.routes.location_routes import router as location_router
from app.routes.search_admin import router as search_admin_router

from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text("CREATE SCHEMA IF NOT EXISTS bizdial1"))
    conn.commit()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BizDial API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    pass


from app.config import get_cors_origins, DEBUG

origins = get_cors_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(search_router)
app.include_router(homepage_router)
app.include_router(auth_router)
app.include_router(owner_router)
app.include_router(admin_router)
app.include_router(seo_router)
app.include_router(verification_router)
app.include_router(admin_category_router)
app.include_router(admin_subcategory_router)
app.include_router(admin_service_router)
app.include_router(location_router)
app.include_router(search_admin_router)

from fastapi.staticfiles import StaticFiles
import os

if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to BizDial API - Server is Running and Database is Connected!"}
