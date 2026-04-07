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

const SKIN   = '#E8B89A';
const HAIR   = '#3E2723';
const SHIRT  = '#4FC3F7';
const SHORTS = '#1A1A2E';
const SHOE   = '#37474F';
const BAR    = '#1E293B';

function Head({ cx = 0, cy = 0, r = 13 }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />
      <ellipse cx={cx} cy={cy - r * 0.38} rx={r} ry={r * 0.62} fill={HAIR} />
    </>
  );
}

function HumanFigure({ animKey, paused }) {
  const dur  = paused ? '0s' : '1.1s';
  const inf  = 'infinite';
  const ease = 'ease-in-out';
  const A    = (name) => paused ? 'none' : `${name} ${dur} ${ease} ${inf}`;

  if (animKey === 'jumping_jacks') {
    return (
      <g transform="translate(100, 55)">
        <g style={{ animation: A('ea-jumpjack'), transformOrigin: '0 0' }}>
          <g style={{ animation: A('ea-arm-out'), transformOrigin: '-18px 28px' }}>
            <line x1="-18" y1="28" x2="-52" y2="12" stroke={SKIN} strokeWidth="10" strokeLinecap="round" />
          </g>
          <g style={{ animation: A('ea-arm-out-r'), transformOrigin: '18px 28px' }}>
            <line x1="18" y1="28" x2="52" y2="12" stroke={SKIN} strokeWidth="10" strokeLinecap="round" />
          </g>
          <g style={{ animation: A('ea-leg-out'), transformOrigin: '-12px 70px' }}>
            <line x1="-12" y1="70" x2="-36" y2="115" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <ellipse cx="-37" cy="118" rx="11" ry="5" fill={SHOE} />
          </g>
          <g style={{ animation: A('ea-leg-out-r'), transformOrigin: '12px 70px' }}>
            <line x1="12" y1="70" x2="36" y2="115" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <ellipse cx="37" cy="118" rx="11" ry="5" fill={SHOE} />
          </g>
          <rect x="-13" y="14" width="26" height="40" fill={SHIRT} rx="7" />
          <rect x="-13" y="52" width="26" height="22" fill={SHORTS} rx="5" />
          <rect x="-5" y="12" width="10" height="6" fill={SKIN} rx="2" />
          <Head cx={0} cy={0} r={13} />
        </g>
      </g>
    );
  }

  if (animKey === 'squat') {
    return (
      <g transform="translate(100, 60)">
        <g style={{ animation: A('ea-squat-body'), transformOrigin: '0 60px' }}>
          <g style={{ animation: A('ea-squat-knee'), transformOrigin: '-15px 60px' }}>
            <line x1="-15" y1="60" x2="-24" y2="100" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <line x1="-24" y1="100" x2="-20" y2="120" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="-20" cy="123" rx="11" ry="5" fill={SHOE} />
          </g>
          <g style={{ animation: A('ea-squat-knee-r'), transformOrigin: '15px 60px' }}>
            <line x1="15" y1="60" x2="24" y2="100" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <line x1="24" y1="100" x2="20" y2="120" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="20" cy="123" rx="11" ry="5" fill={SHOE} />
          </g>
          <line x1="-20" y1="28" x2="-36" y2="52" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="20" y1="28" x2="36" y2="52" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <rect x="-13" y="14" width="26" height="40" fill={SHIRT} rx="7" />
          <rect x="-14" y="52" width="28" height="14" fill={SHORTS} rx="5" />
          <rect x="-5" y="12" width="10" height="6" fill={SKIN} rx="2" />
          <Head cx={0} cy={0} r={13} />
        </g>
      </g>
    );
  }

  if (animKey === 'push_up') {
    return (
      <g transform="translate(100, 130)">
        <g style={{ animation: A('ea-pushup-body'), transformOrigin: '0 0' }}>
          <line x1="-30" y1="10" x2="-45" y2="32" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="30" y1="10" x2="45" y2="32" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <circle cx="-47" cy="34" r="5" fill={SKIN} />
          <circle cx="47" cy="34" r="5" fill={SKIN} />
          <line x1="-10" y1="28" x2="-18" y2="50" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <line x1="10" y1="28" x2="18" y2="50" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <ellipse cx="-19" cy="53" rx="11" ry="5" fill={SHOE} />
          <ellipse cx="19" cy="53" rx="11" ry="5" fill={SHOE} />
          <rect x="-16" y="5" width="32" height="20" fill={SHIRT} rx="8" />
          <rect x="-32" y="8" width="64" height="9" fill={SHIRT} rx="4" />
          <rect x="-14" y="22" width="28" height="10" fill={SHORTS} rx="4" />
          <rect x="-4" y="0" width="8" height="8" fill={SKIN} rx="2" />
          <Head cx={0} cy={-10} r={12} />
        </g>
      </g>
    );
  }

  if (animKey === 'plank') {
    return (
      <g transform="translate(60, 120)">
        <g style={{ animation: A('ea-plank-breathe'), transformOrigin: '40px 0px' }}>
          <line x1="-2" y1="0" x2="-12" y2="26" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="18" y1="0" x2="10" y2="26" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="68" y1="0" x2="68" y2="26" stroke={SKIN} strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="-12" cy="29" rx="9" ry="4" fill={SKIN} />
          <ellipse cx="10" cy="29" rx="9" ry="4" fill={SKIN} />
          <ellipse cx="68" cy="29" rx="10" ry="5" fill={SHOE} />
          <rect x="5" y="-7" width="62" height="17" fill={SHIRT} rx="7" />
          <rect x="-8" y="-5" width="20" height="13" fill={SHORTS} rx="4" />
          <rect x="74" y="0" width="8" height="6" fill={SKIN} rx="2" />
          <line x1="80" y1="2" x2="93" y2="10" stroke={SKIN} strokeWidth="8" strokeLinecap="round" />
          <Head cx={80} cy={-10} r={12} />
        </g>
      </g>
    );
  }

  if (animKey === 'crunch') {
    return (
      <g transform="translate(100, 100)">
        <g style={{ animation: A('ea-crunch-torso'), transformOrigin: '0 30px' }}>
          <line x1="-20" y1="8" x2="-40" y2="25" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="20" y1="8" x2="40" y2="25" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <rect x="-12" y="-5" width="24" height="36" fill={SHIRT} rx="7" />
          <rect x="-5" y="-20" width="10" height="8" fill={SKIN} rx="2" />
          <Head cx={0} cy={-18} r={13} />
        </g>
        <g style={{ animation: A('ea-crunch-legs'), transformOrigin: '0 30px' }}>
          <line x1="0" y1="30" x2="-18" y2="55" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <line x1="0" y1="30" x2="18" y2="55" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <line x1="-18" y1="55" x2="-38" y2="45" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="18" y1="55" x2="38" y2="45" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="-39" cy="44" rx="9" ry="5" fill={SHOE} />
          <ellipse cx="39" cy="44" rx="9" ry="5" fill={SHOE} />
          <rect x="-12" y="28" width="24" height="16" fill={SHORTS} rx="5" />
        </g>
      </g>
    );
  }

  if (animKey === 'run') {
    return (
      <g transform="translate(100, 50)">
        <g style={{ animation: A('ea-run-la'), transformOrigin: '-16px 30px' }}>
          <line x1="-16" y1="30" x2="-38" y2="58" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <circle cx="-39" cy="61" r="5" fill={SKIN} />
        </g>
        <g style={{ animation: A('ea-run-ra'), transformOrigin: '16px 30px' }}>
          <line x1="16" y1="30" x2="38" y2="58" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <circle cx="39" cy="61" r="5" fill={SKIN} />
        </g>
        <g style={{ animation: A('ea-run-ll'), transformOrigin: '-12px 68px' }}>
          <line x1="-12" y1="68" x2="-28" y2="105" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <line x1="-28" y1="105" x2="-20" y2="128" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="-20" cy="131" rx="11" ry="5" fill={SHOE} />
        </g>
        <g style={{ animation: A('ea-run-rl'), transformOrigin: '12px 68px' }}>
          <line x1="12" y1="68" x2="28" y2="105" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <line x1="28" y1="105" x2="20" y2="128" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="20" cy="131" rx="11" ry="5" fill={SHOE} />
        </g>
        <rect x="-13" y="14" width="26" height="40" fill={SHIRT} rx="7" />
        <rect x="-13" y="52" width="26" height="20" fill={SHORTS} rx="5" />
        <rect x="-5" y="12" width="10" height="6" fill={SKIN} rx="2" />
        <Head cx={0} cy={0} r={13} />
      </g>
    );
  }

  if (animKey === 'lunge') {
    return (
      <g transform="translate(100, 50)">
        <g style={{ animation: A('ea-lunge-body'), transformOrigin: '0 60px' }}>
          <g style={{ animation: A('ea-lunge-front-leg'), transformOrigin: '-12px 65px' }}>
            <line x1="-12" y1="65" x2="-38" y2="100" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <line x1="-38" y1="100" x2="-52" y2="120" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="-53" cy="123" rx="11" ry="5" fill={SHOE} />
          </g>
          <g style={{ animation: A('ea-lunge-back-leg'), transformOrigin: '12px 65px' }}>
            <line x1="12" y1="65" x2="35" y2="95" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <line x1="35" y1="95" x2="20" y2="120" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="19" cy="123" rx="11" ry="5" fill={SHOE} />
          </g>
          <line x1="-20" y1="28" x2="-38" y2="50" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="20" y1="28" x2="38" y2="50" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <rect x="-13" y="14" width="26" height="40" fill={SHIRT} rx="7" />
          <rect x="-14" y="52" width="28" height="16" fill={SHORTS} rx="5" />
          <rect x="-5" y="12" width="10" height="6" fill={SKIN} rx="2" />
          <Head cx={0} cy={0} r={13} />
        </g>
      </g>
    );
  }

  if (animKey === 'dip') {
    return (
      <g transform="translate(100, 50)">
        <g style={{ animation: A('ea-dip-body'), transformOrigin: '0 0' }}>
          <line x1="-15" y1="70" x2="-22" y2="112" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <line x1="15" y1="70" x2="22" y2="112" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <ellipse cx="-22" cy="115" rx="11" ry="5" fill={SHOE} />
          <ellipse cx="22" cy="115" rx="11" ry="5" fill={SHOE} />
          <g style={{ animation: A('ea-dip-arm'), transformOrigin: '-20px 30px' }}>
            <line x1="-20" y1="30" x2="-44" y2="18" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <line x1="-44" y1="18" x2="-50" y2="50" stroke={SKIN} strokeWidth="8" strokeLinecap="round" />
            <circle cx="-50" cy="52" r="5" fill={SKIN} />
          </g>
          <g style={{ animation: A('ea-dip-arm'), transformOrigin: '20px 30px' }}>
            <line x1="20" y1="30" x2="44" y2="18" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <line x1="44" y1="18" x2="50" y2="50" stroke={SKIN} strokeWidth="8" strokeLinecap="round" />
            <circle cx="50" cy="52" r="5" fill={SKIN} />
          </g>
          <rect x="-13" y="14" width="26" height="40" fill={SHIRT} rx="7" />
          <rect x="-13" y="52" width="26" height="22" fill={SHORTS} rx="5" />
          <rect x="-5" y="12" width="10" height="6" fill={SKIN} rx="2" />
          <Head cx={0} cy={0} r={13} />
        </g>
      </g>
    );
  }

  if (animKey === 'curl') {
    return (
      <g transform="translate(100, 55)">
        <line x1="-15" y1="72" x2="-22" y2="115" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
        <line x1="15" y1="72" x2="22" y2="115" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
        <ellipse cx="-22" cy="118" rx="11" ry="5" fill={SHOE} />
        <ellipse cx="22" cy="118" rx="11" ry="5" fill={SHOE} />
        <line x1="-18" y1="30" x2="-34" y2="52" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
        <g style={{ animation: A('ea-curl-forearm'), transformOrigin: '-34px 52px' }}>
          <line x1="-34" y1="52" x2="-28" y2="78" stroke={SKIN} strokeWidth="8" strokeLinecap="round" />
          <circle cx="-27" cy="81" r="6" fill={SKIN} />
        </g>
        <line x1="18" y1="30" x2="34" y2="52" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
        <g style={{ animation: A('ea-curl-forearm-r'), transformOrigin: '34px 52px' }}>
          <line x1="34" y1="52" x2="28" y2="78" stroke={SKIN} strokeWidth="8" strokeLinecap="round" />
          <circle cx="27" cy="81" r="6" fill={SKIN} />
        </g>
        <rect x="-13" y="14" width="26" height="40" fill={SHIRT} rx="7" />
        <rect x="-13" y="52" width="26" height="24" fill={SHORTS} rx="5" />
        <rect x="-5" y="12" width="10" height="6" fill={SKIN} rx="2" />
        <Head cx={0} cy={0} r={13} />
      </g>
    );
  }

  if (animKey === 'row') {
    return (
      <g transform="translate(100, 60)">
        <g style={{ animation: A('ea-row-torso'), transformOrigin: '0 60px' }}>
          <line x1="-18" y1="65" x2="-30" y2="108" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <line x1="18" y1="65" x2="30" y2="108" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <ellipse cx="-31" cy="111" rx="11" ry="5" fill={SHOE} />
          <ellipse cx="31" cy="111" rx="11" ry="5" fill={SHOE} />
          <g style={{ animation: A('ea-row-arm'), transformOrigin: '-18px 30px' }}>
            <line x1="-18" y1="30" x2="-52" y2="30" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <circle cx="-54" cy="30" r="5" fill={SKIN} />
          </g>
          <line x1="18" y1="30" x2="40" y2="48" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <circle cx="42" cy="50" r="5" fill={SKIN} />
          <rect x="-13" y="13" width="26" height="38" fill={SHIRT} rx="7" />
          <rect x="-14" y="50" width="28" height="18" fill={SHORTS} rx="5" />
          <rect x="-5" y="11" width="10" height="6" fill={SKIN} rx="2" />
          <Head cx={0} cy={0} r={13} />
        </g>
      </g>
    );
  }

  if (animKey === 'pull_up') {
    return (
      <g transform="translate(100, 40)">
        <rect x="-50" y="-4" width="100" height="8" fill={BAR} rx="4" />
        <g style={{ animation: A('ea-pullup-body'), transformOrigin: '0 15px' }}>
          <line x1="-30" y1="0" x2="-22" y2="22" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="30" y1="0" x2="22" y2="22" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="-16" y1="95" x2="-26" y2="132" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <line x1="16" y1="95" x2="26" y2="132" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
          <ellipse cx="-27" cy="135" rx="11" ry="5" fill={SHOE} />
          <ellipse cx="27" cy="135" rx="11" ry="5" fill={SHOE} />
          <rect x="-13" y="38" width="26" height="40" fill={SHIRT} rx="7" />
          <rect x="-13" y="76" width="26" height="22" fill={SHORTS} rx="5" />
          <rect x="-5" y="36" width="10" height="6" fill={SKIN} rx="2" />
          <Head cx={0} cy={28} r={13} />
        </g>
      </g>
    );
  }

  if (animKey === 'jump') {
    return (
      <g transform="translate(100, 50)">
        <g style={{ animation: A('ea-jump-body'), transformOrigin: '0 0' }}>
          <g style={{ animation: A('ea-jump-legs'), transformOrigin: '-12px 70px' }}>
            <line x1="-12" y1="70" x2="-24" y2="110" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <line x1="-24" y1="110" x2="-30" y2="130" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="-31" cy="133" rx="11" ry="5" fill={SHOE} />
          </g>
          <g style={{ animation: A('ea-jump-legs'), transformOrigin: '12px 70px' }}>
            <line x1="12" y1="70" x2="24" y2="110" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
            <line x1="24" y1="110" x2="30" y2="130" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="31" cy="133" rx="11" ry="5" fill={SHOE} />
          </g>
          <line x1="-20" y1="28" x2="-44" y2="48" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <line x1="20" y1="28" x2="44" y2="48" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
          <circle cx="-46" cy="50" r="5" fill={SKIN} />
          <circle cx="46" cy="50" r="5" fill={SKIN} />
          <rect x="-13" y="14" width="26" height="40" fill={SHIRT} rx="7" />
          <rect x="-13" y="52" width="26" height="22" fill={SHORTS} rx="5" />
          <rect x="-5" y="12" width="10" height="6" fill={SKIN} rx="2" />
          <Head cx={0} cy={0} r={13} />
        </g>
      </g>
    );
  }

  return (
    <g transform="translate(100, 50)">
      <g style={{ animation: A('ea-default-bob'), transformOrigin: '0 0' }}>
        <line x1="-20" y1="28" x2="-40" y2="55" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
        <line x1="20" y1="28" x2="40" y2="55" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
        <circle cx="-41" cy="57" r="5" fill={SKIN} />
        <circle cx="41" cy="57" r="5" fill={SKIN} />
        <line x1="-14" y1="72" x2="-20" y2="115" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
        <line x1="14" y1="72" x2="20" y2="115" stroke={SKIN} strokeWidth="11" strokeLinecap="round" />
        <ellipse cx="-21" cy="118" rx="11" ry="5" fill={SHOE} />
        <ellipse cx="21" cy="118" rx="11" ry="5" fill={SHOE} />
        <rect x="-13" y="14" width="26" height="40" fill={SHIRT} rx="7" />
        <rect x="-13" y="52" width="26" height="24" fill={SHORTS} rx="5" />
        <rect x="-5" y="12" width="10" height="6" fill={SKIN} rx="2" />
        <Head cx={0} cy={0} r={13} />
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
        <HumanFigure animKey={animationKey} paused={paused} />
      </svg>
    </div>
  );
}
