'use client';
import { useState, useEffect } from 'react';

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
@keyframes et-skeleton {
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
}
.et-img0 { animation: et-flip 1.2s ease-in-out infinite; }
.et-img1 { animation: et-flip2 1.2s ease-in-out infinite; position: absolute; inset: 0; }
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
  fallback = null,
}) {
  useEffect(() => { injectCss(); }, []);

  const [img0Ok, setImg0Ok]     = useState(true);
  const [img1Ok, setImg1Ok]     = useState(true);
  const [img0Loaded, setImg0Loaded] = useState(false);
  const [img1Loaded, setImg1Loaded] = useState(false);

  const hasImages = img0 && img1 && img0Ok && img1Ok;
  const imagesReady = hasImages && img0Loaded && img1Loaded;
  const showSkeleton = hasImages && !imagesReady;
  const showFallback = !hasImages;

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
      {/* Skeleton shimmer while loading */}
      {showSkeleton && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 75%)',
          backgroundSize: '200% 100%',
          animation: 'et-skeleton 1.4s ease-in-out infinite',
        }} />
      )}

      {/* Real images (hidden until both loaded) */}
      {hasImages && (
        <>
          <img
            src={img0}
            alt={name}
            loading="lazy"
            className={`et-img0${paused ? ' et-paused' : ''}`}
            onLoad={() => setImg0Loaded(true)}
            onError={() => setImg0Ok(false)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: imagesReady ? undefined : 0,
              transition: 'opacity 0.3s',
            }}
          />
          <img
            src={img1}
            alt=""
            loading="lazy"
            className={`et-img1${paused ? ' et-paused' : ''}`}
            onLoad={() => setImg1Loaded(true)}
            onError={() => setImg1Ok(false)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: imagesReady ? undefined : 0,
              transition: 'opacity 0.3s',
            }}
          />
        </>
      )}

      {/* Fallback: custom node > initials */}
      {showFallback && (
        fallback
          ? <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fallback}</div>
          : <span style={{ fontSize: size * 0.3, fontWeight: 800, color: fallbackColor, userSelect: 'none' }}>
              {initials || '?'}
            </span>
      )}

      {/* Number badge overlay */}
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
