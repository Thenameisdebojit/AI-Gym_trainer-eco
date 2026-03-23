'use client';
import { useState, useEffect } from 'react';
import WorkoutCard from '../components/cards/WorkoutCard';
import BannerCard from '../components/cards/BannerCard';
import ProgressBar from '../components/ui/ProgressBar';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';

const BODY_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Abs', value: 'cardio' },
  { label: 'Arm', value: 'gym' },
  { label: 'Chest', value: 'calisthenics' },
  { label: 'Leg', value: 'bodyweight' },
  { label: 'Yoga', value: 'yoga' },
  { label: 'Rehab', value: 'rehab' },
];

const SAMPLE_WORKOUTS = [
  { id: 1, title: 'Full Body Blast', level: 'Beginner', domain: 'gym', duration: 20, exercises: 8 },
  { id: 2, title: 'HIIT Cardio', level: 'Intermediate', domain: 'cardio', duration: 25, exercises: 10 },
  { id: 3, title: 'Yoga Flow', level: 'Beginner', domain: 'yoga', duration: 30, exercises: 12 },
  { id: 4, title: 'Calisthenics Power', level: 'Advanced', domain: 'calisthenics', duration: 40, exercises: 15 },
  { id: 5, title: 'Core & Abs', level: 'Intermediate', domain: 'cardio', duration: 15, exercises: 6 },
  { id: 6, title: 'Strength Builder', level: 'Advanced', domain: 'gym', duration: 50, exercises: 12 },
];

const RECENT_WORKOUTS = [
  { id: 7, title: 'Morning Stretch', level: 'Beginner', domain: 'yoga', duration: 15, exercises: 5 },
  { id: 8, title: 'Push Day', level: 'Intermediate', domain: 'gym', duration: 35, exercises: 9 },
  { id: 9, title: 'Leg Day', level: 'Advanced', domain: 'bodyweight', duration: 30, exercises: 8 },
];

function SectionHeader({ title, onSeeAll }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
      <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
      {onSeeAll && (
        <button onClick={onSeeAll} style={{
          background: 'none', border: 'none', color: 'var(--primary)',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}>
          See all →
        </button>
      )}
    </div>
  );
}

export default function Training() {
  const [bodyTab, setBodyTab] = useState('all');
  const [exercises, setExercises] = useState([]);
  const [stats, setStats] = useState(null);
  const [genGoal, setGenGoal] = useState('muscle_gain');
  const [genEquip, setGenEquip] = useState('none');
  const [genLevel, setGenLevel] = useState('beginner');
  const [genResult, setGenResult] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    fetch('/api/workout/stats').then(r => r.json()).then(d => setStats(d)).catch(() => {});
    fetch('/api/recommendations').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setExercises(d.slice(0, 12));
    }).catch(() => {});
  }, []);

  const filtered = bodyTab === 'all' ? SAMPLE_WORKOUTS
    : SAMPLE_WORKOUTS.filter(w => w.domain === bodyTab);

  const generateWorkout = async () => {
    setGenLoading(true);
    try {
      const res = await fetch('/api/workout/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: genGoal, equipment: genEquip, level: genLevel, duration: 30 }),
      });
      const data = await res.json();
      setGenResult(data);
    } catch {
      setGenResult(null);
    }
    setGenLoading(false);
  };

  const currentDay = 6;
  const totalDays = 30;

  return (
    <div style={{ padding: '24px 28px', maxWidth: '960px', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          Good morning 👋
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Training
        </h1>
      </div>

      {/* Current Plan Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #7C3AED 100%)',
        borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: '28px',
        boxShadow: '0 12px 40px rgba(37,99,235,0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Current Plan
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              Day {currentDay} of {totalDays}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
              🔥 {streak} day streak · Keep it up!
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius)', padding: '12px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
              {Math.round((currentDay / totalDays) * 100)}%
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>complete</div>
          </div>
        </div>
        <ProgressBar value={currentDay} max={totalDays} color="rgba(255,255,255,0.9)" height={6} />
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="white" size="sm">▶ Continue Workout</Button>
          <Button variant="ghost" size="sm" style={{ color: 'rgba(255,255,255,0.8)' }}>View Plan</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { icon: '🏋️', label: 'Total Reps', value: stats?.total_reps ?? '—' },
          { icon: '🔥', label: 'Calories', value: stats?.calories_burned ? Math.round(stats.calories_burned) : '—' },
          { icon: '✅', label: 'Workouts', value: stats?.total_workouts ?? '—' },
          { icon: '🎯', label: 'Avg Score', value: stats?.avg_score ? `${Math.round(stats.avg_score)}%` : '—' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: '1 1 100px', background: 'var(--surface)', borderRadius: 'var(--radius)',
            padding: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '2px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Body Focus Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <SectionHeader title="Browse Workouts" />
        <Tabs tabs={BODY_TABS} value={bodyTab} onChange={setBodyTab} style={{ marginBottom: '20px' }} />
        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '6px' }} className="hide-scroll">
          {filtered.map(w => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </div>
      </div>

      {/* Smart Generator */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', marginBottom: '28px', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px', height: '42px', background: 'var(--primary-50)',
            borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px',
          }}>⚡</div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>Smart Workout Generator</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>AI-powered personalized plans</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '18px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>GOAL</label>
            <select value={genGoal} onChange={e => setGenGoal(e.target.value)} style={{
              width: '100%', padding: '10px 12px', borderRadius: 'var(--radius)',
              border: '1.5px solid var(--border)', fontSize: '13px', fontWeight: 500,
              color: 'var(--text)', background: 'var(--surface-2)', cursor: 'pointer',
            }}>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="fat_loss">Fat Loss</option>
              <option value="flexibility">Flexibility</option>
              <option value="mma">MMA / Martial Arts</option>
              <option value="general">General Fitness</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>EQUIPMENT</label>
            <select value={genEquip} onChange={e => setGenEquip(e.target.value)} style={{
              width: '100%', padding: '10px 12px', borderRadius: 'var(--radius)',
              border: '1.5px solid var(--border)', fontSize: '13px', fontWeight: 500,
              color: 'var(--text)', background: 'var(--surface-2)', cursor: 'pointer',
            }}>
              <option value="none">No Equipment</option>
              <option value="minimal">Minimal</option>
              <option value="full_gym">Full Gym</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>LEVEL</label>
            <select value={genLevel} onChange={e => setGenLevel(e.target.value)} style={{
              width: '100%', padding: '10px 12px', borderRadius: 'var(--radius)',
              border: '1.5px solid var(--border)', fontSize: '13px', fontWeight: 500,
              color: 'var(--text)', background: 'var(--surface-2)', cursor: 'pointer',
            }}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <Button variant="primary" size="md" loading={genLoading} onClick={generateWorkout} icon="⚡">
          Generate My Workout
        </Button>
        {genResult && genResult.exercises && (
          <div style={{ marginTop: '20px', padding: '18px', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>
              ✅ Your Personalized Plan ({genResult.exercises?.length} exercises)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {genResult.exercises?.slice(0, 6).map((ex, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: '#fff', borderRadius: 'var(--radius)',
                  padding: '10px 14px', boxShadow: 'var(--shadow-sm)',
                }}>
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    {ex.name || ex.exercise}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {ex.sets} × {ex.reps}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    ~{ex.calories} cal
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Workouts */}
      <div style={{ marginBottom: '28px' }}>
        <SectionHeader title="Recent Workouts" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {RECENT_WORKOUTS.map(w => (
            <WorkoutCard key={w.id} workout={w} compact />
          ))}
        </div>
      </div>

      {/* With Equipment */}
      <div style={{ marginBottom: '28px' }}>
        <SectionHeader title="With Equipment" />
        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '6px' }} className="hide-scroll">
          {SAMPLE_WORKOUTS.filter(w => w.domain === 'gym').map(w => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </div>
      </div>

      {/* 15+ min */}
      <div style={{ marginBottom: '28px' }}>
        <SectionHeader title="> 15 min Workouts" />
        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '6px' }} className="hide-scroll">
          {SAMPLE_WORKOUTS.filter(w => w.duration > 15).map(w => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </div>
      </div>
    </div>
  );
}
