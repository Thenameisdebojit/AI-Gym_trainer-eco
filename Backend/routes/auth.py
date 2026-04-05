import random
import string
import hashlib
import time
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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


def send_otp_email(to_email: str, otp: str, first_name: str = "") -> bool:
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")

    if not smtp_user or not smtp_pass:
        print(f"[FitAI] OTP for {to_email}: {otp}  (set SMTP_USER & SMTP_PASS to send real emails)")
        return False

    from_email = os.environ.get("SMTP_FROM", smtp_user)
    name = first_name or "there"

    html_body = f"""
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <span style="font-size:32px;">⚡</span>
        <h1 style="margin:8px 0 4px;font-size:22px;color:#111;">FitAI</h1>
        <p style="margin:0;color:#6b7280;font-size:14px;">AI Fitness Trainer</p>
      </div>
      <h2 style="font-size:18px;color:#111;margin-bottom:8px;">Hi {name} 👋</h2>
      <p style="color:#374151;font-size:15px;line-height:1.6;">
        Your verification code for FitAI is:
      </p>
      <div style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;background:linear-gradient(135deg,#2563EB,#7C3AED);color:#fff;
          font-size:36px;font-weight:900;letter-spacing:10px;padding:16px 32px;border-radius:12px;">
          {otp}
        </span>
      </div>
      <p style="color:#6b7280;font-size:13px;text-align:center;">
        This code expires in <strong>5 minutes</strong>. Do not share it with anyone.
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#9ca3af;font-size:12px;text-align:center;">
        If you didn't create a FitAI account, you can safely ignore this email.
      </p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Your FitAI verification code: {otp}"
    msg["From"] = f"FitAI <{from_email}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(from_email, to_email, msg.as_string())
        print(f"[FitAI] OTP email sent to {to_email}")
        return True
    except Exception as e:
        print(f"[FitAI] Failed to send OTP email to {to_email}: {e}")
        print(f"[FitAI] OTP for {to_email}: {otp}")
        return False


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

    email_sent = send_otp_email(email, otp, body.first_name)

    response = {
        "message": "Registration successful. OTP sent to your email.",
        "email": email,
        "email_sent": email_sent,
    }
    if not email_sent:
        response["otp_preview"] = otp
    return response


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

    email_sent = send_otp_email(email, otp, users_db[email].get("first_name", ""))
    response = {"message": "New OTP sent.", "email_sent": email_sent}
    if not email_sent:
        response["otp_preview"] = otp
    return response


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
