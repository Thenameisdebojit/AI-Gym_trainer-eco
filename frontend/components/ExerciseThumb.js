'use client';
import { useState, useEffect, useRef } from 'react';

const THUMB_CSS_ID = 'exercise-thumb-css';
const THUMB_CSS = `
@keyframes et-flip {
  0%, 45%   { opacity: 1; }
  50%, 95%  { opacity: 0; }
  100%      { opacity: 1; }
}
@keyframes et-flip2 {
  0%, 45%   { opacity: 0; }
  50%, 95%  { opacity: 1; }
  100%      { opacity: 0; }
}
.et-img0 { animation: et-flip 2.2s ease-in-out infinite; }
.et-img1 { animation: et-flip2 2.2s ease-in-out infinite; position: absolute; inset: 0; }
.et-img0.et-paused, .et-img1.et-paused { animation-play-state: paused; }
`;

function injectCss() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(THUMB_CSS_ID)) return;
  const s = document.createElement('style');
  s.id = THUMB_CSS_ID;
  s.textContent = THUMB_CSS;
  document.head.appendChild(s);
}

export default function ExerciseThumb({
  img0,
  img1,
  name = '',
  size = 64,
  width: widthProp,
  height: heightProp,
  radius = 10,
  number = null,
  paused = false,
  bg = 'var(--surface-2, #1E293B)',
  fallbackColor = '#2563EB',
}) {
  useEffect(() => { injectCss(); }, []);

  const [img0Ok, setImg0Ok] = useState(true);
  const [img1Ok, setImg1Ok] = useState(true);
  const hasImages = img0 && img1 && img0Ok && img1Ok;

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] || '')
    .join('')
    .toUpperCase();

  const w = widthProp ?? size;
  const h = heightProp ?? size;

  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: radius,
        overflow: 'hidden',
        flexShrink: 0,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hasImages ? (
        <>
          <img
            src={img0}
            alt={name}
            className={`et-img0${paused ? ' et-paused' : ''}`}
            onError={() => setImg0Ok(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <img
            src={img1}
            alt=""
            className={`et-img1${paused ? ' et-paused' : ''}`}
            onError={() => setImg1Ok(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </>
      ) : (
        <span style={{ fontSize: size * 0.3, fontWeight: 800, color: fallbackColor }}>
          {initials || '?'}
        </span>
      )}
      {number !== null && (
        <div
          style={{
            position: 'absolute',
            bottom: 3,
            right: 3,
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            fontSize: Math.max(9, size * 0.16),
            fontWeight: 800,
            width: Math.max(16, size * 0.32),
            height: Math.max(16, size * 0.32),
            borderRadius: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {number}
        </div>
      )}
    </div>
  );
}
