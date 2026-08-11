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

def upload_base64_to_minio(base64_str: str, business_id: int, doc_type: str) -> str:
    """
    Uploads a base64 encoded image string to MinIO and returns the generated URL.
    """
    ensure_bucket_exists()
    import io
    import base64
    
    # Check if it's a data URL (e.g. data:image/png;base64,iVBOR...)
    content_type = "image/jpeg"
    ext = "jpg"
    
    if base64_str.startswith('data:'):
        header, base64_data = base64_str.split(',', 1)
        # header looks like 'data:image/png;base64'
        if ';' in header:
            content_type = header.split(';')[0].replace('data:', '')
            if '/' in content_type:
                ext = content_type.split('/')[1]
    else:
        base64_data = base64_str

    unique_filename = f"{business_id}_{doc_type.replace(' ', '_')}_{uuid.uuid4().hex[:8]}.{ext}"
    
    try:
        content = base64.b64decode(base64_data)
        size = len(content)
        stream = io.BytesIO(content)
        
        minio_client.put_object(
            MINIO_BUCKET_NAME,
            unique_filename,
            stream,
            length=size,
            content_type=content_type
        )
        

        protocol = "https" if MINIO_SECURE else "http"
        return f"{protocol}://{MINIO_ENDPOINT}/{MINIO_BUCKET_NAME}/{unique_filename}"
        
    except S3Error as exc:
        print(f"Error uploading to MinIO: {exc}")
        raise exc
    except Exception as e:
        print(f"Error decoding base64: {e}")
        raise e

def delete_file_from_minio(file_url: str):
    """
    Deletes a file from MinIO given its public URL.
    """
    if not file_url:
        return
        
    try:
        # Extract filename from URL
        # URL format: http(s)://ENDPOINT/BUCKET_NAME/filename
        # We can just split by BUCKET_NAME/ and take the last part
        if f"/{MINIO_BUCKET_NAME}/" in file_url:
            filename = file_url.split(f"/{MINIO_BUCKET_NAME}/")[-1]
            minio_client.remove_object(MINIO_BUCKET_NAME, filename)
            print(f"Successfully deleted {filename} from MinIO")
    except S3Error as exc:
        print(f"Error deleting from MinIO: {exc}")
    except Exception as e:
        print(f"Error parsing URL for MinIO deletion: {e}")
