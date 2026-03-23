'use client';
import { useState } from 'react';
import Training from '../screens/Training';
import Discover from '../screens/Discover';
import Report from '../screens/Report';
import AICoach from '../screens/AICoach';
import Settings from '../screens/Settings';

const NAV_ITEMS = [
  { id: 'training', label: 'Training', icon: '🏋️' },
  { id: 'discover', label: 'Discover', icon: '🔍' },
  { id: 'report', label: 'Report', icon: '📊' },
  { id: 'coach', label: 'AI Coach', icon: '🤖' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const SCREEN_MAP = {
  training: Training,
  discover: Discover,
  report: Report,
  coach: AICoach,
  settings: Settings,
};

const SUB_TITLES = {
  training: 'Your personalized training hub',
  discover: 'Explore workouts and exercises',
  report: 'Track your fitness progress',
  coach: 'AI-powered fitness coaching',
  settings: 'App preferences and profile',
};

export default function App() {
  const [active, setActive] = useState('training');
  const [collapsed, setCollapsed] = useState(false);
  const Screen = SCREEN_MAP[active];
  const activeItem = NAV_ITEMS.find(n => n.id === active);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* ─── Sidebar ─── */}
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

        {/* Logo */}
        <div style={{
          height: '64px', display: 'flex', alignItems: 'center',
          padding: collapsed ? '0' : '0 20px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '12px', borderBottom: '1px solid var(--border-light)', flexShrink: 0,
        }}>
          <div style={{
            width: '38px', height: '38px', minWidth: '38px', borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
          }}>⚡</div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
                FitAI
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                AI Fitness Platform
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }} className="hide-scroll">
          {NAV_ITEMS.map(item => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                title={collapsed ? item.label : ''}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: '10px', padding: '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
                  background: isActive ? 'var(--primary-50)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500, fontSize: '14px',
                  transition: 'all 0.15s ease', position: 'relative',
                  width: '100%', textAlign: 'left', whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '18%', bottom: '18%',
                    width: '3px', borderRadius: '0 3px 3px 0', background: 'var(--primary)',
                  }} />
                )}
                <span style={{ fontSize: '19px', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                {!collapsed && item.id === 'coach' && (
                  <span style={{
                    fontSize: '9px', fontWeight: 800, letterSpacing: '0.03em',
                    background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                    color: '#fff', padding: '2px 7px', borderRadius: '99px', flexShrink: 0,
                  }}>AI</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid var(--border-light)', flexShrink: 0 }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: '100%', height: '36px', borderRadius: 'var(--radius)',
              border: '1.5px solid var(--border)', background: 'transparent',
              color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease', outline: 'none', fontWeight: 600,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          height: '64px', background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px', lineHeight: 1 }}>{activeItem?.icon}</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>
                {activeItem?.label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                {SUB_TITLES[active]}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Live indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', background: 'var(--primary-50)',
              borderRadius: '99px', cursor: 'default',
            }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: 'var(--success)', display: 'inline-block',
                boxShadow: '0 0 0 2px rgba(16,185,129,0.25)',
              }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.01em' }}>
                Live AI
              </span>
            </div>
            {/* Avatar */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
            }}>👤</div>
          </div>
        </header>

        {/* Screen content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="hide-scroll">
          <Screen key={active} />
        </div>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <div id="fitai-mobile-nav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        padding: '6px 0 max(6px, env(safe-area-inset-bottom))',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.07)', zIndex: 100,
      }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '3px', padding: '5px 0', border: 'none', background: 'transparent',
                cursor: 'pointer', outline: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
              }}
            >
              <span style={{ fontSize: '21px', lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500, lineHeight: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          aside { display: none !important; }
          #fitai-mobile-nav { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
