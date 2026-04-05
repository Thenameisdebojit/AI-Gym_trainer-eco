'use client';
import { useState } from 'react';
import Button from '../components/ui/Button';
import { useAppSettings } from '../context/AppSettingsContext';

function ToggleSwitch({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: '44px', height: '24px', borderRadius: '99px', border: 'none',
        background: value ? 'var(--primary)' : 'var(--border)',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s ease',
        flexShrink: 0, padding: 0,
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        position: 'absolute', top: '3px',
        left: value ? '23px' : '3px',
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

function SettingRow({ icon, label, sub, children, danger, onClick, chevron }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px',
        borderBottom: '1px solid var(--border-light)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = 'var(--surface-2)'; }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{
        width: '38px', height: '38px', borderRadius: 'var(--radius)',
        background: danger ? 'var(--danger-light)' : 'var(--surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: danger ? 'var(--danger)' : 'var(--text)' }}>{label}</div>
        {sub && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>{sub}</div>}
      </div>
      {children}
      {chevron && <span style={{ color: 'var(--text-tertiary)', fontSize: '16px', flexShrink: 0 }}>›</span>}
    </div>
  );
}

function SettingSection({ title, children }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-xl)', marginBottom: '16px',
      border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
    }}>
      {title && (
        <div style={{ padding: '16px 20px 10px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export default function Settings({ onNavigate }) {
  const { darkMode, setDarkMode, language, setLanguage, notifications, setNotifications, healthSync, setHealthSync, voiceCoach, setVoiceCoach, t } = useAppSettings();

  const handleLogout = () => {
    try {
      const token = localStorage.getItem('fitai_token');
      if (token) fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      localStorage.removeItem('fitai_token');
      localStorage.removeItem('fitai_user');
    } catch {}
    window.location.reload();
  };

  const voice = voiceCoach;
  const setVoice = setVoiceCoach;
  const [sound, setSound] = useState(true);
  const [restTime, setRestTime] = useState(60);
  const [unit, setUnit] = useState('metric');
  const [healthMsg, setHealthMsg] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');

  const getUserDisplayName = () => {
    try {
      const u = JSON.parse(localStorage.getItem('fitai_user') || '{}');
      return u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'User';
    } catch { return 'User'; }
  };

  const getUserAvatar = () => {
    try {
      const img = localStorage.getItem('fitai_avatar');
      if (img) return null;
      return localStorage.getItem('fitai_avatar_emoji') || '🏋️';
    } catch { return '🏋️'; }
  };

  const getUserAvatarImg = () => {
    try { return localStorage.getItem('fitai_avatar') || null; } catch { return null; }
  };

  const handleHealthSync = (val) => {
    setHealthSync(val);
    setHealthMsg(val);
    if (!val) setHealthMsg(false);
  };

  const handleNotifications = async (val) => {
    await setNotifications(val);
    if (val) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'denied') {
          setNotifMsg('Notifications blocked by browser. Please allow them in your browser settings.');
        } else {
          setNotifMsg('');
        }
      }
    } else {
      setNotifMsg('');
    }
  };

  const avatarEmoji = getUserAvatar();
  const avatarImg = getUserAvatarImg();

  return (
    <div style={{ padding: '24px 28px', maxWidth: '720px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          {t.preferences}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          {t.settingsTitle}
        </h1>
      </div>

      {/* Account Row */}
      <SettingSection title="">
        <div style={{ borderBottom: 'none' }}>
          <div
            onClick={() => onNavigate?.('account')}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', border: '2px solid var(--border-light)',
            }}>
              {avatarImg
                ? <img src={avatarImg} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '22px' }}>{avatarEmoji}</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Account & Profile</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{getUserDisplayName()}</div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '20px' }}>›</span>
          </div>
        </div>
      </SettingSection>

      {/* Premium Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F59E0B, #F97316)',
        borderRadius: 'var(--radius-xl)', padding: '22px 24px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: '0 8px 24px rgba(249,115,22,0.25)', cursor: 'pointer',
      }}>
        <span style={{ fontSize: '40px' }}>👑</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', marginBottom: '3px' }}>
            {t.upgradePremium}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            {t.upgradeDesc}
          </div>
        </div>
        <Button variant="white" size="sm">{t.upgrade}</Button>
      </div>

      {/* Workout */}
      <SettingSection title={t.sectionWorkout}>
        <SettingRow icon="🔕" label={t.restTime} sub={t.restTimeSub}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setRestTime(v => Math.max(10, v - 10))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: 'var(--text-secondary)' }}>−</button>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', minWidth: '36px', textAlign: 'center' }}>{restTime}{t.sec}</span>
            <button onClick={() => setRestTime(v => Math.min(300, v + 10))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: 'var(--text-secondary)' }}>+</button>
          </div>
        </SettingRow>
        <SettingRow icon="📏" label={t.units} sub={t.unitsSub}>
          <select value={unit} onChange={e => setUnit(e.target.value)} style={{
            padding: '7px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
            fontSize: '13px', fontWeight: 600, color: 'var(--text)', background: 'var(--surface-2)', cursor: 'pointer',
          }}>
            <option value="metric">{t.unitsMetric}</option>
            <option value="imperial">{t.unitsImperial}</option>
          </select>
        </SettingRow>
        <div style={{ borderBottom: 'none' }}>
          <SettingRow icon="🎯" label={t.difficulty} sub={t.difficultySub}>
            <ToggleSwitch value={true} onChange={() => {}} />
          </SettingRow>
        </div>
      </SettingSection>

      {/* Audio */}
      <SettingSection title={t.sectionAudio}>
        <SettingRow icon="🔊" label={t.soundEffects} sub={t.soundEffectsSub}>
          <ToggleSwitch value={sound} onChange={setSound} />
        </SettingRow>
        <SettingRow icon="🎙️" label={t.voiceCoach} sub={t.voiceCoachSub}>
          <ToggleSwitch value={voice} onChange={setVoice} />
        </SettingRow>
        <div style={{ borderBottom: 'none' }}>
          <SettingRow icon="🔔" label={t.notifications} sub={t.notificationsSub}>
            <ToggleSwitch value={notifications} onChange={handleNotifications} />
          </SettingRow>
        </div>
        {notifMsg && (
          <div style={{ margin: '0 20px 14px', padding: '10px 14px', background: 'var(--warning-light)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--warning)', fontWeight: 500 }}>
            {notifMsg}
          </div>
        )}
      </SettingSection>

      {/* App */}
      <SettingSection title={t.sectionApp}>
        <SettingRow icon="🌐" label={t.language} sub={t.languageSub}>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{
            padding: '7px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
            fontSize: '13px', fontWeight: 600, color: 'var(--text)', background: 'var(--surface-2)', cursor: 'pointer',
          }}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="hi">हिंदी</option>
            <option value="pt">Português</option>
          </select>
        </SettingRow>
        <SettingRow icon="🌙" label={t.darkMode} sub={t.darkModeSub}>
          <ToggleSwitch value={darkMode} onChange={setDarkMode} />
        </SettingRow>
        <div style={{ borderBottom: healthMsg ? '1px solid var(--border-light)' : 'none' }}>
          <SettingRow icon="❤️" label={t.healthSync} sub={t.healthSyncSub}>
            <ToggleSwitch value={healthSync} onChange={handleHealthSync} />
          </SettingRow>
        </div>
        {healthMsg && (
          <div style={{ margin: '0 20px 14px', padding: '12px 14px', background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>📱</span>
            <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 500, lineHeight: 1.5 }}>
              <strong>{t.healthSyncMsg}</strong><br />
              {t.healthSyncMsgDesc}
            </div>
          </div>
        )}
      </SettingSection>

      {/* Data */}
      <SettingSection title={t.sectionData}>
        <SettingRow icon="☁️" label={t.backup} sub={t.backupSub}>
          <button style={{ padding: '7px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {t.backupBtn}
          </button>
        </SettingRow>
        <div style={{ borderBottom: 'none' }}>
          <SettingRow icon="🗑️" label={t.clearData} sub={t.clearDataSub} danger>
            <button style={{ padding: '7px 14px', border: '1.5px solid var(--danger)', borderRadius: 'var(--radius-sm)', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              {t.clearBtn}
            </button>
          </SettingRow>
        </div>
      </SettingSection>

      {/* Logout */}
      <SettingSection title="">
        <div style={{ borderBottom: 'none' }}>
          <SettingRow icon="🚪" label={t.logoutBtn} sub={t.logoutSub} danger>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                border: '1.5px solid var(--danger)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                fontSize: '13px', fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t.logoutBtn}
            </button>
          </SettingRow>
        </div>
      </SettingSection>

      <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '12px' }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>FitAI — Universal AI Fitness Trainer</div>
        <div>{t.appVersion}</div>
      </div>
    </div>
  );
}
