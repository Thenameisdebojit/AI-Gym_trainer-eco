import random
import string
import hashlib
import time
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Boolean, Float
from sqlalchemy.orm import Session as OrmSession
from config.database import Base, SessionLocal, engine

router = APIRouter(prefix="/auth", tags=["auth"])

# ── SQLAlchemy Models ──────────────────────────────────────────────────

class AuthUser(Base):
    __tablename__ = "auth_users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile = Column(String, nullable=False, default="")
    password_hash = Column(String, nullable=True)
    verified = Column(Boolean, default=False)
    provider = Column(String, default="email")


class OTPRecord(Base):
    __tablename__ = "auth_otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    otp = Column(String, nullable=False)
    expires_at = Column(Float, nullable=False)


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, nullable=False)


Base.metadata.create_all(bind=engine)


# ── DB Dependency ──────────────────────────────────────────────────────

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Helpers ────────────────────────────────────────────────────────────

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


def _user_dict(user: AuthUser) -> dict:
    return {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "mobile": user.mobile,
    }


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


class GoogleAuthRequest(BaseModel):
    id_token: str
    email: str
    first_name: str
    last_name: str
    photo_url: str = ""


# ── Routes ────────────────────────────────────────────────────────────

@router.post("/register")
def register(body: RegisterRequest, db: OrmSession = Depends(get_db)):
    email = body.email.lower().strip()

    existing = db.query(AuthUser).filter(AuthUser.email == email).first()
    if existing and existing.verified:
        raise HTTPException(status_code=409, detail="Email already registered")

    otp = generate_otp()

    if existing:
        existing.first_name = body.first_name
        existing.last_name = body.last_name
        existing.mobile = body.mobile
        existing.password_hash = hash_password(body.password)
        existing.verified = False
    else:
        new_user = AuthUser(
            first_name=body.first_name,
            last_name=body.last_name,
            email=email,
            mobile=body.mobile,
            password_hash=hash_password(body.password),
            verified=False,
            provider="email",
        )
        db.add(new_user)

    db.query(OTPRecord).filter(OTPRecord.email == email).delete()
    db.add(OTPRecord(email=email, otp=otp, expires_at=time.time() + 300))
    db.commit()

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
def verify_otp(body: VerifyOTPRequest, db: OrmSession = Depends(get_db)):
    email = body.email.lower().strip()

    record = db.query(OTPRecord).filter(OTPRecord.email == email).first()
    if not record:
        raise HTTPException(status_code=400, detail="No OTP found for this email. Please register first.")
    if time.time() > record.expires_at:
        db.delete(record)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    if record.otp != body.otp.strip():
        raise HTTPException(status_code=400, detail="Incorrect OTP. Please try again.")

    user = db.query(AuthUser).filter(AuthUser.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.verified = True
    db.delete(record)

    token = generate_token(email)
    db.add(AuthSession(token=token, email=email))
    db.commit()

    return {
        "message": "Email verified successfully!",
        "token": token,
        "user": _user_dict(user),
    }


@router.post("/resend-otp")
def resend_otp(body: ResendOTPRequest, db: OrmSession = Depends(get_db)):
    email = body.email.lower().strip()

    user = db.query(AuthUser).filter(AuthUser.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found. Please register first.")
    if user.verified:
        raise HTTPException(status_code=400, detail="Email is already verified.")

    otp = generate_otp()
    db.query(OTPRecord).filter(OTPRecord.email == email).delete()
    db.add(OTPRecord(email=email, otp=otp, expires_at=time.time() + 300))
    db.commit()

    email_sent = send_otp_email(email, otp, user.first_name)
    response = {"message": "New OTP sent.", "email_sent": email_sent}
    if not email_sent:
        response["otp_preview"] = otp
    return response


@router.post("/login")
def login(body: LoginRequest, db: OrmSession = Depends(get_db)):
    email = body.email.lower().strip()

    user = db.query(AuthUser).filter(AuthUser.email == email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if user.password_hash != hash_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.verified:
        raise HTTPException(status_code=403, detail="Please verify your email first.")

    token = generate_token(email)
    db.add(AuthSession(token=token, email=email))
    db.commit()

    return {
        "message": "Login successful",
        "token": token,
        "user": _user_dict(user),
    }


@router.post("/google")
def google_auth(body: GoogleAuthRequest, db: OrmSession = Depends(get_db)):
    email = body.email.lower().strip()

    user = db.query(AuthUser).filter(AuthUser.email == email).first()
    if not user:
        user = AuthUser(
            first_name=body.first_name,
            last_name=body.last_name,
            email=email,
            mobile="",
            password_hash=None,
            verified=True,
            provider="google",
        )
        db.add(user)
    else:
        user.verified = True
        if not user.first_name and body.first_name:
            user.first_name = body.first_name
        if not user.last_name and body.last_name:
            user.last_name = body.last_name

    token = generate_token(email)
    db.add(AuthSession(token=token, email=email))
    db.commit()
    db.refresh(user)

    return {
        "message": "Google login successful",
        "token": token,
        "user": _user_dict(user),
    }


@router.get("/me")
def me(token: str, db: OrmSession = Depends(get_db)):
    session = db.query(AuthSession).filter(AuthSession.token == token).first()
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    user = db.query(AuthUser).filter(AuthUser.email == session.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    return _user_dict(user)


@router.post("/logout")
def logout(token: str, db: OrmSession = Depends(get_db)):
    db.query(AuthSession).filter(AuthSession.token == token).delete()
    db.commit()
    return {"message": "Logged out successfully."}
