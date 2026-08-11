from app.services.minio_service import ensure_bucket_exists
print("Testing ensure_bucket_exists...")
ensure_bucket_exists()
print("Done testing.")
