'use client';
import { useState, useEffect, useMemo } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '⚡', color: '#2563EB' },
  { id: 'gym', label: 'Gym', icon: '🏋️', color: '#1D4ED8' },
  { id: 'cardio', label: 'Cardio', icon: '🏃', color: '#DC2626' },
  { id: 'yoga', label: 'Yoga', icon: '🧘', color: '#0891B2' },
  { id: 'calisthenics', label: 'Calisthenics', icon: '🤸', color: '#065F46' },
  { id: 'martial arts', label: 'Martial Arts', icon: '🥊', color: '#92400E' },
  { id: 'rehab', label: 'Rehab', icon: '♿', color: '#5B21B6' },
  { id: 'bodyweight', label: 'Bodyweight', icon: '💪', color: '#1E40AF' },
];

const WORKOUT_CATALOG = [
  { id: 1, title: 'Full Body Blast', category: 'gym', duration: 40, exercises: 8, level: 'Intermediate', desc: 'Complete full-body strength circuit with compound movements' },
  { id: 2, title: 'HIIT Cardio Burn', category: 'cardio', duration: 25, exercises: 10, level: 'Intermediate', desc: 'High-intensity intervals that torch calories fast' },
  { id: 3, title: 'Morning Yoga Flow', category: 'yoga', duration: 30, exercises: 12, level: 'Beginner', desc: 'Energizing yoga sequence to start your day right' },
  { id: 4, title: 'Calisthenics Power', category: 'calisthenics', duration: 45, exercises: 10, level: 'Advanced', desc: 'Bodyweight mastery — push, pull, and core strength' },
  { id: 5, title: '7-Minute Abs', category: 'cardio', duration: 7, exercises: 7, level: 'Intermediate', desc: 'Science-backed core routine for visible abs' },
  { id: 6, title: 'Strength Builder', category: 'gym', duration: 55, exercises: 12, level: 'Advanced', desc: 'Progressive overload program for maximum hypertrophy' },
  { id: 7, title: 'Gentle Morning Stretch', category: 'yoga', duration: 15, exercises: 8, level: 'Beginner', desc: 'Easy flexibility work for all ages' },
  { id: 8, title: 'Push Day Classic', category: 'gym', duration: 50, exercises: 9, level: 'Intermediate', desc: 'Chest, shoulders, and triceps complete session' },
  { id: 9, title: 'Bodyweight Only', category: 'bodyweight', duration: 30, exercises: 8, level: 'Beginner', desc: 'No equipment needed — full workout anywhere' },
  { id: 10, title: 'Sprint Intervals', category: 'cardio', duration: 20, exercises: 6, level: 'Advanced', desc: 'Explosive sprinting protocol for peak performance' },
  { id: 11, title: 'Pull Day Classic', category: 'gym', duration: 45, exercises: 11, level: 'Intermediate', desc: 'Back and bicep focused mass builder' },
  { id: 12, title: 'First Push-Up', category: 'bodyweight', duration: 20, exercises: 6, level: 'Beginner', desc: 'Learn correct form from zero' },
  { id: 13, title: 'Power Flow', category: 'yoga', duration: 40, exercises: 14, level: 'Intermediate', desc: 'Dynamic yoga linking strength and flexibility' },
  { id: 14, title: 'Leg Day Destroyer', category: 'gym', duration: 60, exercises: 9, level: 'Advanced', desc: 'Quad, hamstring, and glute annihilation' },
  { id: 15, title: '100 Burpee Challenge', category: 'cardio', duration: 30, exercises: 3, level: 'Advanced', desc: 'Mental and physical toughness test' },
  { id: 16, title: 'Muscle-Up Mastery', category: 'calisthenics', duration: 40, exercises: 7, level: 'Advanced', desc: 'Progress to your first muscle-up' },
  { id: 17, title: 'Rehab Shoulder', category: 'rehab', duration: 20, exercises: 8, level: 'Beginner', desc: 'Safe shoulder rehabilitation and strengthening' },
  { id: 18, title: 'Muay Thai Basics', category: 'martial arts', duration: 30, exercises: 10, level: 'Beginner', desc: 'Punches, kicks, and conditioning fundamentals' },
  { id: 19, title: 'Barbell Strength', category: 'gym', duration: 50, exercises: 10, level: 'Intermediate', desc: 'Classic barbell compound movements' },
  { id: 20, title: 'Core Stability', category: 'bodyweight', duration: 20, exercises: 8, level: 'Beginner', desc: 'Foundation core work for all athletes' },
  { id: 21, title: 'Express Cardio', category: 'cardio', duration: 10, exercises: 5, level: 'Beginner', desc: 'Quick 10-minute calorie burner' },
  { id: 22, title: 'Knee Rehab', category: 'rehab', duration: 25, exercises: 7, level: 'Beginner', desc: 'Evidence-based knee injury recovery' },
  { id: 23, title: 'MMA Conditioning', category: 'martial arts', duration: 45, exercises: 12, level: 'Intermediate', desc: 'Fight-ready cardio and strength conditioning' },
  { id: 24, title: 'Dumbbell Full Body', category: 'gym', duration: 35, exercises: 11, level: 'Beginner', desc: 'Versatile dumbbell program for home or gym' },
];

const LEVEL_COLORS = { Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444' };

function WorkoutCard({ workout, onClick }) {
  const cat = CATEGORIES.find(c => c.id === workout.category) || CATEGORIES[0];
  const gradients = {
    gym: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
    cardio: 'linear-gradient(135deg, #DC2626, #F97316)',
    yoga: 'linear-gradient(135deg, #0891B2, #06B6D4)',
    calisthenics: 'linear-gradient(135deg, #065F46, #10B981)',
    'martial arts': 'linear-gradient(135deg, #92400E, #F59E0B)',
    rehab: 'linear-gradient(135deg, #5B21B6, #8B5CF6)',
    bodyweight: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
  };
  return (
    <div onClick={() => onClick?.(workout)} style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)', overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)', cursor: 'pointer', minWidth: '200px', maxWidth: '220px',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease', flexShrink: 0,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      <div style={{
        height: '90px', background: gradients[workout.category] || 'linear-gradient(135deg, #2563EB, #7C3AED)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
        position: 'relative',
      }}>
        {cat.icon}
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
          borderRadius: '99px', padding: '3px 10px',
          fontSize: '11px', fontWeight: 700, color: '#fff',
        }}>{workout.duration} min</div>
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', lineHeight: 1.3 }}>{workout.title}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>{workout.desc}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '99px',
            background: `${LEVEL_COLORS[workout.level]}15`, color: LEVEL_COLORS[workout.level],
          }}>{workout.level}</span>
          <span style={{
            fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '99px',
            background: 'var(--primary-50)', color: 'var(--primary)',
          }}>{workout.exercises} exercises</span>
        </div>
      </div>
    </div>
  );
}

function WorkoutModal({ workout, onClose }) {
  if (!workout) return null;
  const cat = CATEGORIES.find(c => c.id === workout.category) || CATEGORIES[0];
  const gradients = {
    gym: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
    cardio: 'linear-gradient(135deg, #DC2626, #F97316)',
    yoga: 'linear-gradient(135deg, #0891B2, #06B6D4)',
    calisthenics: 'linear-gradient(135deg, #065F46, #10B981)',
    'martial arts': 'linear-gradient(135deg, #92400E, #F59E0B)',
    rehab: 'linear-gradient(135deg, #5B21B6, #8B5CF6)',
    bodyweight: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
  };
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        maxWidth: '420px', width: '100%', overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          height: '120px', background: gradients[workout.category] || 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px',
          position: 'relative',
        }}>
          {cat.icon}
          <button onClick={onClose} style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>{workout.title}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>{workout.desc}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Duration', value: `${workout.duration} min`, icon: '⏱' },
              { label: 'Exercises', value: workout.exercises, icon: '💪' },
              { label: 'Level', value: workout.level, icon: '🎯' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '12px',
                textAlign: 'center', border: '1px solid var(--border-light)',
              }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{
            background: 'var(--primary-50)', borderRadius: 'var(--radius)',
            padding: '12px', marginBottom: '16px',
            fontSize: '13px', color: 'var(--primary)', fontWeight: 500,
            border: '1px solid rgba(37,99,235,0.15)',
          }}>
            💡 Select this workout in the Training tab to start a live session with countdown timer and exercise tracking.
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiExerciseCard({ exercise }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '14px 16px',
      border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
      display: 'flex', alignItems: 'center', gap: '12px',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: 'var(--radius)',
        background: 'var(--primary-50)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '20px', flexShrink: 0,
      }}>💪</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {exercise.name || exercise.exercise || 'Exercise'}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {exercise.sets && `${exercise.sets} sets · `}{exercise.reps && `${exercise.reps} reps`}
          {exercise.domain && ` · ${exercise.domain}`}
        </div>
      </div>
      {exercise.calories && (
        <div style={{
          fontSize: '12px', fontWeight: 600, color: '#F97316',
          background: '#FFF7ED', padding: '4px 8px', borderRadius: '8px',
        }}>~{exercise.calories} cal</div>
      )}
    </div>
  );
}

export default function Discover() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [apiExercises, setApiExercises] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    setApiLoading(true);
    fetch('/api/recommendations')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setApiExercises(d); })
      .catch(() => {})
      .finally(() => setApiLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let results = WORKOUT_CATALOG;
    if (category !== 'all') results = results.filter(w => w.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.desc.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.level.toLowerCase().includes(q)
      );
    }
    return results;
  }, [search, category]);

  const filteredApiExercises = useMemo(() => {
    if (!search.trim()) return apiExercises.slice(0, 6);
    const q = search.toLowerCase();
    return apiExercises.filter(ex =>
      (ex.name || ex.exercise || '').toLowerCase().includes(q) ||
      (ex.domain || '').toLowerCase().includes(q)
    ).slice(0, 12);
  }, [search, apiExercises]);

  const sections = [
    { key: 'picks', label: "Editor's Picks", filter: w => w.id <= 4 },
    { key: 'fast', label: 'Quick Workouts (< 15 min)', filter: w => w.duration <= 15 },
    { key: 'beginner', label: 'Great for Beginners', filter: w => w.level === 'Beginner' },
    { key: 'advanced', label: 'Advanced Challenges', filter: w => w.level === 'Advanced' },
  ];

  return (
    <div style={{ padding: '24px 28px', maxWidth: '960px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          Explore workouts
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Discover</h1>
      </div>

      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search workouts, exercises, categories…"
          style={{
            width: '100%', padding: '14px 14px 14px 42px',
            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
            fontSize: '14px', color: 'var(--text)', background: 'var(--surface)',
            boxShadow: 'var(--shadow-sm)', outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'var(--surface-2)', border: 'none', borderRadius: '50%',
            width: '24px', height: '24px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)',
          }}>✕</button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '24px' }} className="hide-scroll">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{
            padding: '8px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: 600,
            border: category === c.id ? `2px solid ${c.color}` : '1.5px solid var(--border)',
            background: category === c.id ? `${c.color}15` : 'var(--surface)',
            color: category === c.id ? c.color : 'var(--text-secondary)',
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s ease',
          }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {(search || category !== 'all') ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {search ? ` for "${search}"` : ''}
              {category !== 'all' ? ` in ${CATEGORIES.find(c => c.id === category)?.label}` : ''}
            </h3>
            {(search || category !== 'all') && (
              <button onClick={() => { setSearch(''); setCategory('all'); }} style={{
                background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}>Clear filters</button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>No workouts found</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Try a different search term or category</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {filtered.map(w => (
                <WorkoutCard key={w.id} workout={w} onClick={setSelectedWorkout} />
              ))}
            </div>
          )}

          {filteredApiExercises.length > 0 && search && (
            <div style={{ marginTop: '28px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>
                🤖 AI Recommended Exercises
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredApiExercises.map((ex, i) => <ApiExerciseCard key={i} exercise={ex} />)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {sections.map(sec => {
            const items = WORKOUT_CATALOG.filter(sec.filter);
            if (!items.length) return null;
            return (
              <div key={sec.key} style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>{sec.label}</h3>
                <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '6px' }} className="hide-scroll">
                  {items.map(w => <WorkoutCard key={w.id} workout={w} onClick={setSelectedWorkout} />)}
                </div>
              </div>
            );
          })}

          {!apiLoading && apiExercises.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>
                🤖 AI Personalized Exercises
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                {apiExercises.slice(0, 6).map((ex, i) => <ApiExerciseCard key={i} exercise={ex} />)}
              </div>
            </div>
          )}
          {apiLoading && (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Loading AI recommendations…
            </div>
          )}
        </div>
      )}

      {selectedWorkout && <WorkoutModal workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />}
    </div>
  );
}
