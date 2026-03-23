'use client';
import { useState } from 'react';
import Button from '../ui/Button';

export default function BannerCard({
  title, subtitle, description, badge, cta = 'Get Started',
  gradient = 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
  icon = '🔥', onAction, tall = false, style = {},
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: gradient, borderRadius: 'var(--radius-xl)', padding: tall ? '32px 28px' : '24px',
        boxShadow: hovered ? '0 16px 40px rgba(37,99,235,0.25)' : '0 8px 24px rgba(37,99,235,0.15)',
        transition: 'all 0.3s ease', transform: hovered ? 'translateY(-3px)' : 'none',
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        ...style,
      }}
      onClick={onAction}
    >
      <div style={{
        position: 'absolute', top: -30, right: -20, fontSize: '120px',
        opacity: 0.12, lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>
        {icon}
      </div>
      {badge && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          borderRadius: '99px', padding: '4px 12px', marginBottom: '12px',
          fontSize: '12px', fontWeight: 600, color: '#fff',
        }}>
          {badge}
        </div>
      )}
      <div style={{ fontSize: tall ? '28px' : '22px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '8px' }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '6px' }}>
          {subtitle}
        </div>
      )}
      {description && (
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: 1.5 }}>
          {description}
        </div>
      )}
      {cta && (
        <Button
          variant="white"
          size="sm"
          onClick={e => { e.stopPropagation(); onAction && onAction(); }}
          style={{ marginTop: description || subtitle ? '4px' : '16px' }}
        >
          {cta} →
        </Button>
      )}
    </div>
  );
}
