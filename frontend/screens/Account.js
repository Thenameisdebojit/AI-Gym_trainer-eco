'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppSettings } from '../context/AppSettingsContext';

const PRESET_AVATARS = ['🏋️', '🤸', '🧘', '🏃', '⚡', '🦁', '🐉', '🌟', '🔥', '💪', '🥊', '🎯'];

const GOAL_OPTIONS = [
  { value: 'general', label: 'General Fitness' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'fat_loss', label: 'Fat Loss' },
  { value: 'flexibility', label: 'Flexibility & Mobility' },
  { value: 'mma', label: 'Martial Arts / MMA' },
];

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

function Toast({ visible, message }) {
  return (
    <div style={{
      position: 'fixed', bottom: '32px', left: '50%', transform: `translateX(-50%) translateY(${visible ? '0' : '24px'})`,
      background: '#10B981', color: '#fff', padding: '12px 24px', borderRadius: '99px',
      fontSize: '14px', fontWeight: 700, boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
      pointerEvents: 'none', zIndex: 9999,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      <span style={{ fontSize: '16px' }}>✓</span>
      {message}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)',
          background: 'var(--surface-2)', outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)',
          background: 'var(--surface-2)', outline: 'none', boxSizing: 'border-box',
          cursor: 'pointer',
        }}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function Account({ onBack, onProfileUpdated }) {
  const { t } = useAppSettings();
  const [avatar, setAvatar] = useState('🏋️');
  const [avatarImg, setAvatarImg] = useState(null);
  const [profile, setProfile] = useState({
    name: '', age: '', weight: '', height: '', goal: '', level: '',
  });
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('fitai_user') || '{}');
      const storedAvatar = localStorage.getItem('fitai_avatar') || '';
      const storedEmoji = localStorage.getItem('fitai_avatar_emoji') || '🏋️';

      const name = stored.name ||
        `${stored.first_name || ''} ${stored.last_name || ''}`.trim() || '';

      setProfile({
        name,
        age: stored.age || '',
        weight: stored.weight || '',
        height: stored.height || '',
        goal: stored.goal || '',
        level: stored.level || '',
      });
      if (storedAvatar) {
        setAvatarImg(storedAvatar);
      } else {
        setAvatar(storedEmoji);
      }
    } catch {}
  }, []);

  const showToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2500);
  }, []);

  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarImg(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('fitai_user') || '{}');
      const nameParts = profile.name.trim().split(' ');
      const updated = {
        ...existing,
        name: profile.name,
        first_name: nameParts[0] || existing.first_name || '',
        last_name: nameParts.slice(1).join(' ') || existing.last_name || '',
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        goal: profile.goal,
        level: profile.level,
      };
      localStorage.setItem('fitai_user', JSON.stringify(updated));
      if (avatarImg) {
        localStorage.setItem('fitai_avatar', avatarImg);
        localStorage.removeItem('fitai_avatar_emoji');
      } else {
        localStorage.setItem('fitai_avatar_emoji', avatar);
        localStorage.removeItem('fitai_avatar');
      }
      onProfileUpdated?.();
    } catch {}
    showToast();
  };

  const displayAvatar = avatarImg ? (
    <img src={avatarImg} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
  ) : (
    <span style={{ fontSize: '52px', lineHeight: 1 }}>{avatar}</span>
  );

  return (
    <div style={{ padding: '24px 28px', maxWidth: '560px', animation: 'fadeIn 0.35s ease' }}>
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, marginBottom: '20px', padding: 0 }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>Your profile</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Account</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '128px', height: '128px', borderRadius: '50%',
          background: 'var(--surface-2)', border: '3px solid var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', marginBottom: '16px',
          boxShadow: '0 8px 24px rgba(37,99,235,0.2)',
        }}>
          {displayAvatar}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: '20px' }}>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ padding: '8px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            📷 Upload Photo
          </button>
          {avatarImg && (
            <button
              onClick={() => setAvatarImg(null)}
              style={{ padding: '8px 14px', border: '1.5px solid var(--danger)', borderRadius: 'var(--radius-sm)', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Remove
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />

        {!avatarImg && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', textAlign: 'center' }}>
              Or choose an avatar
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: '320px' }}>
              {PRESET_AVATARS.map(em => (
                <button
                  key={em}
                  onClick={() => setAvatar(em)}
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%', border: '2px solid',
                    borderColor: avatar === em ? 'var(--primary)' : 'var(--border)',
                    background: avatar === em ? 'var(--primary-50)' : 'var(--surface-2)',
                    fontSize: '24px', cursor: 'pointer', transition: 'all 0.15s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <InputField label="Full Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="e.g. Alex Johnson" />
          </div>
          <InputField label="Age" value={profile.age} onChange={v => setProfile(p => ({ ...p, age: v }))} placeholder="e.g. 28" type="number" />
          <InputField label="Weight (kg)" value={profile.weight} onChange={v => setProfile(p => ({ ...p, weight: v }))} placeholder="e.g. 75" type="number" />
          <div style={{ gridColumn: '1 / -1' }}>
            <InputField label="Height (cm)" value={profile.height} onChange={v => setProfile(p => ({ ...p, height: v }))} placeholder="e.g. 175" type="number" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <SelectField label="Fitness Goal" value={profile.goal} onChange={v => setProfile(p => ({ ...p, goal: v }))} options={GOAL_OPTIONS} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <SelectField label="Fitness Level" value={profile.level} onChange={v => setProfile(p => ({ ...p, level: v }))} options={LEVEL_OPTIONS} />
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: '14px', border: 'none', borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
            color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Save Profile
        </button>
      </div>

      <Toast visible={toastVisible} message="Profile saved!" />

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
