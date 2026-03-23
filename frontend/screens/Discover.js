'use client';
import { useState, useEffect } from 'react';
import WorkoutCard from '../components/cards/WorkoutCard';
import BannerCard from '../components/cards/BannerCard';

const CATEGORIES = [
  { id: 'gym', label: 'Gym', icon: '🏋️', color: 'linear-gradient(135deg, #1D4ED8, #7C3AED)' },
  { id: 'cardio', label: 'Cardio', icon: '🏃', color: 'linear-gradient(135deg, #DC2626, #F97316)' },
  { id: 'yoga', label: 'Yoga', icon: '🧘', color: 'linear-gradient(135deg, #0891B2, #06B6D4)' },
  { id: 'calisthenics', label: 'Calisthenics', icon: '🤸', color: 'linear-gradient(135deg, #065F46, #10B981)' },
  { id: 'martial arts', label: 'Martial Arts', icon: '🥊', color: 'linear-gradient(135deg, #92400E, #F59E0B)' },
  { id: 'rehab', label: 'Rehab', icon: '♿', color: 'linear-gradient(135deg, #5B21B6, #8B5CF6)' },
  { id: 'bodyweight', label: 'Bodyweight', icon: '💪', color: 'linear-gradient(135deg, #1E40AF, #3B82F6)' },
];

const PICKS = [
  { id: 10, title: 'Morning Power Flow', level: 'Beginner', domain: 'yoga', duration: 20, exercises: 8 },
  { id: 11, title: 'Sprint Intervals', level: 'Advanced', domain: 'cardio', duration: 15, exercises: 6 },
  { id: 12, title: 'Pull Day Classic', level: 'Intermediate', domain: 'gym', duration: 45, exercises: 11 },
];
const BEGINNERS = [
  { id: 13, title: 'Gentle Start', level: 'Beginner', domain: 'yoga', duration: 15, exercises: 5 },
  { id: 14, title: 'First Push-Up', level: 'Beginner', domain: 'bodyweight', duration: 20, exercises: 7 },
  { id: 15, title: 'Easy Cardio', level: 'Beginner', domain: 'cardio', duration: 20, exercises: 6 },
];
const FAST = [
  { id: 16, title: '7-Minute Abs', level: 'Intermediate', domain: 'cardio', duration: 7, exercises: 7 },
  { id: 17, title: 'Quick Arms', level: 'Intermediate', domain: 'gym', duration: 10, exercises: 5 },
  { id: 18, title: 'Express Cardio', level: 'Beginner', domain: 'cardio', duration: 10, exercises: 5 },
];
const CHALLENGE = [
  { id: 19, title: '100 Burpee Challenge', level: 'Advanced', domain: 'cardio', duration: 30, exercises: 3 },
  { id: 20, title: 'Muscle-Up Mastery', level: 'Advanced', domain: 'calisthenics', duration: 40, exercises: 8 },
];
const EQUIPMENT = [
  { id: 21, title: 'Barbell Strength', level: 'Intermediate', domain: 'gym', duration: 50, exercises: 10 },
  { id: 22, title: 'Dumbbell Full Body', level: 'Beginner', domain: 'gym', duration: 35, exercises: 12 },
  { id: 23, title: 'Cable Machine Focus', level: 'Advanced', domain: 'gym', duration: 40, exercises: 9 },
];

function SectionHeader({ title }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
    </div>
  );
}

function HScroll({ items }) {
  return (
    <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '6px' }} className="hide-scroll">
      {items.map(w => <WorkoutCard key={w.id} workout={w} />)}
    </div>
  );
}

export default function Discover() {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    if (search.length < 2 && !selectedCat) return;
    setLoading(true);
    const domain = selectedCat || '';
    fetch(`/api/exercises${domain ? `?domain=${domain}` : ''}`)
      .then(r => r.json())
      .then(d => { setExercises(Array.isArray(d) ? d.slice(0, 20) : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, selectedCat]);

  const filtered = search
    ? exercises.filter(e => e.name?.toLowerCase().includes(search.toLowerCase()) || e.muscle?.toLowerCase().includes(search.toLowerCase()))
    : exercises;

  return (
    <div style={{ padding: '24px 28px', maxWidth: '960px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          Explore everything
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Discover
        </h1>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '28px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search exercises, muscles, goals..."
          style={{
            width: '100%', padding: '13px 16px 13px 42px',
            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
            fontSize: '14px', color: 'var(--text)', background: 'var(--surface)',
            boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Hero Banner */}
      <div style={{ marginBottom: '28px' }}>
        <BannerCard
          title="30-Day Transformation Challenge"
          subtitle="Designed for all levels"
          description="Build strength, burn fat, and unlock your true potential in just 30 days of guided training."
          badge="🏆 Featured Challenge"
          icon="🏆"
          gradient="linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)"
          cta="Join Challenge"
          tall
        />
      </div>

      {/* Categories */}
      <div style={{ marginBottom: '28px' }}>
        <SectionHeader title="Explore Categories" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
              style={{
                background: selectedCat === cat.id ? cat.color : 'var(--surface)',
                border: selectedCat === cat.id ? 'none' : '1.5px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '18px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: selectedCat === cat.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transform: selectedCat === cat.id ? 'translateY(-2px)' : 'none',
              }}
            >
              <span style={{ fontSize: '28px' }}>{cat.icon}</span>
              <span style={{
                fontSize: '12px', fontWeight: 600,
                color: selectedCat === cat.id ? '#fff' : 'var(--text)',
              }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search / Category Results */}
      {(search || selectedCat) && (
        <div style={{ marginBottom: '28px', animation: 'fadeIn 0.3s ease' }}>
          <SectionHeader title={selectedCat ? `${CATEGORIES.find(c => c.id === selectedCat)?.label} Exercises` : `Results for "${search}"`} />
          {loading ? (
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: '72px', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((ex, i) => (
                <div key={i} style={{
                  background: 'var(--surface)', borderRadius: 'var(--radius-md)',
                  padding: '14px 18px', border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '14px',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: 'var(--radius)',
                    background: 'var(--primary-50)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                  }}>
                    {CATEGORIES.find(c => c.id === (ex.domain || '').toLowerCase())?.icon || '💪'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>{ex.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {ex.muscle} · {ex.domain} · {ex.level}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: 600, padding: '4px 10px',
                    borderRadius: '99px', background: 'var(--primary-50)', color: 'var(--primary)',
                  }}>
                    {ex.met} MET
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '40px', color: 'var(--text-secondary)',
              background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)',
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>No results found</div>
              <div style={{ fontSize: '13px' }}>Try a different keyword or category</div>
            </div>
          )}
        </div>
      )}

      {!search && !selectedCat && (
        <>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <BannerCard title="Build Muscle" subtitle="Gym & Weights" icon="🏋️"
                gradient="linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)" cta="Start now" style={{ flex: 1 }} />
              <BannerCard title="Burn Fat" subtitle="Cardio & HIIT" icon="🔥"
                gradient="linear-gradient(135deg, #DC2626 0%, #F97316 100%)" cta="Start now" style={{ flex: 1 }} />
            </div>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <SectionHeader title="Picks for You" />
            <HScroll items={PICKS} />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <SectionHeader title="For Beginners" />
            <HScroll items={BEGINNERS} />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <SectionHeader title="Fast Workouts (< 15 min)" />
            <HScroll items={FAST} />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <SectionHeader title="Challenge" />
            <HScroll items={CHALLENGE} />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <SectionHeader title="With Equipment" />
            <HScroll items={EQUIPMENT} />
          </div>
        </>
      )}
    </div>
  );
}
