'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAppSettings } from '../context/AppSettingsContext.js';

/* ─── DATA ─────────────────────────────────────────────────────────── */
const CAT_COLORS = {
  gym: '#1D4ED8', cardio: '#DC2626', yoga: '#0891B2',
  calisthenics: '#065F46', 'martial arts': '#92400E', rehab: '#5B21B6', bodyweight: '#1E40AF',
};
const LEVEL_COLORS = { Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444' };

const WORKOUT_CATALOG = [
  { id: 1, title: 'Full Body Blast', category: 'gym', duration: 40, level: 'Intermediate', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=500&fit=crop&auto=format', desc: 'Complete full-body strength circuit combining compound movements for maximum muscle activation and calorie burn.', exercises: [{ name: 'Barbell Squat', reps: 10, duration: 30, type: 'legs', cals: 13 }, { name: 'Bench Press', reps: 10, duration: 30, type: 'chest', cals: 11 }, { name: 'Deadlift', reps: 8, duration: 30, type: 'back', cals: 13 }, { name: 'Overhead Press', reps: 10, duration: 30, type: 'shoulders', cals: 10 }, { name: 'Pull-Ups', reps: 8, duration: 30, type: 'back', cals: 11 }, { name: 'Dips', reps: 10, duration: 30, type: 'chest', cals: 10 }, { name: 'Cable Row', reps: 12, duration: 30, type: 'back', cals: 9 }, { name: 'Hanging Leg Raises', reps: 12, duration: 30, type: 'core', cals: 9 }] },
  { id: 2, title: 'HIIT Cardio Burn', category: 'cardio', duration: 25, level: 'Intermediate', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&h=500&fit=crop&auto=format', desc: 'High-intensity intervals that torch calories fast and keep your metabolism elevated for hours afterward.', exercises: [{ name: 'Jumping Jacks', reps: 30, duration: 30, type: 'cardio', cals: 8 }, { name: 'High Knees', reps: 30, duration: 30, type: 'cardio', cals: 10 }, { name: 'Burpees', reps: 10, duration: 30, type: 'full body', cals: 14 }, { name: 'Mountain Climbers', reps: 20, duration: 30, type: 'core', cals: 10 }, { name: 'Jump Squats', reps: 15, duration: 30, type: 'legs', cals: 12 }, { name: 'Box Jumps', reps: 10, duration: 30, type: 'legs', cals: 13 }, { name: 'Plyo Push-Ups', reps: 10, duration: 30, type: 'chest', cals: 12 }, { name: 'Sprint in Place', reps: 30, duration: 30, type: 'cardio', cals: 11 }] },
  { id: 3, title: 'Morning Yoga Flow', category: 'yoga', duration: 30, level: 'Beginner', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=500&fit=crop&auto=format', desc: 'Energizing yoga sequence to wake your body, improve mobility, and set a calm, focused tone for your day.', exercises: [{ name: "Child's Pose", reps: 1, duration: 30, type: 'flexibility', cals: 3 }, { name: 'Cat-Cow Stretch', reps: 10, duration: 30, type: 'mobility', cals: 4 }, { name: 'Downward Dog', reps: 1, duration: 30, type: 'strength', cals: 5 }, { name: 'Sun Salutation A', reps: 3, duration: 30, type: 'flow', cals: 6 }, { name: 'Warrior I', reps: 1, duration: 30, type: 'balance', cals: 5 }, { name: 'Savasana', reps: 1, duration: 30, type: 'recovery', cals: 2 }] },
  { id: 4, title: 'Calisthenics Power', category: 'calisthenics', duration: 45, level: 'Advanced', image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&h=500&fit=crop&auto=format', desc: 'Bodyweight mastery session focusing on pushing, pulling, and core strength for elite bodyweight control.', exercises: [{ name: 'Muscle-Up Progressions', reps: 5, duration: 30, type: 'upper body', cals: 14 }, { name: 'Pistol Squats', reps: 8, duration: 30, type: 'legs', cals: 13 }, { name: 'Planche Lean', reps: 1, duration: 20, type: 'core', cals: 10 }, { name: 'Dragon Flag', reps: 6, duration: 30, type: 'core', cals: 12 }] },
  { id: 5, title: '7-Minute Abs', category: 'cardio', duration: 7, level: 'Intermediate', image: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=900&h=500&fit=crop&auto=format', desc: 'Science-backed 7-minute core circuit targeting every abdominal muscle for definition and functional strength.', exercises: [{ name: 'Crunches', reps: 20, duration: 30, type: 'upper abs', cals: 7 }, { name: 'Leg Raises', reps: 15, duration: 30, type: 'lower abs', cals: 7 }, { name: 'Bicycle Crunches', reps: 20, duration: 30, type: 'obliques', cals: 8 }, { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 6 }, { name: 'V-Ups', reps: 12, duration: 30, type: 'full abs', cals: 9 }] },
  { id: 6, title: 'Strength Builder', category: 'gym', duration: 55, level: 'Advanced', image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=900&h=500&fit=crop&auto=format', desc: 'Progressive overload program designed for maximum hypertrophy and strength gains.', exercises: [{ name: 'Barbell Back Squat', reps: 5, duration: 30, type: 'legs', cals: 14 }, { name: 'Incline Bench Press', reps: 8, duration: 30, type: 'chest', cals: 12 }, { name: 'Romanian Deadlift', reps: 8, duration: 30, type: 'legs', cals: 12 }, { name: 'Weighted Pull-Ups', reps: 6, duration: 30, type: 'back', cals: 13 }] },
  { id: 7, title: 'Gentle Morning Stretch', category: 'yoga', duration: 15, level: 'Beginner', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=500&fit=crop&auto=format', desc: 'Easy flexibility and mobility work suitable for all ages. Perfect to start any morning.', exercises: [{ name: 'Neck Rolls', reps: 5, duration: 30, type: 'mobility', cals: 2 }, { name: 'Shoulder Rolls', reps: 10, duration: 30, type: 'mobility', cals: 2 }, { name: 'Forward Fold', reps: 1, duration: 30, type: 'flexibility', cals: 3 }] },
  { id: 8, title: 'Push Day Classic', category: 'gym', duration: 50, level: 'Intermediate', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=500&fit=crop&auto=format', desc: 'Complete chest, shoulders, and triceps session with optimal rep ranges for growth.', exercises: [{ name: 'Flat Bench Press', reps: 10, duration: 30, type: 'chest', cals: 12 }, { name: 'Incline Dumbbell Press', reps: 12, duration: 30, type: 'chest', cals: 11 }, { name: 'Overhead Press', reps: 10, duration: 30, type: 'shoulders', cals: 10 }, { name: 'Tricep Pushdown', reps: 15, duration: 30, type: 'triceps', cals: 7 }] },
  { id: 9, title: 'Bodyweight Only', category: 'bodyweight', duration: 30, level: 'Beginner', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&h=500&fit=crop&auto=format', desc: 'No equipment needed. A complete total-body session you can do anywhere.', exercises: [{ name: 'Push-Ups', reps: 15, duration: 30, type: 'chest', cals: 9 }, { name: 'Squats', reps: 20, duration: 30, type: 'legs', cals: 8 }, { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 6 }, { name: 'Lunges', reps: 12, duration: 30, type: 'legs', cals: 9 }] },
  { id: 10, title: 'Sprint Intervals', category: 'cardio', duration: 20, level: 'Advanced', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&h=500&fit=crop&auto=format', desc: 'Explosive sprint protocol for peak cardiovascular performance and fat burning in minimal time.', exercises: [{ name: 'Dynamic Warm-Up', reps: 1, duration: 30, type: 'mobility', cals: 5 }, { name: '30-Sec Sprint', reps: 1, duration: 30, type: 'cardio', cals: 16 }] },
  { id: 11, title: 'Pull Day Classic', category: 'gym', duration: 45, level: 'Intermediate', image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=900&h=500&fit=crop&auto=format', desc: 'Back and bicep focused mass builder using vertical and horizontal pulling patterns.', exercises: [{ name: 'Weighted Pull-Ups', reps: 8, duration: 30, type: 'back', cals: 13 }, { name: 'Barbell Bent-Over Row', reps: 10, duration: 30, type: 'back', cals: 12 }, { name: 'Lat Pulldown', reps: 12, duration: 30, type: 'back', cals: 9 }, { name: 'Barbell Curl', reps: 10, duration: 30, type: 'biceps', cals: 9 }] },
  { id: 12, title: 'First Push-Up', category: 'bodyweight', duration: 20, level: 'Beginner', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=500&fit=crop&auto=format', desc: 'Learn the correct push-up form from zero, progressing through the movement pattern safely.', exercises: [{ name: 'Wall Push-Ups', reps: 15, duration: 30, type: 'chest', cals: 5 }, { name: 'Standard Push-Ups', reps: 8, duration: 30, type: 'chest', cals: 9 }] },
  { id: 15, title: '100 Burpee Challenge', category: 'cardio', duration: 30, level: 'Advanced', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&h=500&fit=crop&auto=format', desc: 'The ultimate mental and physical toughness test. 100 burpees — beat your time every session.', exercises: [{ name: 'Burpee Block 1 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 }, { name: 'Burpee Block 2 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 }] },
  { id: 16, title: 'Muscle-Up Mastery', category: 'calisthenics', duration: 40, level: 'Advanced', image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a3?w=900&h=500&fit=crop&auto=format', desc: 'Structured progression to achieve your first muscle-up, combining pull and push strength.', exercises: [{ name: 'Explosive Pull-Ups', reps: 6, duration: 30, type: 'back', cals: 12 }, { name: 'Ring Muscle-Up', reps: 3, duration: 30, type: 'full body', cals: 14 }] },
  { id: 17, title: 'Shoulder Rehab', category: 'rehab', duration: 20, level: 'Beginner', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=500&fit=crop&auto=format', desc: 'Evidence-based shoulder rehab protocol to restore strength, mobility, and pain-free movement.', exercises: [{ name: 'Pendulum Swings', reps: 20, duration: 30, type: 'mobility', cals: 3 }, { name: 'Wall Slides', reps: 15, duration: 30, type: 'mobility', cals: 4 }] },
  { id: 18, title: 'Muay Thai Basics', category: 'martial arts', duration: 30, level: 'Beginner', image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=900&h=500&fit=crop&auto=format', desc: 'Fundamental Muay Thai strikes, footwork, and conditioning. Build power from the ground up.', exercises: [{ name: 'Shadow Boxing Warm-Up', reps: 1, duration: 30, type: 'cardio', cals: 8 }, { name: 'Jab-Cross Combos', reps: 20, duration: 30, type: 'punching', cals: 9 }] },
  { id: 20, title: 'Core Stability', category: 'bodyweight', duration: 20, level: 'Beginner', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&h=500&fit=crop&auto=format', desc: 'Foundation core work combining anti-rotation, stability, and endurance for injury prevention.', exercises: [{ name: 'Dead Bug', reps: 10, duration: 30, type: 'core', cals: 5 }, { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 6 }] },
  { id: 24, title: 'Dumbbell Full Body', category: 'gym', duration: 35, level: 'Beginner', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=900&h=500&fit=crop&auto=format', desc: 'Versatile dumbbell program hitting every major muscle group — gym or home.', exercises: [{ name: 'DB Goblet Squat', reps: 15, duration: 30, type: 'legs', cals: 9 }, { name: 'DB Chest Press', reps: 12, duration: 30, type: 'chest', cals: 10 }] },
];

const BODY_FOCUS = [
  { label: 'Full Body', image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=300&h=300&fit=crop&auto=format', workoutId: 1 },
  { label: 'Abs', image: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=300&h=300&fit=crop&auto=format', workoutId: 5 },
  { label: 'Arms', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=300&fit=crop&auto=format', workoutId: 9 },
  { label: 'Butt & Leg', image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=300&h=300&fit=crop&auto=format', workoutId: 1 },
  { label: 'Chest', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop&auto=format', workoutId: 8 },
  { label: 'Back', image: 'https://images.unsplash.com/photo-1530822847156-5df684ec5105?w=300&h=300&fit=crop&auto=format', workoutId: 11 },
];

const WORKOUT_TYPES = [
  { key: 'muscle', label: 'Build Muscle', icon: '💪' },
  { key: 'warmup', label: 'Warm-Up', icon: '🏃' },
  { key: 'fat', label: 'Fat Burning', icon: '🔥' },
  { key: 'equipment', label: 'With Equipment', icon: '🏋️' },
  { key: 'stretching', label: 'Stretching', icon: '🧘' },
  { key: 'cardio', label: 'Cardio', icon: '❤️' },
];

const WEEKDAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/* ─── HELPERS ───────────────────────────────────────────────────────── */
function fmtDuration(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function getWeekRange(date) {
  const d = new Date(date), day = d.getDay();
  const start = new Date(d); start.setDate(d.getDate() - day);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const fmt = dt => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getWeekKey(date) {
  const d = new Date(date), day = d.getDay();
  const start = new Date(d); start.setDate(d.getDate() - day);
  return start.toISOString().split('T')[0];
}

/* ─── COUNTDOWN RING ────────────────────────────────────────────────── */
function CountdownRing({ value, max, color = '#2563EB' }) {
  const r = 54, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="130" height="130" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#334155" strokeWidth="8" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - value / max)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>sec</div>
      </div>
    </div>
  );
}

/* ─── HISTORY VIEW ──────────────────────────────────────────────────── */
function HistoryView({ onBack }) {
  const { t } = useAppSettings();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  useEffect(() => {
    fetch('/api/sessions').then(r => r.json()).then(d => {
      setSessions(Array.isArray(d) ? d : (d.sessions || []));
    }).catch(() => setSessions([])).finally(() => setLoading(false));
  }, []);

  const workoutDays = new Set(
    sessions.filter(s => {
      const d = new Date(s.date || s.created_at || 0);
      return d.getFullYear() === calYear && d.getMonth() === calMonth;
    }).map(s => new Date(s.date || s.created_at || 0).getDate())
  );

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthName = new Date(calYear, calMonth, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const isCurrentMonth = calMonth === today.getMonth() && calYear === today.getFullYear();

  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  // group sessions by week
  const weekMap = {};
  sessions.forEach(s => {
    const d = new Date(s.date || s.created_at || 0);
    const key = getWeekKey(d);
    if (!weekMap[key]) weekMap[key] = { key, range: getWeekRange(d), items: [], cals: 0, secs: 0 };
    weekMap[key].items.push(s);
    weekMap[key].cals += s.calories || 0;
    weekMap[key].secs += s.duration || 0;
  });
  const weeks = Object.values(weekMap).sort((a, b) => b.key.localeCompare(a.key));

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 24px 16px', gap: 14, borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{t.history}</div>
      </div>

      <div style={{ padding: '20px 24px' }}>
        {/* Calendar */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '20px', border: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', border: 'none', cursor: 'pointer', fontSize: 16 }}>‹</button>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>{monthName}</div>
            <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', border: 'none', cursor: 'pointer', fontSize: 16 }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
            {WEEKDAYS_SHORT.map((d, i) => <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', padding: '4px 0' }}>{d}</div>)}
          </div>
          {Array.from({ length: cells.length / 7 }, (_, row) => (
            <div key={row} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
              {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
                if (!day) return <div key={col} style={{ height: 36 }} />;
                const isToday = isCurrentMonth && day === today.getDate();
                const hasW = workoutDays.has(day);
                return (
                  <div key={col} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 36 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isToday ? 'var(--text)' : hasW ? 'var(--primary-50)' : 'transparent' }}>
                      <span style={{ fontSize: 13, fontWeight: isToday || hasW ? 700 : 400, color: isToday ? 'var(--bg)' : hasW ? 'var(--primary)' : 'var(--text-secondary)' }}>{day}</span>
                    </div>
                    {hasW && !isToday && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)', marginTop: 1 }} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Weekly summary */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>Loading…</div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>{t.noWorkoutsYet}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.noWorkoutsDesc}</div>
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 16 }}>{t.weeklySummary}</div>
            {weeks.map(group => (
              <div key={group.key} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{group.range}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{group.items.length} {group.items.length !== 1 ? t.workoutsLabelP : t.workoutsLabel}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600 }}>⏱ {fmtDuration(group.secs)}</div>
                    <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 600, marginTop: 2 }}>🔥 {Math.round(group.cals)} Kcal</div>
                  </div>
                </div>
                {group.items.map((s, i) => {
                  const d = new Date(s.date || s.created_at || 0);
                  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, padding: '12px 14px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
                      <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&auto=format" alt="workout" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 2 }}>{dateStr}, {timeStr}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{s.title || s.body_part || 'Workout'}</div>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <span style={{ fontSize: 12, color: '#3B82F6' }}>⏱ {fmtDuration(s.duration || 0)}</span>
                          <span style={{ fontSize: 12, color: '#EF4444' }}>🔥 {s.calories || 0} Kcal</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── SEARCH VIEW ───────────────────────────────────────────────────── */
function SearchView({ onBack, onOpenWorkout }) {
  const { t } = useAppSettings();
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBody, setSelectedBody] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const filtered = useMemo(() => {
    return WORKOUT_CATALOG.filter(w => {
      const q = query.toLowerCase();
      const matchQ = q.length < 2 || w.title.toLowerCase().includes(q) || w.category.toLowerCase().includes(q) || w.level.toLowerCase().includes(q);
      const matchLvl = !selectedLevel || w.level === selectedLevel;
      const matchType = !selectedType || (selectedType === 'muscle' && (w.category === 'gym' || w.category === 'calisthenics'))
        || (selectedType === 'fat' && w.category === 'cardio')
        || (selectedType === 'cardio' && w.category === 'cardio')
        || (selectedType === 'equipment' && w.category === 'gym')
        || (selectedType === 'warmup' && w.duration <= 15)
        || (selectedType === 'stretching' && (w.category === 'yoga' || w.category === 'rehab'));
      const matchBody = !selectedBody || w.title.toLowerCase().includes(selectedBody.toLowerCase()) || w.category.toLowerCase().includes(selectedBody.toLowerCase());
      return matchQ && matchLvl && matchType && matchBody;
    });
  }, [query, selectedLevel, selectedType, selectedBody]);

  const showResults = query.length > 1 || selectedLevel || selectedType || selectedBody;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 40 }}>
      {/* Search bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 16, color: 'var(--text-tertiary)' }}>🔍</div>
        <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder={t.searchPlaceholder}
          style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 15, color: 'var(--text)', outline: 'none' }} />
        {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-tertiary)' }}>✕</button>}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{t.back}</button>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Body Focus - circular */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 14 }}>{t.chooseBodyPart}</div>
          <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 8 }} className="hide-scroll">
            {BODY_FOCUS.map((bf, i) => (
              <button key={i} onClick={() => setSelectedBody(selectedBody === bf.label ? null : bf.label)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', border: selectedBody === bf.label ? '2.5px solid var(--primary)' : '2.5px solid transparent', boxSizing: 'border-box', flexShrink: 0 }}>
                  <img src={bf.image} alt={bf.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: selectedBody === bf.label ? 'var(--primary)' : 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>{bf.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Workout Type */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 12 }}>{t.workoutType}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {WORKOUT_TYPES.map(wt => (
              <button key={wt.key} onClick={() => setSelectedType(selectedType === wt.key ? null : wt.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, border: selectedType === wt.key ? '2px solid var(--primary)' : '1.5px solid var(--border)', background: selectedType === wt.key ? 'var(--primary-50)' : 'var(--surface)', cursor: 'pointer', outline: 'none', transition: 'all 0.15s' }}>
                <span style={{ fontSize: 20 }}>{wt.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'left' }}>{wt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 12 }}>{t.filterLevel}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ key: 'Beginner', label: t.lvl_beginner }, { key: 'Intermediate', label: t.lvl_intermediate }, { key: 'Advanced', label: t.lvl_advanced }].map(lvl => {
              const color = LEVEL_COLORS[lvl.key];
              const active = selectedLevel === lvl.key;
              return (
                <button key={lvl.key} onClick={() => setSelectedLevel(active ? null : lvl.key)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 99, border: `1.5px solid ${active ? color : color + '50'}`, background: active ? color + '20' : 'var(--surface)', color, fontWeight: 600, fontSize: 13, cursor: 'pointer', outline: 'none', transition: 'all 0.15s' }}>
                  {lvl.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 12 }}>{t.filterDuration}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ key: 's', label: '< 4\nmins' }, { key: 'm', label: '5–7\nmins' }, { key: 'l', label: '8–10\nmins' }].map(d => (
              <div key={d.key} style={{ flex: 1, padding: '16px 8px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--surface)', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{d.label}</div>
            ))}
          </div>
        </div>

        {/* Can't find */}
        {!showResults && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 14 }}>{t.cantFind}</div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 12, border: '1.5px solid var(--primary)', background: 'var(--primary-50)', color: 'var(--primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              ✏️ {t.tellUs}
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14 }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontWeight: 700, color: 'var(--text)' }}>{t.noResults}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{t.tryFilters}</div>
              </div>
            ) : filtered.map(w => {
              const catColor = CAT_COLORS[w.category] || '#2563EB';
              return (
                <button key={w.id} onClick={() => onOpenWorkout(w)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: 'var(--surface)', borderRadius: 14, padding: '12px 14px', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', outline: 'none', marginBottom: 10 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={w.image} alt={w.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{w.duration} min · {w.level}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: `${catColor}15`, color: catColor, flexShrink: 0 }}>{w.category}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN DISCOVER COMPONENT ───────────────────────────────────────── */
export default function Discover() {
  const { t } = useAppSettings();
  const [view, setView] = useState('browse');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [phase, setPhase] = useState('countdown');
  const [countdown, setCountdown] = useState(5);
  const [exIdx, setExIdx] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(30);
  const [restTimer, setRestTimer] = useState(15);
  const [paused, setPaused] = useState(false);
  const [totalCals, setTotalCals] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef(null);

  const openDetail = useCallback((workout) => { setSelectedWorkout(workout); setView('detail'); }, []);
  const openById = useCallback((id) => { const w = WORKOUT_CATALOG.find(x => x.id === id); if (w) openDetail(w); }, [openDetail]);

  const startWorkout = () => {
    setExIdx(0); setPhase('countdown'); setCountdown(5); setExerciseTimer(30); setRestTimer(15);
    setPaused(false); setTotalCals(0); setTotalReps(0); setCompletedCount(0); setSessionStart(Date.now());
    setView('session');
  };

  const goBack = () => {
    clearInterval(timerRef.current);
    if (view === 'session') setView('detail');
    else { setSelectedWorkout(null); setView('browse'); }
  };

  const exercises = selectedWorkout?.exercises || [];
  const currentExercise = exercises[exIdx];

  const markDone = useCallback(() => {
    clearInterval(timerRef.current);
    const ex = exercises[exIdx];
    if (ex) { setTotalCals(c => c + (ex.cals || 8)); setTotalReps(r => r + (ex.reps || 10)); setCompletedCount(c => c + 1); }
    if (exIdx < exercises.length - 1) { setExIdx(i => i + 1); setPhase('rest'); setRestTimer(15); }
    else setPhase('done');
  }, [exIdx, exercises]);

  const skipExercise = useCallback(() => {
    clearInterval(timerRef.current);
    if (exIdx < exercises.length - 1) { setExIdx(i => i + 1); setPhase('rest'); setRestTimer(15); }
    else setPhase('done');
  }, [exIdx, exercises]);

  useEffect(() => {
    if (view !== 'session') { clearInterval(timerRef.current); return; }
    if (paused) return;
    clearInterval(timerRef.current);
    if (phase === 'countdown') {
      timerRef.current = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); setPhase('exercise'); setExerciseTimer(30); return 0; } return c - 1; }), 1000);
    } else if (phase === 'exercise') {
      timerRef.current = setInterval(() => setExerciseTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          const ex = exercises[exIdx];
          if (ex) { setTotalCals(c => c + (ex.cals || 8)); setTotalReps(r => r + (ex.reps || 10)); setCompletedCount(c => c + 1); }
          if (exIdx < exercises.length - 1) { setPhase('rest'); setRestTimer(15); } else setPhase('done');
          return 0;
        }
        return t - 1;
      }), 1000);
    } else if (phase === 'rest') {
      timerRef.current = setInterval(() => setRestTimer(t => { if (t <= 1) { clearInterval(timerRef.current); setExIdx(i => i + 1); setPhase('exercise'); setExerciseTimer(30); return 0; } return t - 1; }), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [view, phase, paused, exIdx]);

  const saveSession = async () => {
    setSaving(true);
    try {
      await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: selectedWorkout?.title || 'Workout', exercises_completed: completedCount, duration: sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0, calories: Math.round(totalCals), body_part: selectedWorkout?.category || 'full_body', level: selectedWorkout?.level?.toLowerCase() || 'beginner' }) });
    } catch {}
    setSaving(false);
    setSelectedWorkout(null);
    setView('browse');
  };

  /* Search view */
  if (view === 'search') {
    return <SearchView onBack={() => setView('browse')} onOpenWorkout={(w) => { setSelectedWorkout(w); setView('detail'); }} />;
  }

  /* History view */
  if (view === 'history') {
    return <HistoryView onBack={() => setView('browse')} />;
  }

  /* Session view */
  if (view === 'session' && selectedWorkout) {
    const totalDuration = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
    const totalMin = Math.floor(totalDuration / 60);
    const totalSec = totalDuration % 60;
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0F172A,#1E293B)', color: '#fff' }}>
        {phase === 'countdown' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24 }}>
            <div style={{ fontSize: 52 }}>🏁</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{selectedWorkout.title}</div>
            <CountdownRing value={countdown} max={5} color="#F97316" />
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{exercises.length} exercises · {selectedWorkout.level}</div>
            <button onClick={() => { clearInterval(timerRef.current); setPhase('exercise'); setExerciseTimer(30); }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#94A3B8', padding: '10px 24px', borderRadius: 12, fontSize: 14, cursor: 'pointer' }}>Skip Countdown</button>
            <button onClick={goBack} style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: 13, cursor: 'pointer' }}>← Back</button>
          </div>
        )}
        {(phase === 'exercise' || phase === 'rest') && currentExercise && (
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <button onClick={goBack} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: 12, fontSize: 18, cursor: 'pointer' }}>✕</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>{phase === 'rest' ? 'Rest' : `${exIdx + 1} / ${exercises.length}`}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedWorkout.title}</div>
              </div>
              <button onClick={() => setPaused(p => !p)} style={{ background: paused ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: 12, fontSize: 18, cursor: 'pointer' }}>{paused ? '▶' : '⏸'}</button>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
              {exercises.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < exIdx ? '#10B981' : i === exIdx ? '#2563EB' : 'rgba(255,255,255,0.12)', transition: 'background 0.3s' }} />)}
            </div>
            {phase === 'rest' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                <div style={{ fontSize: 48 }}>😤</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>Rest</div>
                <CountdownRing value={restTimer} max={15} color="#10B981" />
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Next: <strong style={{ color: '#fff' }}>{exercises[exIdx + 1]?.name || 'Finish'}</strong></div>
                <button onClick={() => { clearInterval(timerRef.current); setExIdx(i => i + 1); setPhase('exercise'); setExerciseTimer(30); }} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '12px 28px', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Skip Rest →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <div style={{ width: 128, height: 128, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>🏋️</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{currentExercise.name}</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 99, fontSize: 13 }}>🎯 {currentExercise.reps} reps</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 99, fontSize: 13 }}>🔥 ~{currentExercise.cals} cal</span>
                  </div>
                </div>
                <CountdownRing value={exerciseTimer} max={30} color="#2563EB" />
                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                  <button onClick={skipExercise} style={{ flex: 1, padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Skip ›</button>
                  <button onClick={markDone} style={{ flex: 2, padding: 14, borderRadius: 16, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>✓ Done</button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 14, marginTop: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16 }}>
              {[{ label: 'Calories', value: `${Math.round(totalCals)}`, icon: '🔥' }, { label: 'Done', value: `${completedCount}/${exercises.length}`, icon: '✅' }, { label: 'Time', value: `${totalMin}:${String(totalSec).padStart(2, '0')}`, icon: '⏱' }].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {phase === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24, padding: 28 }}>
            <div style={{ fontSize: 72 }}>🏆</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>Workout Complete!</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 380 }}>
              {[{ icon: '🔥', label: 'Calories', value: `${Math.round(totalCals)} kcal`, color: '#F97316' }, { icon: '✅', label: 'Exercises', value: `${completedCount}`, color: '#10B981' }, { icon: '💪', label: 'Total Reps', value: `${totalReps}`, color: '#7C3AED' }, { icon: '⏱', label: 'Duration', value: sessionStart ? `${Math.floor((Date.now() - sessionStart) / 60000)} min` : '—', color: '#2563EB' }].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 16px', textAlign: 'center', border: `1px solid ${s.color}30` }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 380 }}>
              <button onClick={() => { setSelectedWorkout(null); setView('browse'); }} style={{ flex: 1, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#64748B', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Browse</button>
              <button onClick={saveSession} disabled={saving} style={{ flex: 2, padding: 16, borderRadius: 16, background: saving ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg,#2563EB,#7C3AED)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : '💾 Save Session'}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* Detail view */
  if (view === 'detail' && selectedWorkout) {
    const catColor = CAT_COLORS[selectedWorkout.category] || '#2563EB';
    const levelColor = LEVEL_COLORS[selectedWorkout.level] || '#10B981';
    const totalCalsPreview = selectedWorkout.exercises.reduce((s, e) => s + (e.cals || 0), 0);
    return (
      <div style={{ animation: 'fadeIn 0.3s ease', background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
          <img src={selectedWorkout.image} alt={selectedWorkout.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg,transparent 20%,${catColor}99)` }} />
          <button onClick={goBack} style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: 'none', color: '#fff', width: 42, height: 42, borderRadius: 12, fontSize: 18, cursor: 'pointer' }}>←</button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 28px 28px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, color: '#fff' }}>{selectedWorkout.category}</span>
              <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: `${levelColor}cc`, color: '#fff' }}>{selectedWorkout.level}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{selectedWorkout.title}</div>
          </div>
        </div>
        <div style={{ padding: '24px 28px', maxWidth: 800 }}>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{selectedWorkout.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
            {[{ icon: '⏱', label: 'Duration', value: `${selectedWorkout.duration} min` }, { icon: '💪', label: 'Exercises', value: selectedWorkout.exercises.length }, { icon: '🔥', label: 'Est. Cal', value: `~${totalCalsPreview}` }, { icon: '📊', label: 'Level', value: selectedWorkout.level }].map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 12, padding: '16px 12px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Exercise List</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {selectedWorkout.exercises.map((ex, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--border-light)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${catColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: catColor, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{ex.reps} reps · ~{ex.cals} cal</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={startWorkout} style={{ width: '100%', padding: 18, borderRadius: 14, background: `linear-gradient(135deg,${catColor},#7C3AED)`, border: 'none', color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer', boxShadow: `0 12px 36px ${catColor}40` }}>▶ Start Workout</button>
        </div>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  /* ── Browse view ── */
  const hero = WORKOUT_CATALOG.find(w => w.id === 5);
  const picks = [WORKOUT_CATALOG.find(w => w.id === 2), WORKOUT_CATALOG.find(w => w.id === 9)].filter(Boolean);
  const beginners = WORKOUT_CATALOG.filter(w => w.level === 'Beginner');
  const challenges = WORKOUT_CATALOG.filter(w => w.level === 'Advanced');
  const stretchRecovery = WORKOUT_CATALOG.filter(w => w.category === 'yoga' || w.category === 'rehab');
  const banner = WORKOUT_CATALOG.find(w => w.id === 6);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 40 }}>

      {/* ── DISCOVER Header: title left, icons right ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 20px' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em' }}>DISCOVER</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Search icon */}
          <button onClick={() => setView('search')}
            style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20 }}
            title="Search">
            🔍
          </button>
          {/* History (clock) icon */}
          <button onClick={() => setView('history')}
            style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20 }}
            title="History">
            🕐
          </button>
        </div>
      </div>

      {/* ── Hero banner ── */}
      {hero && (
        <div style={{ padding: '0 24px', marginBottom: 28 }}>
          <button onClick={() => openDetail(hero)}
            style={{ position: 'relative', width: '100%', height: 220, borderRadius: 22, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, display: 'block', boxShadow: '0 8px 28px rgba(0,0,0,0.14)', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src={hero.image} alt={hero.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 8 }}>{hero.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 16 }}>Only simple exercises — takes just {hero.duration} min a day! Burn fat fast.</div>
              <div style={{ background: '#fff', color: '#0F172A', padding: '10px 24px', borderRadius: 99, fontSize: 14, fontWeight: 800 }}>{t.startNow}</div>
            </div>
          </button>
        </div>
      )}

      {/* ── Picks for You ── */}
      <Section label={t.picksForYou} sub={`${picks.length} ${picks.length !== 1 ? t.workoutsLabelP : t.workoutsLabel}`} pad>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {picks.map(w => <PickRow key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
        </div>
      </Section>

      {/* ── "Stay active" banner ── */}
      {banner && (
        <div style={{ padding: '0 24px', marginBottom: 28 }}>
          <button onClick={() => openDetail(banner)}
            style={{ position: 'relative', width: '100%', height: 140, borderRadius: 20, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, display: 'block', boxShadow: '0 8px 28px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src={banner.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.38)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(30,64,175,0.85),rgba(124,58,237,0.7))' }} />
            <div style={{ position: 'absolute', inset: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 4 }}>{t.stayActive.split('\n').map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{WORKOUT_CATALOG.filter(w => w.level === 'Intermediate').length} workouts</div>
            </div>
          </button>
        </div>
      )}

      {/* ── For Beginners ── */}
      <Section label={t.forBeginners} pad={false}>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 6 }} className="hide-scroll">
          {beginners.map(w => <HScrollCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
        </div>
      </Section>

      {/* ── Challenges ── */}
      <Section label={`${t.challengesLabel} 🔥`} pad={false}>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 6 }} className="hide-scroll">
          {challenges.map(w => <ChallengeCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
        </div>
      </Section>

      {/* ── Stretch & Recovery ── */}
      <Section label={`${t.stretchRecovery} 🧘`} pad={false}>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 6 }} className="hide-scroll">
          {stretchRecovery.map(w => <HScrollCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
        </div>
      </Section>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ─── SECTION HELPER ────────────────────────────────────────────────── */
function Section({ label, sub, pad, children }) {
  return (
    <div style={{ marginBottom: 28, ...(pad ? { padding: '0 24px' } : {}) }}>
      <div style={{ padding: pad ? 0 : '0 24px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

/* ─── CARD SUB-COMPONENTS ───────────────────────────────────────────── */
function PickRow({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#2563EB';
  const isHovered = hovered === `pick-${workout.id}`;
  return (
    <button onClick={() => onOpen(workout)} onMouseEnter={() => setHovered(`pick-${workout.id}`)} onMouseLeave={() => setHovered(null)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, background: isHovered ? 'var(--surface-2)' : 'var(--surface)', borderRadius: 16, padding: '12px 14px', border: `1.5px solid ${isHovered ? catColor : 'var(--border-light)'}`, cursor: 'pointer', textAlign: 'left', outline: 'none', transition: 'all 0.18s ease', boxShadow: isHovered ? `0 6px 20px ${catColor}20` : 'var(--shadow-sm)' }}>
      <div style={{ width: 70, height: 70, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
        <img src={workout.image} alt={workout.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{workout.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{workout.duration} min · {workout.level}</div>
      </div>
      <span style={{ fontSize: 20, color: isHovered ? catColor : 'var(--text-tertiary)' }}>›</span>
    </button>
  );
}

function HScrollCard({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#2563EB';
  const isHovered = hovered === `hsc-${workout.id}`;
  return (
    <button onClick={() => onOpen(workout)} onMouseEnter={() => setHovered(`hsc-${workout.id}`)} onMouseLeave={() => setHovered(null)}
      style={{ position: 'relative', width: 180, height: 200, flexShrink: 0, borderRadius: 18, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, transform: isHovered ? 'translateY(-4px)' : 'translateY(0)', transition: 'all 0.2s ease', boxShadow: isHovered ? `0 14px 36px ${catColor}30` : '0 2px 10px rgba(0,0,0,0.09)' }}>
      <img src={workout.image} alt={workout.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${catColor}dd 0%, transparent 60%)` }} />
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>{workout.duration}m</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>{workout.title}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{workout.exercises.length} exercises</div>
      </div>
    </button>
  );
}

function ChallengeCard({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#EF4444';
  const isHovered = hovered === `ch-${workout.id}`;
  return (
    <button onClick={() => onOpen(workout)} onMouseEnter={() => setHovered(`ch-${workout.id}`)} onMouseLeave={() => setHovered(null)}
      style={{ position: 'relative', width: 220, height: 170, flexShrink: 0, borderRadius: 18, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)', transition: 'all 0.2s ease', boxShadow: isHovered ? '0 16px 40px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)' }}>
      <img src={workout.image} alt={workout.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${catColor}aa, #0F172Acc)` }} />
      <div style={{ position: 'absolute', inset: 0, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ background: '#EF4444', color: '#fff', padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 800 }}>🔥 ADVANCED</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>{workout.duration}m</span>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>{workout.title}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{workout.exercises.length} exercises</div>
        </div>
      </div>
    </button>
  );
}
