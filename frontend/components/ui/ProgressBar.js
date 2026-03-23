'use client';
import { useEffect, useState } from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'var(--primary)',
  height = 8,
  showLabel = false,
  label = '',
  animate = true,
  rounded = true,
  style = {},
}) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(pct), 100);
      return () => clearTimeout(t);
    } else {
      setWidth(pct);
    }
  }, [pct, animate]);

  return (
    <div style={style}>
      {(showLabel || label) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            {label}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color }}>
            {Math.round(pct)}%
          </span>
        </div>
      )}
      <div style={{
        height, background: 'var(--border)', borderRadius: rounded ? '99px' : '2px',
        overflow: 'hidden', width: '100%',
      }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: color,
          borderRadius: rounded ? '99px' : '2px',
          transition: animate ? 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          backgroundImage: `linear-gradient(90deg, ${color}, ${color}dd)`,
        }} />
      </div>
    </div>
  );
}
