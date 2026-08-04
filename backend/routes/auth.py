from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, RoleEnum
from models.business import Business
from auth_utils import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import os
import shutil

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/api/auth/register")
async def register_business(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone: str = Form(...),
    business_name: str = Form(...),
    category: str = Form(...),
    address: str = Form(None),
    city: str = Form(None),
    business_reg_doc: UploadFile = File(None),
    pan_doc: UploadFile = File(None),
    gstin_doc: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create Owner User
    hashed_pw = get_password_hash(password)
    new_user = User(
        name=name,
        email=email,
        phone=phone,
        hashed_password=hashed_pw,
        role=RoleEnum.owner
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Handle File Upload
    reg_url = ""
    pan_url = ""
    gstin_url = ""

    def save_file(upload_file: UploadFile):
        file_location = os.path.join(UPLOAD_DIR, upload_file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        return f"/uploads/{upload_file.filename}"

    if business_reg_doc:
        reg_url = save_file(business_reg_doc)
    if pan_doc:
        pan_url = save_file(pan_doc)
    if gstin_doc:
        gstin_url = save_file(gstin_doc)

    # Create Business Pending Approval
    new_business = Business(
        owner_id=new_user.id,
        business_name=business_name,
        category=category,
        phone=phone,
        address=address,
        city=city or "Trichy",  # default to Trichy if not provided
        verification_doc_url=reg_url,
        pan_card_doc_url=pan_url,
        gstin_doc_url=gstin_url,
        is_verified=False,
        approval_status="Pending"
    )
    db.add(new_business)
    db.commit()
    
    return {"message": "Registration successful. Pending admin approval."}

from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

@router.post("/api/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Verify role
    if payload.role == "owner":
        business = db.query(Business).filter(Business.owner_id == user.id).first()
        if not business:
            raise HTTPException(status_code=400, detail="No business associated with this account")
        if business.approval_status == "Pending":
            raise HTTPException(status_code=403, detail="Your business registration is pending admin approval")
        elif business.approval_status == "Rejected":
            raise HTTPException(status_code=403, detail="Your business registration request was rejected by the admin")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value}, expires_delta=access_token_expires
        )
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value
            },
            "business": {
                "id": business.id,
                "name": business.business_name
            }
        }
    elif payload.role == "admin":
        if user.role != RoleEnum.admin:
            raise HTTPException(status_code=403, detail="Unauthorized role access")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value}, expires_delta=access_token_expires
        )
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value
            }
        }
    raise HTTPException(status_code=400, detail="Invalid role specified")

