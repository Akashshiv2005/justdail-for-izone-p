"""
One-off migration: rebuild `seo_keywords` with the new business-scoped schema.

Why a script instead of an Alembic revision: this project doesn't actually
use Alembic migrations yet (tables are created via Base.metadata.create_all
in main.py, and backend/alembic/versions/ is empty). The old seo_keywords
table only ever held the 3 hardcoded fake rows the old code auto-inserted,
so it's safe to drop and let create_all rebuild it with the new
business_id-based structure.

Run this ONCE, after pulling this update and before starting the server:

    cd backend
    python migrate_seo_keywords.py
"""
from sqlalchemy import inspect, text
from database import engine, Base

# Import all models so Base.metadata knows about every table before create_all
import models.brand
import models.business
import models.business_category_mapping
import models.business_extras
import models.business_service_mapping
import models.category
import models.category_keyword
import models.location
import models.master_service
import models.review
import models.search_config
import models.seo_models
import models.subcategory
import models.testimonial
import models.user
import models.verification_models


def main():
    inspector = inspect(engine)
    if "seo_keywords" in inspector.get_table_names():
        columns = {c["name"] for c in inspector.get_columns("seo_keywords")}
        if "business_id" in columns:
            print("seo_keywords already has business_id — nothing to do.")
            return
        print("Old seo_keywords schema detected (no business_id). Dropping table...")
        with engine.begin() as conn:
            conn.execute(text("DROP TABLE seo_keywords"))
        print("Dropped.")

    print("Recreating tables (create_all is additive/idempotent for missing tables)...")
    Base.metadata.create_all(bind=engine)
    print("Done. seo_keywords now uses the business-scoped schema.")


if __name__ == "__main__":
    main()
