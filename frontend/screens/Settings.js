'use client';
import { useState } from 'react';
import Button from '../components/ui/Button';

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

function SettingRow({ icon, label, sub, children, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px',
      borderBottom: '1px solid var(--border-light)',
    }}>
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
    </div>
  );
}

function SettingSection({ title, children }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-xl)', marginBottom: '16px',
      border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px 10px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [voice, setVoice] = useState(true);
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [healthSync, setHealthSync] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [restTime, setRestTime] = useState(60);
  const [unit, setUnit] = useState('metric');
  const [profile, setProfile] = useState({ name: 'User', age: '', weight: '', height: '' });
  const [saved, setSaved] = useState(false);

  const saveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '720px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          Preferences
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Settings
        </h1>
      </div>

      {/* Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1E40AF, #2563EB)', borderRadius: 'var(--radius-xl)',
        padding: '24px', marginBottom: '20px', boxShadow: '0 12px 40px rgba(37,99,235,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
            border: '2px solid rgba(255,255,255,0.3)',
          }}>👤</div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{profile.name}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Free Plan · Edit Profile</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {[
            { k: 'name', label: 'Name', placeholder: 'Your name' },
            { k: 'age', label: 'Age', placeholder: 'e.g. 25' },
            { k: 'weight', label: 'Weight (kg)', placeholder: 'e.g. 70' },
            { k: 'height', label: 'Height (cm)', placeholder: 'e.g. 175' },
          ].map(f => (
            <div key={f.k}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {f.label}
              </label>
              <input
                value={profile[f.k]}
                onChange={e => setProfile(p => ({ ...p, [f.k]: e.target.value }))}
                placeholder={f.placeholder}
                style={{
                  width: '100%', padding: '9px 12px', border: 'none',
                  borderRadius: 'var(--radius-sm)', fontSize: '14px',
                  background: 'rgba(255,255,255,0.15)', color: '#fff',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </div>
          ))}
        </div>
        <Button variant="white" size="sm" onClick={saveProfile}>
          {saved ? '✅ Saved!' : 'Save Profile'}
        </Button>
      </div>

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
            Upgrade to Premium
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            Unlock AI pose detection, custom plans & more
          </div>
        </div>
        <Button variant="white" size="sm">Upgrade →</Button>
      </div>

      {/* Workout */}
      <SettingSection title="Workout">
        <SettingRow icon="🔕" label="Rest Time" sub="Seconds between sets">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setRestTime(t => Math.max(10, t - 10))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: 'var(--text-secondary)' }}>−</button>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', minWidth: '36px', textAlign: 'center' }}>{restTime}s</span>
            <button onClick={() => setRestTime(t => Math.min(300, t + 10))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: 'var(--text-secondary)' }}>+</button>
          </div>
        </SettingRow>
        <SettingRow icon="📏" label="Units" sub="Metric or Imperial">
          <select value={unit} onChange={e => setUnit(e.target.value)} style={{
            padding: '7px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
            fontSize: '13px', fontWeight: 600, color: 'var(--text)', background: 'var(--surface-2)', cursor: 'pointer',
          }}>
            <option value="metric">Metric (kg/cm)</option>
            <option value="imperial">Imperial (lb/in)</option>
          </select>
        </SettingRow>
        <div style={{ borderBottom: 'none' }}>
          <SettingRow icon="🎯" label="Difficulty" sub="Auto-adjust based on performance">
            <ToggleSwitch value={true} onChange={() => {}} />
          </SettingRow>
        </div>
      </SettingSection>

      {/* Audio */}
      <SettingSection title="Audio & Voice">
        <SettingRow icon="🔊" label="Sound Effects" sub="Exercise cues and transitions">
          <ToggleSwitch value={sound} onChange={setSound} />
        </SettingRow>
        <SettingRow icon="🎙️" label="Voice Coach" sub="Audio guidance during workouts">
          <ToggleSwitch value={voice} onChange={setVoice} />
        </SettingRow>
        <div style={{ borderBottom: 'none' }}>
          <SettingRow icon="🔔" label="Notifications" sub="Workout reminders & streaks">
            <ToggleSwitch value={notifications} onChange={setNotifications} />
          </SettingRow>
        </div>
      </SettingSection>

      {/* App */}
      <SettingSection title="App">
        <SettingRow icon="🌐" label="Language" sub="Display language">
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
        <SettingRow icon="🌙" label="Dark Mode" sub="Enable dark theme">
          <ToggleSwitch value={darkMode} onChange={setDarkMode} />
        </SettingRow>
        <div style={{ borderBottom: 'none' }}>
          <SettingRow icon="❤️" label="Health Sync" sub="Sync with Apple Health / Google Fit">
            <ToggleSwitch value={healthSync} onChange={setHealthSync} />
          </SettingRow>
        </div>
      </SettingSection>

      {/* Data */}
      <SettingSection title="Data">
        <SettingRow icon="☁️" label="Backup & Restore" sub="Cloud sync your progress">
          <button style={{ padding: '7px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            Backup
          </button>
        </SettingRow>
        <div style={{ borderBottom: 'none' }}>
          <SettingRow icon="🗑️" label="Clear Data" sub="Delete all workout history" danger>
            <button style={{ padding: '7px 14px', border: '1.5px solid var(--danger)', borderRadius: 'var(--radius-sm)', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Clear
            </button>
          </SettingRow>
        </div>
      </SettingSection>

      {/* App Info */}
      <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: '12px' }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>FitAI — Universal AI Fitness Trainer</div>
        <div>Version 1.0.0 · Made with ❤️</div>
      </div>
    </div>
  );
}
