'use client';
import { useState } from 'react';

const VARIANTS = {
  blue: { bg: 'var(--primary)', text: '#fff', icon_bg: 'rgba(255,255,255,0.2)', sub: 'rgba(255,255,255,0.8)' },
  green: { bg: 'var(--success)', text: '#fff', icon_bg: 'rgba(255,255,255,0.2)', sub: 'rgba(255,255,255,0.8)' },
  orange: { bg: 'var(--orange)', text: '#fff', icon_bg: 'rgba(255,255,255,0.2)', sub: 'rgba(255,255,255,0.8)' },
  purple: { bg: 'var(--purple)', text: '#fff', icon_bg: 'rgba(255,255,255,0.2)', sub: 'rgba(255,255,255,0.8)' },
  light: { bg: 'var(--surface)', text: 'var(--text)', icon_bg: 'var(--primary-50)', sub: 'var(--text-secondary)' },
  'light-green': { bg: 'var(--surface)', text: 'var(--text)', icon_bg: 'var(--success-light)', sub: 'var(--text-secondary)' },
  'light-orange': { bg: 'var(--surface)', text: 'var(--text)', icon_bg: 'var(--orange-light)', sub: 'var(--text-secondary)' },
  'light-purple': { bg: 'var(--surface)', text: 'var(--text)', icon_bg: 'var(--purple-light)', sub: 'var(--text-secondary)' },
};

export default function StatCard({ icon, label, value, sub, change, variant = 'light', style = {} }) {
  const [hovered, setHovered] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.light;
  const isLight = variant.startsWith('light');
  const isPositive = change > 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: v.bg, borderRadius: 'var(--radius-md)', padding: '20px',
        boxShadow: hovered
          ? (isLight ? 'var(--shadow-md)' : '0 12px 30px rgba(0,0,0,0.2)')
          : (isLight ? 'var(--shadow-sm)' : 'var(--shadow)'),
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        border: isLight ? '1px solid var(--border-light)' : 'none',
        flex: 1, minWidth: '140px',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: 'var(--radius)',
          background: v.icon_bg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '20px',
        }}>
          {icon}
        </div>
        {change !== undefined && (
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: isLight ? (isPositive ? 'var(--success)' : 'var(--danger)') : 'rgba(255,255,255,0.9)',
            background: isLight ? (isPositive ? 'var(--success-light)' : 'var(--danger-light)') : 'rgba(255,255,255,0.15)',
            padding: '3px 8px', borderRadius: '99px',
          }}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: v.text, lineHeight: 1, marginBottom: '6px' }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: v.sub }}>{label}</div>
      {sub && (
        <div style={{ fontSize: '12px', color: v.sub, marginTop: '4px', opacity: 0.8 }}>{sub}</div>
      )}
    </div>
  );
}
