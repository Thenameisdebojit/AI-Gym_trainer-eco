import random
import string
import hashlib
import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/auth", tags=["auth"])

# In-memory stores (sufficient for this app)
users_db: dict = {}      # email -> user dict
otp_store: dict = {}     # email -> {otp, expires_at}
sessions_store: dict = {}  # token -> email


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))


def generate_token(email: str) -> str:
    rand = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    return hashlib.sha256(f"{email}{rand}{time.time()}".encode()).hexdigest()[:40]


# ── Schemas ────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    mobile: str
    password: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ResendOTPRequest(BaseModel):
    email: str


# ── Routes ────────────────────────────────────────────────────────────

@router.post("/register")
def register(body: RegisterRequest):
    email = body.email.lower().strip()
    if email in users_db and users_db[email].get("verified"):
        raise HTTPException(status_code=409, detail="Email already registered")

    otp = generate_otp()
    users_db[email] = {
        "first_name": body.first_name,
        "last_name": body.last_name,
        "email": email,
        "mobile": body.mobile,
        "password": hash_password(body.password),
        "verified": False,
    }
    otp_store[email] = {"otp": otp, "expires_at": time.time() + 300}  # 5 min expiry

    # In production, send email via SMTP. Here we return OTP in response for demo.
    return {
        "message": "Registration successful. OTP sent to your email.",
        "otp_preview": otp,   # Remove in production — for demo only
        "email": email,
    }


@router.post("/verify-otp")
def verify_otp(body: VerifyOTPRequest):
    email = body.email.lower().strip()
    record = otp_store.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found for this email. Please register first.")
    if time.time() > record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    if record["otp"] != body.otp.strip():
        raise HTTPException(status_code=400, detail="Incorrect OTP. Please try again.")

    users_db[email]["verified"] = True
    del otp_store[email]

    token = generate_token(email)
    sessions_store[token] = email

    user = users_db[email]
    return {
        "message": "Email verified successfully!",
        "token": token,
        "user": {
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "mobile": user["mobile"],
        },
    }


@router.post("/resend-otp")
def resend_otp(body: ResendOTPRequest):
    email = body.email.lower().strip()
    if email not in users_db:
        raise HTTPException(status_code=404, detail="Email not found. Please register first.")
    if users_db[email].get("verified"):
        raise HTTPException(status_code=400, detail="Email is already verified.")

    otp = generate_otp()
    otp_store[email] = {"otp": otp, "expires_at": time.time() + 300}
    return {"message": "New OTP sent.", "otp_preview": otp}


@router.post("/login")
def login(body: LoginRequest):
    email = body.email.lower().strip()
    user = users_db.get(email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if user["password"] != hash_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.get("verified"):
        raise HTTPException(status_code=403, detail="Please verify your email first.")

    token = generate_token(email)
    sessions_store[token] = email
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "mobile": user["mobile"],
        },
    }


@router.get("/me")
def me(token: str):
    email = sessions_store.get(token)
    if not email or email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    user = users_db[email]
    return {
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "mobile": user["mobile"],
    }


@router.post("/logout")
def logout(token: str):
    sessions_store.pop(token, None)
    return {"message": "Logged out successfully."}
