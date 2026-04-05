'use client';
import { useState } from 'react';
import { signInWithGoogle } from '../lib/firebase';

const PRIMARY = '#2563EB';
const PURPLE = '#7C3AED';
const ERROR = '#EF4444';
const SUCCESS = '#10B981';

const inputStyle = (focused) => ({
  width: '100%',
  padding: '13px 16px',
  borderRadius: 12,
  border: `1.5px solid ${focused ? PRIMARY : '#E2E8F0'}`,
  fontSize: 14,
  color: '#0F172A',
  background: '#F8FAFF',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
});

function InputField({ label, type = 'text', value, onChange, placeholder, maxLength, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function OtpBox({ otp, setOtp }) {
  const digits = otp.split('').concat(Array(6 - otp.length).fill(''));
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>Enter 6-digit OTP</label>
      <div style={{ position: 'relative' }}>
        <input
          type="tel"
          value={otp}
          onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setOtp(v); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text', zIndex: 2, fontSize: 1 }}
          autoComplete="one-time-code"
          inputMode="numeric"
        />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {digits.map((d, i) => (
            <div key={i} style={{ width: 46, height: 54, borderRadius: 12, border: `2px solid ${focused && otp.length === i ? PRIMARY : d ? PRIMARY + '60' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#0F172A', background: d ? '#EFF6FF' : '#F8FAFF', transition: 'border-color 0.15s' }}>
              {d || (focused && otp.length === i ? <span style={{ width: 2, height: 22, background: PRIMARY, display: 'inline-block', animation: 'blink 1s step-end infinite' }} /> : '')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');     // 'login' | 'signup' | 'verify'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  // login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // otp
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpPreview, setOtpPreview] = useState(''); // demo only

  const clearError = () => setError('');

  const handleSignup = async () => {
    clearError();
    if (!firstName.trim()) return setError('First name is required.');
    if (!lastName.trim()) return setError('Last name is required.');
    if (!email.trim() || !email.includes('@')) return setError('Enter a valid email address.');
    if (!mobile.trim() || mobile.length < 7) return setError('Enter a valid mobile number.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPwd) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email.toLowerCase().trim(), mobile, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.detail || 'Registration failed.');
      setPendingEmail(email.toLowerCase().trim());
      setOtpPreview(data.otp_preview || '');
      setMode('verify');
      setNotice('OTP sent to your email!');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    clearError();
    if (otp.length !== 6) return setError('Please enter the 6-digit OTP.');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.detail || 'Verification failed.');
      localStorage.setItem('fitai_token', data.token);
      localStorage.setItem('fitai_user', JSON.stringify(data.user));
      onAuth(data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    clearError();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.detail || 'Failed to resend.');
      setOtpPreview(data.otp_preview || '');
      setNotice('New OTP sent!');
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setLoading(true);
    try {
      const { idToken, email, firstName, lastName, photoUrl } = await signInWithGoogle();
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken, email, first_name: firstName, last_name: lastName, photo_url: photoUrl }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.detail || 'Google sign-in failed.');
      localStorage.setItem('fitai_token', data.token);
      localStorage.setItem('fitai_user', JSON.stringify(data.user));
      onAuth(data.user);
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    clearError();
    if (!loginEmail.trim()) return setError('Enter your email address.');
    if (!loginPassword) return setError('Enter your password.');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.toLowerCase().trim(), password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setPendingEmail(loginEmail.toLowerCase().trim());
          setMode('verify');
          return setNotice('Please verify your email first.');
        }
        return setError(data.detail || 'Login failed.');
      }
      localStorage.setItem('fitai_token', data.token);
      localStorage.setItem('fitai_user', JSON.stringify(data.user));
      onAuth(data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const btnStyle = (disabled) => ({
    width: '100%',
    padding: '15px',
    borderRadius: 14,
    border: 'none',
    background: disabled ? '#CBD5E1' : `linear-gradient(135deg, ${PRIMARY}, ${PURPLE})`,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 6px 20px rgba(37,99,235,0.3)',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #EFF6FF 0%, #F5F3FF 50%, #E0F2FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 70, height: 70, borderRadius: 20, background: `linear-gradient(135deg, ${PRIMARY}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px', boxShadow: '0 12px 32px rgba(37,99,235,0.25)' }}>🏋️</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>FitAI Trainer</div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Your universal AI fitness companion</div>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '32px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #E8F0FE' }}>

          {/* Mode: OTP Verification */}
          {mode === 'verify' && (
            <>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>Verify your email</div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                We sent a 6-digit code to <strong>{pendingEmail}</strong>
              </div>
              {otpPreview && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#15803D' }}>
                  Demo OTP: <strong>{otpPreview}</strong> (remove in production)
                </div>
              )}
              {notice && <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#1D4ED8' }}>{notice}</div>}
              {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: ERROR }}>{error}</div>}

              <OtpBox otp={otp} setOtp={setOtp} />

              <button onClick={handleVerify} disabled={loading || otp.length !== 6} style={btnStyle(loading || otp.length !== 6)}>
                {loading ? 'Verifying…' : 'Verify & Continue'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748B' }}>
                Didn't get the code?{' '}
                <button onClick={handleResend} disabled={loading} style={{ background: 'none', border: 'none', color: PRIMARY, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Resend OTP</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <button onClick={() => { setMode('signup'); setError(''); setNotice(''); setOtp(''); }} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 12 }}>← Back to Sign Up</button>
              </div>
            </>
          )}

          {/* Mode: Login */}
          {mode === 'login' && (
            <>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 24 }}>Welcome back 👋</div>
              {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: ERROR }}>{error}</div>}

              <InputField label="Email address" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="you@gmail.com" autoComplete="email" />
              <InputField label="Password" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="Your password" autoComplete="current-password" />

              <button onClick={handleLogin} disabled={loading} style={{ ...btnStyle(loading), marginTop: 8 }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              {/* Google sign in */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
              </div>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{ width: '100%', padding: '13px', borderRadius: 14, border: '1.5px solid #E2E8F0', background: '#FAFAFA', color: '#374151', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.4 5.5-5.1 7.2v6h8.3c4.8-4.4 7.6-10.9 7.6-17.3z"/><path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-8.3-6c-2.2 1.5-5 2.4-7.7 2.4-5.9 0-10.9-4-12.7-9.3H2.7v6.2C6.7 42.9 14.9 48 24 48z"/><path fill="#FBBC04" d="M11.3 29.3c-.5-1.5-.7-3-.7-4.6s.2-3.1.7-4.6v-6.2H2.7C1 17.1 0 20.4 0 24s1 6.9 2.7 9.5l8.6-4.2z"/><path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.1 8.6 3.3l6.4-6.4C35 2.1 29.5 0 24 0 14.9 0 6.7 5.1 2.7 12.9l8.6 6.2C13.1 13.4 18.1 9.5 24 9.5z"/></svg>
                Continue with Google
              </button>

              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748B' }}>
                Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); }} style={{ background: 'none', border: 'none', color: PRIMARY, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Sign Up</button>
              </div>
            </>
          )}

          {/* Mode: Sign Up */}
          {mode === 'signup' && (
            <>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 24 }}>Create your account</div>
              {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: ERROR }}>{error}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John"
                    style={inputStyle(false)} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe"
                    style={inputStyle(false)} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }} />
              <InputField label="Email address (Gmail)" type="email" value={email} onChange={setEmail} placeholder="you@gmail.com" autoComplete="email" />
              <InputField label="Mobile Number" type="tel" value={mobile} onChange={setMobile} placeholder="+1 234 567 8900" maxLength={15} />
              <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" autoComplete="new-password" />
              <InputField label="Confirm Password" type="password" value={confirmPwd} onChange={setConfirmPwd} placeholder="Repeat password" autoComplete="new-password" />

              <button onClick={handleSignup} disabled={loading} style={{ ...btnStyle(loading), marginTop: 8 }}>
                {loading ? 'Creating account…' : 'Create Account & Get OTP'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748B' }}>
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: PRIMARY, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Sign In</button>
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#94A3B8' }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}
