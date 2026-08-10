import os
from minio import Minio
from minio.error import S3Error
from fastapi import UploadFile
import uuid

# Load MinIO configuration from environment
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "business-documents")
MINIO_SECURE = os.getenv("MINIO_SECURE", "False").lower() in ("true", "1", "yes")

# Initialize MinIO client
minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_SECURE,
)

def ensure_bucket_exists():
    """Ensure the bucket exists, create it if it doesn't."""
    try:
        found = minio_client.bucket_exists(MINIO_BUCKET_NAME)
        if not found:
            minio_client.make_bucket(MINIO_BUCKET_NAME)
            
            # Make bucket public for downloading images (optional but useful for logos)
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": "*"},
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{MINIO_BUCKET_NAME}/*"],
                    }
                ],
            }
            import json
            minio_client.set_bucket_policy(MINIO_BUCKET_NAME, json.dumps(policy))
    except S3Error as exc:
        print("error occurred.", exc)
    except Exception as e:
        print("error occurred.", e)

def upload_file_to_minio(file: UploadFile, business_id: int, doc_type: str) -> str:
    """
    Uploads a FastAPI UploadFile to MinIO and returns the generated URL.
    """
    ensure_bucket_exists()
    
    # Generate unique filename
    ext = file.filename.split('.')[-1] if '.' in file.filename else 'unknown'
    unique_filename = f"{business_id}_{doc_type.replace(' ', '_')}_{uuid.uuid4().hex[:8]}.{ext}"
    
    # Upload to MinIO
    try:
        import io
        content = file.file.read()
        size = len(content)
        stream = io.BytesIO(content)
        
        minio_client.put_object(
            MINIO_BUCKET_NAME,
            unique_filename,
            stream,
            length=size,
            content_type=file.content_type
        )
        
        # Return public URL (assuming bucket is public or we construct path for internal routing)
        protocol = "https" if MINIO_SECURE else "http"
        return f"{protocol}://{MINIO_ENDPOINT}/{MINIO_BUCKET_NAME}/{unique_filename}"
    
    except S3Error as exc:
        print(f"Error uploading to MinIO: {exc}")
        raise exc
