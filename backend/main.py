from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models.user
import models.business
import models.review
import models.business_extras
import models.category
import models.subcategory
import models.business_category_mapping
import models.testimonial
import models.brand
import models.seo_models
import models.verification_models
import models.location
import models.search_config
import models.master_service
import models.category_keyword
import models.business_service_mapping
from routes.search import router as search_router
from routes.homepage import router as homepage_router
from routes.auth import router as auth_router
from routes.owner import router as owner_router
from routes.admin import router as admin_router
from routes.seo import router as seo_router
from routes.verification import router as verification_router
from routes.admin_category import router as admin_category_router, subrouter as admin_subcategory_router, service_router as admin_service_router
from routes.location_routes import router as location_router
from routes.search_admin import router as search_admin_router

from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text("CREATE SCHEMA IF NOT EXISTS bizdial"))
    conn.commit()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BizDial API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    pass


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
