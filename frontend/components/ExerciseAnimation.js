'use client';
import { useEffect } from 'react';

const ANIM_CSS = `
@keyframes ea-jumpjack {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes ea-arm-out {
  0%, 100% { transform: rotate(30deg); }
  50% { transform: rotate(-60deg); }
}
@keyframes ea-arm-out-r {
  0%, 100% { transform: rotate(-30deg); }
  50% { transform: rotate(60deg); }
}
@keyframes ea-leg-out {
  0%, 100% { transform: rotate(10deg); }
  50% { transform: rotate(30deg); }
}
@keyframes ea-leg-out-r {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(-30deg); }
}
@keyframes ea-pushup-body {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(10px); }
}
@keyframes ea-squat-body {
  0%, 100% { transform: translateY(0px) scaleY(1); }
  50% { transform: translateY(18px) scaleY(0.87); }
}
@keyframes ea-squat-knee {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(28deg); }
}
@keyframes ea-squat-knee-r {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-28deg); }
}
@keyframes ea-plank-breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.03); }
}
@keyframes ea-crunch-torso {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-32deg); }
}
@keyframes ea-crunch-legs {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(18deg); }
}
@keyframes ea-run-la {
  0%, 100% { transform: rotate(-25deg); }
  50% { transform: rotate(25deg); }
}
@keyframes ea-run-ra {
  0%, 100% { transform: rotate(25deg); }
  50% { transform: rotate(-25deg); }
}
@keyframes ea-run-ll {
  0%, 100% { transform: rotate(-20deg); }
  50% { transform: rotate(30deg); }
}
@keyframes ea-run-rl {
  0%, 100% { transform: rotate(30deg); }
  50% { transform: rotate(-20deg); }
}
@keyframes ea-lunge-body {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(12px); }
}
@keyframes ea-lunge-front-leg {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(22deg); }
}
@keyframes ea-lunge-back-leg {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-35deg); }
}
@keyframes ea-dip-body {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(14px); }
}
@keyframes ea-dip-arm {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(25deg); }
}
@keyframes ea-curl-forearm {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-80deg); }
}
@keyframes ea-curl-forearm-r {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(80deg); }
}
@keyframes ea-row-torso {
  0%, 100% { transform: rotate(40deg); }
  50% { transform: rotate(35deg); }
}
@keyframes ea-row-arm {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-60deg); }
}
@keyframes ea-jump-body {
  0%, 70%, 100% { transform: translateY(0px); }
  30% { transform: translateY(-22px); }
}
@keyframes ea-jump-legs {
  0%, 70%, 100% { transform: rotate(0deg); }
  30% { transform: rotate(-18deg); }
}
@keyframes ea-pullup-body {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-18px); }
}
@keyframes ea-default-bob {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
`;

const STROKE = '#1E293B';
const BODY_COLOR = '#2563EB';
const SKIN_COLOR = '#FBBF24';
const HAIR_COLOR = '#1E293B';

function StickFigureParts({ animKey, paused }) {
  const dur = paused ? '0s' : '1.1s';
  const inf = 'infinite';
  const ease = 'ease-in-out';

  if (animKey === 'push_up') {
    return (
      <g transform="translate(100, 130)">
        <g style={{ animation: paused ? 'none' : `ea-pushup-body ${dur} ${ease} ${inf}`, transformOrigin: '0 0' }}>
          <ellipse cx="0" cy="-10" rx="12" ry="12" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="2" x2="0" y2="30" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-30" y1="10" x2="30" y2="10" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-30" y1="10" x2="-45" y2="30" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="10" x2="45" y2="30" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="0" y1="30" x2="-20" y2="50" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="0" y1="30" x2="20" y2="50" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  if (animKey === 'squat') {
    return (
      <g transform="translate(100, 60)">
        <g style={{ animation: paused ? 'none' : `ea-squat-body ${dur} ${ease} ${inf}`, transformOrigin: '0 60px' }}>
          <ellipse cx="0" cy="0" rx="14" ry="14" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="14" x2="0" y2="60" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-20" y1="28" x2="-36" y2="52" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="28" x2="36" y2="52" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <g style={{ animation: paused ? 'none' : `ea-squat-knee ${dur} ${ease} ${inf}`, transformOrigin: '-15px 60px' }}>
            <line x1="-15" y1="60" x2="-24" y2="100" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
            <line x1="-24" y1="100" x2="-32" y2="120" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
          <g style={{ animation: paused ? 'none' : `ea-squat-knee-r ${dur} ${ease} ${inf}`, transformOrigin: '15px 60px' }}>
            <line x1="15" y1="60" x2="24" y2="100" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
            <line x1="24" y1="100" x2="32" y2="120" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
      </g>
    );
  }

  if (animKey === 'jumping_jacks') {
    return (
      <g transform="translate(100, 55)">
        <g style={{ animation: paused ? 'none' : `ea-jumpjack ${dur} ${ease} ${inf}`, transformOrigin: '0 0' }}>
          <ellipse cx="0" cy="0" rx="14" ry="14" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="14" x2="0" y2="70" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <g style={{ animation: paused ? 'none' : `ea-arm-out ${dur} ${ease} ${inf}`, transformOrigin: '-18px 28px' }}>
            <line x1="-18" y1="28" x2="-52" y2="12" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
          <g style={{ animation: paused ? 'none' : `ea-arm-out-r ${dur} ${ease} ${inf}`, transformOrigin: '18px 28px' }}>
            <line x1="18" y1="28" x2="52" y2="12" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
          <g style={{ animation: paused ? 'none' : `ea-leg-out ${dur} ${ease} ${inf}`, transformOrigin: '-12px 70px' }}>
            <line x1="-12" y1="70" x2="-36" y2="115" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          </g>
          <g style={{ animation: paused ? 'none' : `ea-leg-out-r ${dur} ${ease} ${inf}`, transformOrigin: '12px 70px' }}>
            <line x1="12" y1="70" x2="36" y2="115" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      </g>
    );
  }

  if (animKey === 'plank') {
    return (
      <g transform="translate(60, 120)">
        <g style={{ animation: paused ? 'none' : `ea-plank-breathe ${dur} ${ease} ${inf}`, transformOrigin: '40px 0px' }}>
          <ellipse cx="80" cy="-10" rx="12" ry="12" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="0" x2="68" y2="0" stroke={BODY_COLOR} strokeWidth="8" strokeLinecap="round" />
          <line x1="0" y1="0" x2="-10" y2="25" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="20" y1="0" x2="10" y2="25" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="68" y1="0" x2="68" y2="25" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="78" y1="2" x2="92" y2="10" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  if (animKey === 'crunch') {
    return (
      <g transform="translate(100, 100)">
        <g style={{ animation: paused ? 'none' : `ea-crunch-torso ${dur} ${ease} ${inf}`, transformOrigin: '0 30px' }}>
          <ellipse cx="0" cy="-18" rx="13" ry="13" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="-5" x2="0" y2="30" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-20" y1="8" x2="-40" y2="25" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="8" x2="40" y2="25" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        </g>
        <g style={{ animation: paused ? 'none' : `ea-crunch-legs ${dur} ${ease} ${inf}`, transformOrigin: '0 30px' }}>
          <line x1="0" y1="30" x2="-18" y2="55" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="0" y1="30" x2="18" y2="55" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-18" y1="55" x2="-38" y2="45" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="18" y1="55" x2="38" y2="45" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  if (animKey === 'run') {
    return (
      <g transform="translate(100, 50)">
        <ellipse cx="0" cy="0" rx="14" ry="14" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
        <line x1="0" y1="14" x2="0" y2="68" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        <g style={{ animation: paused ? 'none' : `ea-run-la ${dur} ${ease} ${inf}`, transformOrigin: '-16px 30px' }}>
          <line x1="-16" y1="30" x2="-38" y2="58" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        </g>
        <g style={{ animation: paused ? 'none' : `ea-run-ra ${dur} ${ease} ${inf}`, transformOrigin: '16px 30px' }}>
          <line x1="16" y1="30" x2="38" y2="58" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        </g>
        <g style={{ animation: paused ? 'none' : `ea-run-ll ${dur} ${ease} ${inf}`, transformOrigin: '-12px 68px' }}>
          <line x1="-12" y1="68" x2="-28" y2="105" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-28" y1="105" x2="-20" y2="128" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        </g>
        <g style={{ animation: paused ? 'none' : `ea-run-rl ${dur} ${ease} ${inf}`, transformOrigin: '12px 68px' }}>
          <line x1="12" y1="68" x2="28" y2="105" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="28" y1="105" x2="20" y2="128" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  if (animKey === 'lunge') {
    return (
      <g transform="translate(100, 50)">
        <g style={{ animation: paused ? 'none' : `ea-lunge-body ${dur} ${ease} ${inf}`, transformOrigin: '0 60px' }}>
          <ellipse cx="0" cy="0" rx="14" ry="14" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="14" x2="0" y2="65" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-20" y1="28" x2="-38" y2="50" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="28" x2="38" y2="50" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <g style={{ animation: paused ? 'none' : `ea-lunge-front-leg ${dur} ${ease} ${inf}`, transformOrigin: '-12px 65px' }}>
            <line x1="-12" y1="65" x2="-38" y2="100" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
            <line x1="-38" y1="100" x2="-52" y2="120" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
          <g style={{ animation: paused ? 'none' : `ea-lunge-back-leg ${dur} ${ease} ${inf}`, transformOrigin: '12px 65px' }}>
            <line x1="12" y1="65" x2="35" y2="95" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
            <line x1="35" y1="95" x2="20" y2="120" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
      </g>
    );
  }

  if (animKey === 'dip') {
    return (
      <g transform="translate(100, 50)">
        <g style={{ animation: paused ? 'none' : `ea-dip-body ${dur} ${ease} ${inf}`, transformOrigin: '0 0' }}>
          <ellipse cx="0" cy="0" rx="14" ry="14" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="14" x2="0" y2="70" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <g style={{ animation: paused ? 'none' : `ea-dip-arm ${dur} ${ease} ${inf}`, transformOrigin: '-20px 30px' }}>
            <line x1="-20" y1="30" x2="-44" y2="18" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
            <line x1="-44" y1="18" x2="-50" y2="50" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
          <g style={{ animation: paused ? 'none' : `ea-dip-arm ${dur} ${ease} ${inf}`, transformOrigin: '20px 30px' }}>
            <line x1="20" y1="30" x2="44" y2="18" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
            <line x1="44" y1="18" x2="50" y2="50" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
          <line x1="-15" y1="70" x2="-22" y2="110" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="15" y1="70" x2="22" y2="110" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  if (animKey === 'curl') {
    return (
      <g transform="translate(100, 55)">
        <ellipse cx="0" cy="0" rx="14" ry="14" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
        <line x1="0" y1="14" x2="0" y2="72" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        <line x1="-18" y1="30" x2="-34" y2="52" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        <g style={{ animation: paused ? 'none' : `ea-curl-forearm ${dur} ${ease} ${inf}`, transformOrigin: '-34px 52px' }}>
          <line x1="-34" y1="52" x2="-28" y2="78" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="-26" cy="82" rx="6" ry="6" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="1.5" />
        </g>
        <line x1="18" y1="30" x2="34" y2="52" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        <g style={{ animation: paused ? 'none' : `ea-curl-forearm-r ${dur} ${ease} ${inf}`, transformOrigin: '34px 52px' }}>
          <line x1="34" y1="52" x2="28" y2="78" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="26" cy="82" rx="6" ry="6" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="1.5" />
        </g>
        <line x1="-15" y1="72" x2="-22" y2="115" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        <line x1="15" y1="72" x2="22" y2="115" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
      </g>
    );
  }

  if (animKey === 'row') {
    return (
      <g transform="translate(100, 60)">
        <g style={{ animation: paused ? 'none' : `ea-row-torso ${dur} ${ease} ${inf}`, transformOrigin: '0 60px' }}>
          <ellipse cx="0" cy="0" rx="13" ry="13" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="13" x2="0" y2="65" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <g style={{ animation: paused ? 'none' : `ea-row-arm ${dur} ${ease} ${inf}`, transformOrigin: '-18px 30px' }}>
            <line x1="-18" y1="30" x2="-52" y2="30" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
          <line x1="18" y1="30" x2="40" y2="48" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="-18" y1="65" x2="-30" y2="108" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="18" y1="65" x2="30" y2="108" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  if (animKey === 'pull_up') {
    return (
      <g transform="translate(100, 40)">
        <line x1="-45" y1="0" x2="45" y2="0" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        <g style={{ animation: paused ? 'none' : `ea-pullup-body ${dur} ${ease} ${inf}`, transformOrigin: '0 15px' }}>
          <line x1="-30" y1="0" x2="-22" y2="22" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="0" x2="22" y2="22" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="0" cy="28" rx="13" ry="13" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="41" x2="0" y2="95" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-16" y1="95" x2="-26" y2="130" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="16" y1="95" x2="26" y2="130" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  if (animKey === 'jump') {
    return (
      <g transform="translate(100, 50)">
        <g style={{ animation: paused ? 'none' : `ea-jump-body ${dur} ${ease} ${inf}`, transformOrigin: '0 0' }}>
          <ellipse cx="0" cy="0" rx="14" ry="14" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
          <line x1="0" y1="14" x2="0" y2="70" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
          <line x1="-20" y1="28" x2="-44" y2="48" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="28" x2="44" y2="48" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          <g style={{ animation: paused ? 'none' : `ea-jump-legs ${dur} ${ease} ${inf}`, transformOrigin: '-12px 70px' }}>
            <line x1="-12" y1="70" x2="-24" y2="110" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
            <line x1="-24" y1="110" x2="-32" y2="130" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
          <g style={{ animation: paused ? 'none' : `ea-jump-legs ${dur} ${ease} ${inf}`, transformOrigin: '12px 70px' }}>
            <line x1="12" y1="70" x2="24" y2="110" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
            <line x1="24" y1="110" x2="32" y2="130" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
      </g>
    );
  }

  return (
    <g transform="translate(100, 50)">
      <g style={{ animation: paused ? 'none' : `ea-default-bob ${dur} ${ease} ${inf}`, transformOrigin: '0 0' }}>
        <ellipse cx="0" cy="0" rx="14" ry="14" fill={SKIN_COLOR} stroke={STROKE} strokeWidth="2" />
        <line x1="0" y1="14" x2="0" y2="72" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        <line x1="-20" y1="28" x2="-40" y2="55" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="28" x2="40" y2="55" stroke={BODY_COLOR} strokeWidth="4" strokeLinecap="round" />
        <line x1="-14" y1="72" x2="-24" y2="115" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
        <line x1="14" y1="72" x2="24" y2="115" stroke={BODY_COLOR} strokeWidth="5" strokeLinecap="round" />
      </g>
    </g>
  );
}

export default function ExerciseAnimation({ animationKey = 'default', size = 200, paused = false, bg = '#EFF6FF' }) {
  useEffect(() => {
    if (document.getElementById('ea-anim-css')) return;
    const style = document.createElement('style');
    style.id = 'ea-anim-css';
    style.textContent = ANIM_CSS;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{
      width: size, height: size, borderRadius: size > 80 ? '28px' : '14px',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <svg
        width={size * 0.9}
        height={size * 0.9}
        viewBox="0 0 200 200"
        style={{ overflow: 'visible' }}
      >
        <StickFigureParts animKey={animationKey} paused={paused} />
      </svg>
    </div>
  );
}
