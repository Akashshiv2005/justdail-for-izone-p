import os
from typing import Optional, List
from fastapi import Request
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "").rstrip("/")
BACKEND_URL = os.getenv("BACKEND_URL", "").rstrip("/")
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
SECRET_KEY = os.getenv("SECRET_KEY", "your_super_secret_jwt_key_here")
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

def get_cors_origins() -> List[str]:
    """Parses FRONTEND_URL & CORS_ORIGINS from environment variables into a list of allowed origins."""
    origins = []
    raw_env = os.getenv("CORS_ORIGINS", "")
    if FRONTEND_URL:
        origins.extend([url.strip().rstrip("/") for url in FRONTEND_URL.split(",") if url.strip()])
    if raw_env:
        origins.extend([url.strip().rstrip("/") for url in raw_env.split(",") if url.strip()])
    
    if DEBUG:
        local_defaults = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"]
        for d in local_defaults:
            if d not in origins:
                origins.append(d)
            
    return list(dict.fromkeys(origins))

def get_frontend_url(request: Optional[Request] = None) -> str:
    """Returns FRONTEND_URL from environment or dynamically derives URL from current incoming request."""
    if FRONTEND_URL:
        return FRONTEND_URL.split(",")[0].strip().rstrip("/")
    if request:
        host = request.headers.get("x-forwarded-host") or request.headers.get("host")
        scheme = request.headers.get("x-forwarded-proto") or request.url.scheme
        if host:
            return f"{scheme}://{host}".rstrip("/")
        return str(request.base_url).rstrip("/")
    return ""

def get_backend_url(request: Optional[Request] = None) -> str:
    """Returns BACKEND_URL from environment or dynamically derives URL from current incoming request."""
    if BACKEND_URL:
        return BACKEND_URL.split(",")[0].strip().rstrip("/")
    if request:
        host = request.headers.get("x-forwarded-host") or request.headers.get("host")
        scheme = request.headers.get("x-forwarded-proto") or request.url.scheme
        if host:
            return f"{scheme}://{host}".rstrip("/")
        return str(request.base_url).rstrip("/")
    return ""
