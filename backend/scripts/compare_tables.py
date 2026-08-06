import os
import sys

# Add backend directory (parent of scripts/) to path so imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, inspect
from app.database import Base, SQLALCHEMY_DATABASE_URL
# Import all models to ensure they are registered with Base
import app.models.user
import app.models.business
import app.models.category
import app.models.subcategory
import app.models.location
import app.models.review
import app.models.testimonial
import app.models.brand
import app.models.business_extras
import app.models.seo_models
import app.models.verification_models
import app.models.search_config
import app.models.master_service
import app.models.business_category_mapping
import app.models.business_service_mapping
import app.models.category_keyword

engine = create_engine(SQLALCHEMY_DATABASE_URL)
inspector = inspect(engine)
db_tables = set(inspector.get_table_names())
model_tables = set(Base.metadata.tables.keys())

missing_in_db = model_tables - db_tables
extra_in_db = db_tables - model_tables

print("--- Table Comparison ---")
print(f"Total tables expected by models: {len(model_tables)}")
print(f"Total tables in database: {len(db_tables)}")

if missing_in_db:
    print("\n⚠️ WARNING: The following tables are defined in your code but MISSING from the database:")
    for t in missing_in_db:
        print(f"  - {t}")
else:
    print("\n✅ All models are successfully created as tables in the database!")

if extra_in_db:
    print("\nℹ️ The following tables exist in the database but are NOT defined in models (could be alembic/legacy):")
    for t in extra_in_db:
        print(f"  - {t}")
