'use client';
import { useState } from 'react';

const SIZES = {
  xs: { padding: '6px 12px', fontSize: '12px', height: '30px' },
  sm: { padding: '8px 16px', fontSize: '13px', height: '36px' },
  md: { padding: '11px 22px', fontSize: '14px', height: '44px' },
  lg: { padding: '14px 28px', fontSize: '16px', height: '52px' },
  xl: { padding: '18px 36px', fontSize: '18px', height: '60px' },
};

const VARIANTS = {
  primary: { background: 'var(--primary)', color: '#ffffff', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' },
  secondary: { background: 'var(--primary-50)', color: 'var(--primary)', boxShadow: 'none' },
  outline: { background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--primary)', boxShadow: 'none' },
  ghost: { background: 'transparent', color: 'var(--text-secondary)', boxShadow: 'none' },
  danger: { background: 'var(--danger)', color: '#ffffff', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' },
  success: { background: 'var(--success)', color: '#ffffff', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' },
  white: { background: '#ffffff', color: 'var(--primary)', boxShadow: 'var(--shadow)' },
  dark: { background: 'var(--text)', color: '#ffffff', boxShadow: 'var(--shadow-md)' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  style = {},
  className = '',
}) {
  const [pressed, setPressed] = useState(false);

  const computedStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font)',
    fontWeight: 600,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--radius)',
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    outline: 'none',
    transform: pressed && !disabled && !loading ? 'scale(0.97)' : 'scale(1)',
    ...SIZES[size],
    ...VARIANTS[variant],
    ...style,
  };

  return (
    <button
      suppressHydrationWarning
      onClick={!disabled && !loading ? onClick : undefined}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={computedStyle}
      disabled={disabled || loading}
      className={`fitai-btn${className ? ` ${className}` : ''}`}
    >
      {loading ? (
        <span style={{
          width: '16px', height: '16px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          display: 'inline-block',
          flexShrink: 0,
        }} />
      ) : icon ? (
        <span style={{ fontSize: size === 'lg' || size === 'xl' ? '18px' : '16px', flexShrink: 0 }}>{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span style={{ fontSize: size === 'lg' || size === 'xl' ? '18px' : '16px', flexShrink: 0 }}>{iconRight}</span>
      )}
    </button>
  );
}
