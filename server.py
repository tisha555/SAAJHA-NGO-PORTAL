from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class UserRole(BaseModel):
    DONOR = "donor"
    BENEFICIARY = "beneficiary"
    ADMIN = "admin"
    MEDICAL_FACILITY = "medical_facility"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    role: str  # donor, beneficiary, admin, medical_facility
    blood_type: Optional[str] = None  # A+, A-, B+, B-, O+, O-, AB+, AB-
    phone: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    available_to_donate: Optional[bool] = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str
    blood_type: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class BloodRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_name: str
    blood_type: str
    units_needed: int
    urgency: str  # low, medium, high, critical
    hospital_name: str
    city: str
    state: str
    contact_phone: str
    contact_email: Optional[str] = None
    reason: Optional[str] = None
    status: str = "active"  # active, fulfilled, cancelled
    requested_by: str  # user_id
    requested_by_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    fulfilled_at: Optional[datetime] = None

class BloodRequestCreate(BaseModel):
    patient_name: str
    blood_type: str
    units_needed: int
    urgency: str
    hospital_name: str
    city: str
    state: str
    contact_phone: str
    contact_email: Optional[str] = None
    reason: Optional[str] = None

class MedicalFacility(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    facility_type: str  # hospital, clinic, blood_bank, diagnostic_center
    address: str
    city: str
    state: str
    phone: str
    email: Optional[str] = None
    services: List[str] = []  # blood_bank, emergency, surgery, etc.
    blood_types_available: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MedicalFacilityCreate(BaseModel):
    name: str
    facility_type: str
    address: str
    city: str
    state: str
    phone: str
    email: Optional[str] = None
    services: List[str] = []
    blood_types_available: List[str] = []

class DonationHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    donor_id: str
    donor_name: str
    blood_request_id: Optional[str] = None
    blood_type: str
    units_donated: int
    donation_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    hospital_name: str
    city: str

class DonationHistoryCreate(BaseModel):
    blood_request_id: Optional[str] = None
    blood_type: str
    units_donated: int
    hospital_name: str
    city: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user_doc is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    user_dict = user_data.model_dump(exclude={"password"})
    user_obj = User(**user_dict)
    
    doc = user_obj.model_dump()
    doc['password'] = hashed_password
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user_obj.id, "email": user_obj.email})
    
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    user_doc = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Convert datetime
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user_obj = User(**{k: v for k, v in user_doc.items() if k != 'password'})
    
    access_token = create_access_token(data={"sub": user_obj.id, "email": user_obj.email})
    
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ==================== BLOOD REQUEST ROUTES ====================

@api_router.post("/blood-requests", response_model=BloodRequest)
async def create_blood_request(request_data: BloodRequestCreate, current_user: User = Depends(get_current_user)):
    request_dict = request_data.model_dump()
    request_obj = BloodRequest(
        **request_dict,
        requested_by=current_user.id,
        requested_by_name=current_user.full_name
    )
    
    doc = request_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.blood_requests.insert_one(doc)
    return request_obj

@api_router.get("/blood-requests", response_model=List[BloodRequest])
async def get_blood_requests(
    blood_type: Optional[str] = None,
    city: Optional[str] = None,
    urgency: Optional[str] = None,
    status: str = "active"
):
    query = {"status": status}
    if blood_type:
        query["blood_type"] = blood_type
    if city:
        query["city"] = city
    if urgency:
        query["urgency"] = urgency
    
    requests = await db.blood_requests.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for req in requests:
        if isinstance(req.get('created_at'), str):
            req['created_at'] = datetime.fromisoformat(req['created_at'])
        if req.get('fulfilled_at') and isinstance(req['fulfilled_at'], str):
            req['fulfilled_at'] = datetime.fromisoformat(req['fulfilled_at'])
    
    return requests

@api_router.get("/blood-requests/{request_id}", response_model=BloodRequest)
async def get_blood_request(request_id: str):
    request_doc = await db.blood_requests.find_one({"id": request_id}, {"_id": 0})
    if not request_doc:
        raise HTTPException(status_code=404, detail="Blood request not found")
    
    if isinstance(request_doc.get('created_at'), str):
        request_doc['created_at'] = datetime.fromisoformat(request_doc['created_at'])
    if request_doc.get('fulfilled_at') and isinstance(request_doc['fulfilled_at'], str):
        request_doc['fulfilled_at'] = datetime.fromisoformat(request_doc['fulfilled_at'])
    
    return BloodRequest(**request_doc)

@api_router.patch("/blood-requests/{request_id}/status")
async def update_request_status(request_id: str, status: str, current_user: User = Depends(get_current_user)):
    result = await db.blood_requests.update_one(
        {"id": request_id},
        {"$set": {
            "status": status,
            "fulfilled_at": datetime.now(timezone.utc).isoformat() if status == "fulfilled" else None
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blood request not found")
    
    return {"message": "Status updated successfully"}

# ==================== DONOR MATCHING ROUTES ====================

@api_router.get("/donors/match")
async def find_matching_donors(
    blood_type: str,
    city: Optional[str] = None,
    state: Optional[str] = None
):
    query = {
        "role": "donor",
        "blood_type": blood_type,
        "available_to_donate": True
    }
    if city:
        query["city"] = city
    if state:
        query["state"] = state
    
    donors = await db.users.find(query, {"_id": 0, "password": 0}).to_list(1000)
    
    for donor in donors:
        if isinstance(donor.get('created_at'), str):
            donor['created_at'] = datetime.fromisoformat(donor['created_at'])
    
    return donors

# ==================== MEDICAL FACILITY ROUTES ====================

@api_router.post("/medical-facilities", response_model=MedicalFacility)
async def create_medical_facility(facility_data: MedicalFacilityCreate, current_user: User = Depends(get_current_user)):
    facility_obj = MedicalFacility(**facility_data.model_dump())
    
    doc = facility_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.medical_facilities.insert_one(doc)
    return facility_obj

@api_router.get("/medical-facilities", response_model=List[MedicalFacility])
async def get_medical_facilities(
    city: Optional[str] = None,
    facility_type: Optional[str] = None
):
    query = {}
    if city:
        query["city"] = city
    if facility_type:
        query["facility_type"] = facility_type
    
    facilities = await db.medical_facilities.find(query, {"_id": 0}).sort("name", 1).to_list(1000)
    
    for facility in facilities:
        if isinstance(facility.get('created_at'), str):
            facility['created_at'] = datetime.fromisoformat(facility['created_at'])
    
    return facilities

@api_router.get("/medical-facilities/{facility_id}", response_model=MedicalFacility)
async def get_medical_facility(facility_id: str):
    facility_doc = await db.medical_facilities.find_one({"id": facility_id}, {"_id": 0})
    if not facility_doc:
        raise HTTPException(status_code=404, detail="Medical facility not found")
    
    if isinstance(facility_doc.get('created_at'), str):
        facility_doc['created_at'] = datetime.fromisoformat(facility_doc['created_at'])
    
    return MedicalFacility(**facility_doc)

# ==================== DONATION HISTORY ROUTES ====================

@api_router.post("/donation-history", response_model=DonationHistory)
async def create_donation_history(history_data: DonationHistoryCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "donor":
        raise HTTPException(status_code=403, detail="Only donors can record donations")
    
    history_dict = history_data.model_dump()
    history_obj = DonationHistory(
        **history_dict,
        donor_id=current_user.id,
        donor_name=current_user.full_name
    )
    
    doc = history_obj.model_dump()
    doc['donation_date'] = doc['donation_date'].isoformat()
    
    await db.donation_history.insert_one(doc)
    return history_obj

@api_router.get("/donation-history", response_model=List[DonationHistory])
async def get_donation_history(current_user: User = Depends(get_current_user)):
    query = {"donor_id": current_user.id}
    
    history = await db.donation_history.find(query, {"_id": 0}).sort("donation_date", -1).to_list(1000)
    
    for record in history:
        if isinstance(record.get('donation_date'), str):
            record['donation_date'] = datetime.fromisoformat(record['donation_date'])
    
    return history

@api_router.get("/stats")
async def get_stats():
    total_users = await db.users.count_documents({})
    total_donors = await db.users.count_documents({"role": "donor"})
    active_requests = await db.blood_requests.count_documents({"status": "active"})
    fulfilled_requests = await db.blood_requests.count_documents({"status": "fulfilled"})
    total_facilities = await db.medical_facilities.count_documents({})
    
    return {
        "total_users": total_users,
        "total_donors": total_donors,
        "active_requests": active_requests,
        "fulfilled_requests": fulfilled_requests,
        "total_facilities": total_facilities
    }

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
