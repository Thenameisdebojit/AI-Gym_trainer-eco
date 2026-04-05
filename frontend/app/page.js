'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Training from '../screens/Training';
import Discover from '../screens/Discover';
import Report from '../screens/Report';
import Settings from '../screens/Settings';
import Auth from '../screens/Auth';
import { AppSettingsProvider, useAppSettings } from '../context/AppSettingsContext';

const NAV_IDS = [
  { id: 'training', icon: '🏋️', tKey: 'training', subKey: 'trainingSub' },
  { id: 'discover', icon: '🔍', tKey: 'discover', subKey: 'discoverSub' },
  { id: 'report', icon: '📊', tKey: 'report', subKey: 'reportSub' },
  { id: 'settings', icon: '⚙️', tKey: 'settings', subKey: 'settingsSub' },
];

const SCREEN_MAP = {
  training: Training,
  discover: Discover,
  report: Report,
  settings: Settings,
};

const QUICK_PROMPTS_EN = [
  'Build muscle faster?',
  'Best fat loss exercises?',
  'How many rest days?',
  'Pre-workout nutrition?',
  'Improve flexibility?',
  'Weekly training plan',
];

function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI Fitness Coach 💪 Ask me anything about workouts, nutrition, or recovery!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || "Happy to help! Could you rephrase that?" }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Couldn't connect right now. Please try again!" }]);
    }
    setLoading(false);
  }, [input]);

  return (
    <>
      {open && (
        <div className="fab-popup" style={{ position: 'fixed', bottom: 90, right: 24, width: 340, background: 'var(--surface)', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', border: '1px solid var(--border)', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.2s ease' }}>
          <div style={{ background: 'linear-gradient(135deg,#1E40AF,#7C3AED)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>AI Fitness Coach</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 4px #10B981' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: '50%', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          <div style={{ height: 320, overflowY: 'auto', padding: '16px 16px 8px' }} className="hide-scroll">
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12, animation: 'fadeIn 0.25s ease' }}>
                {m.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, marginRight: 8, alignSelf: 'flex-end' }}>🤖</div>
                )}
                <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px', background: m.role === 'user' ? 'linear-gradient(135deg,#2563EB,#7C3AED)' : 'var(--surface-2)', color: m.role === 'user' ? '#fff' : 'var(--text)', fontSize: 13, lineHeight: 1.55, border: m.role === 'user' ? 'none' : '1px solid var(--border-light)', boxShadow: m.role === 'user' ? '0 4px 12px rgba(37,99,235,0.25)' : 'var(--shadow-sm)' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🤖</div>
                <div style={{ background: 'var(--surface-2)', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', border: '1px solid var(--border-light)', display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-tertiary)', animation: `pulse 1s ${i * 0.2}s ease infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }} className="hide-scroll">
              {QUICK_PROMPTS_EN.map((q, i) => (
                <button key={i} onClick={() => send(q)} style={{ padding: '5px 12px', border: '1.5px solid var(--border)', borderRadius: 99, background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.12s ease', outline: 'none' }}
                  onMouseEnter={e => { e.target.style.borderColor = '#7C3AED'; e.target.style.color = '#7C3AED'; }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '10px 12px 14px', display: 'flex', gap: 8 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Ask anything…"
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 13, color: 'var(--text)', background: 'var(--surface-2)', outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#7C3AED'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: 12, background: loading || !input.trim() ? 'var(--border)' : 'linear-gradient(135deg,#2563EB,#7C3AED)', border: 'none', color: '#fff', fontSize: 16, cursor: loading || !input.trim() ? 'default' : 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}>
              ▶
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="fab-btn"
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%',
          background: open ? '#0F172A' : 'linear-gradient(135deg,#2563EB,#7C3AED)',
          border: 'none', cursor: 'pointer', zIndex: 1001,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          boxShadow: open ? '0 8px 24px rgba(0,0,0,0.25)' : '0 8px 28px rgba(37,99,235,0.45)',
          transition: 'all 0.2s ease',
        }}
        title="AI Coach"
      >
        {open ? '✕' : '🤖'}
        {!open && pulse && (
          <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid rgba(37,99,235,0.5)', animation: 'ping 1.2s ease infinite' }} />
        )}
      </button>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.5); opacity: 0; } }
        @media (max-width: 640px) {
          .fab-btn { bottom: 80px !important; }
          .fab-popup { bottom: 148px !important; }
        }
      `}</style>
    </>
  );
}

function AppInner() {
  const { t } = useAppSettings();
  const [active, setActive] = useState('training');
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const NAV_ITEMS = NAV_IDS.map(n => ({ ...n, label: t[n.tKey] || n.tKey }));

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fitai_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setAuthChecked(true);
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem('fitai_token');
    if (token) fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('fitai_token');
    localStorage.removeItem('fitai_user');
    setUser(null);
  };

  if (!authChecked) return null;
  if (!user) return <Auth onAuth={(u) => setUser(u)} />;

  const Screen = SCREEN_MAP[active];
  const activeItem = NAV_ITEMS.find(n => n.id === active);
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || '?';

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      <aside style={{
        width: collapsed ? '72px' : '224px',
        minWidth: collapsed ? '72px' : '224px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        boxShadow: 'var(--shadow-sm)', zIndex: 10,
        overflow: 'hidden',
      }}>

        <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: collapsed ? '0' : '0 20px', justifyContent: collapsed ? 'center' : 'flex-start', gap: '12px', borderBottom: '1px solid var(--border-light)', flexShrink: 0 }}>
          <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: 'var(--radius)', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(37,99,235,0.35)' }}>⚡</div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>FitAI</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 500, whiteSpace: 'nowrap' }}>AI Fitness Platform</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }} className="hide-scroll">
          {NAV_ITEMS.map(item => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} title={collapsed ? item.label : ''}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', background: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 500, fontSize: '14px', transition: 'all 0.15s ease', position: 'relative', width: '100%', textAlign: 'left', whiteSpace: 'nowrap', outline: 'none' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {isActive && <div style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: '3px', borderRadius: '0 3px 3px 0', background: 'var(--primary)' }} />}
                <span style={{ fontSize: '19px', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div style={{ margin: '0 8px 12px', padding: '12px 14px', background: 'linear-gradient(135deg,#1E40AF15,#7C3AED15)', borderRadius: 12, border: '1px solid #7C3AED20' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>🤖</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>AI Coach</span>
              <span style={{ fontSize: '9px', fontWeight: 800, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', padding: '2px 6px', borderRadius: 99 }}>AI</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Click the 🤖 button anywhere to chat</div>
          </div>
        )}

        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border-light)', flexShrink: 0 }}>
          <button onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ width: '100%', height: '36px', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease', outline: 'none', fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >{collapsed ? '▶' : '◀'}</button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <header style={{ height: '64px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px', lineHeight: 1 }}>{activeItem?.icon}</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{activeItem?.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>{t[activeItem?.subKey] || ''}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--primary-50)', borderRadius: '99px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 0 2px rgba(16,185,129,0.25)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>Live AI</span>
            </div>
            {!collapsed && user && <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{user.first_name}</span>}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button onClick={handleLogout} title="Sign out"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', cursor: 'pointer', border: 'none', boxShadow: '0 2px 8px rgba(37,99,235,0.25)', letterSpacing: '-0.02em' }}>
                {initials}
              </button>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="hide-scroll">
          <Screen key={active} />
        </div>
      </div>

      <div id="fitai-mobile-nav" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '6px 0 max(6px,env(safe-area-inset-bottom))', boxShadow: '0 -4px 20px rgba(0,0,0,0.07)', zIndex: 100 }}>
        <div style={{ display: 'flex' }}>
          {NAV_ITEMS.map(item => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '5px 0', border: 'none', background: 'transparent', cursor: 'pointer', outline: 'none', color: isActive ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                <span style={{ fontSize: '21px', lineHeight: 1 }}>{item.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500, lineHeight: 1 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <FloatingChatbot />

      <style>{`
        @media (max-width: 640px) {
          aside { display: none !important; }
          #fitai-mobile-nav { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AppSettingsProvider>
      <AppInner />
    </AppSettingsProvider>
  );
}
