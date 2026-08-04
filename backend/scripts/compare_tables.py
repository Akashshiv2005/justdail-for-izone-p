import os
import sys

# Add backend directory (parent of scripts/) to path so imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, inspect
from database import Base, SQLALCHEMY_DATABASE_URL
# Import all models to ensure they are registered with Base
import models.user
import models.business
import models.category
import models.subcategory
import models.location
import models.review
import models.testimonial
import models.brand
import models.business_extras
import models.seo_models
import models.verification_models
import models.search_config
import models.master_service
import models.business_category_mapping
import models.business_service_mapping
import models.category_keyword

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
