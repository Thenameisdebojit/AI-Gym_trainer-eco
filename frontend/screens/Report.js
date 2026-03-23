'use client';
import { useState, useEffect, useRef } from 'react';
import StatCard from '../components/cards/StatCard';
import WeightChart from '../components/charts/WeightChart';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = new Date().getDay();

function BMIScale({ bmi }) {
  const ranges = [
    { label: 'Underweight', max: 18.5, color: '#60A5FA' },
    { label: 'Normal', max: 24.9, color: '#10B981' },
    { label: 'Overweight', max: 29.9, color: '#F59E0B' },
    { label: 'Obese', max: 100, color: '#EF4444' },
  ];
  const current = ranges.find(r => bmi <= r.max) || ranges[3];
  const pct = Math.min(100, ((bmi - 10) / 30) * 100);

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', height: '12px', borderRadius: '99px', overflow: 'hidden', marginBottom: '10px' }}>
        {ranges.map((r, i) => (
          <div key={i} style={{ flex: 1, background: r.color, opacity: current.label === r.label ? 1 : 0.3 }} />
        ))}
      </div>
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{
          position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
          width: '14px', height: '14px', borderRadius: '50%',
          background: current.color, border: '3px solid #fff',
          boxShadow: `0 0 0 2px ${current.color}`, top: '-27px',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {ranges.map((r, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: r.color }}>{r.label}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-tertiary)' }}>{i === 0 ? '<18.5' : i === 1 ? '18.5–24.9' : i === 2 ? '25–29.9' : '>30'}</div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: '14px', textAlign: 'center',
        background: current.color + '15', borderRadius: 'var(--radius)',
        padding: '12px', border: `1.5px solid ${current.color}40`,
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: current.color }}>
          {current.label} — Your BMI is {bmi}
        </span>
      </div>
    </div>
  );
}

function WeeklyBar({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '100px' }}>
      {data.map((d, i) => {
        const active = i === (TODAY === 0 ? 6 : TODAY - 1);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '100%', borderRadius: '6px 6px 0 0',
              height: `${Math.max(8, (d.value / max) * 88)}px`,
              background: active ? 'var(--primary)' : d.value > 0 ? 'var(--primary-light)' : 'var(--border)',
              transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: active ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
            }} />
            <span style={{ fontSize: '11px', fontWeight: active ? 700 : 500, color: active ? 'var(--primary)' : 'var(--text-tertiary)' }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Report() {
  const [stats, setStats] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([
    { weight: 78.5, label: 'Jan' }, { weight: 77.2, label: 'Feb' },
    { weight: 76.8, label: 'Mar' }, { weight: 75.9, label: 'Apr' },
    { weight: 74.5, label: 'May' }, { weight: 73.8, label: 'Jun' },
  ]);
  const [newWeight, setNewWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [streak, setStreak] = useState(12);

  useEffect(() => {
    fetch('/api/workout/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const weeklyData = DAYS.map((d, i) => ({
    label: d,
    value: [45, 0, 62, 38, 0, 80, 55][i],
  }));

  const calcBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) setBmi((w / (h * h)).toFixed(1));
  };

  const logWeight = () => {
    const w = parseFloat(newWeight);
    if (!w) return;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    setWeightHistory(prev => [...prev, { weight: w, label: months[now.getMonth()] }]);
    setNewWeight('');
    if (height) {
      const h = parseFloat(height) / 100;
      if (h > 0) setBmi((w / (h * h)).toFixed(1));
    }
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '960px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          Your progress
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Report
        </h1>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <StatCard icon="✅" label="Workouts" value={stats?.total_workouts ?? 0} sub="This month" variant="blue" change={12} />
        <StatCard icon="🔥" label="Calories" value={stats?.calories_burned ? Math.round(stats.calories_burned) : 0} sub="Total burned" variant="orange" change={8} />
        <StatCard icon="⏱" label="Minutes" value={stats?.total_workouts ? stats.total_workouts * 28 : 0} sub="Training time" variant="green" change={5} />
      </div>

      {/* Weekly Chart */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', marginBottom: '20px', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>Weekly Activity</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Reps per day this week</p>
          </div>
          <div style={{
            background: 'var(--primary-50)', borderRadius: 'var(--radius)',
            padding: '8px 14px', textAlign: 'right',
          }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
              {weeklyData.reduce((a, b) => a + b.value, 0)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 500 }}>Total Reps</div>
          </div>
        </div>
        <WeeklyBar data={weeklyData} />
      </div>

      {/* Streak & Personal Best */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
        <div style={{
          flex: 1, background: 'linear-gradient(135deg, #F59E0B, #F97316)',
          borderRadius: 'var(--radius-md)', padding: '20px', color: '#fff',
          boxShadow: '0 8px 24px rgba(249,115,22,0.25)',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '6px' }}>🔥</div>
          <div style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1 }}>{streak}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.85, marginTop: '4px' }}>Day Streak</div>
          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>Keep going!</div>
        </div>
        <div style={{
          flex: 1, background: 'var(--surface)', borderRadius: 'var(--radius-md)',
          padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🏆</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
            {stats?.total_reps ?? 0}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Personal Best</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Total reps ever</div>
        </div>
      </div>

      {/* Weight Tracking */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', marginBottom: '20px', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>Weight Tracking</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Current: <strong style={{ color: 'var(--text)' }}>{weightHistory[weightHistory.length - 1]?.weight} kg</strong>
            </p>
          </div>
          {weightHistory.length >= 2 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '13px', fontWeight: 600,
                color: weightHistory[weightHistory.length - 1].weight < weightHistory[0].weight ? 'var(--success)' : 'var(--danger)',
              }}>
                {weightHistory[weightHistory.length - 1].weight < weightHistory[0].weight ? '↓' : '↑'} {Math.abs(weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight).toFixed(1)} kg
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>vs first entry</div>
            </div>
          )}
        </div>
        <WeightChart data={weightHistory} height={160} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            placeholder="Log weight (kg)"
            type="number"
            style={{
              flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)',
              background: 'var(--surface-2)',
            }}
          />
          <Button variant="primary" size="md" onClick={logWeight}>Log</Button>
        </div>
      </div>

      {/* BMI Calculator */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', marginBottom: '20px', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>BMI Calculator</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Body Mass Index</p>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>WEIGHT (kg)</label>
            <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70"
              type="number" style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)',
              }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>HEIGHT (cm)</label>
            <input value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175"
              type="number" style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)',
              }} />
          </div>
        </div>
        <Button variant="primary" size="md" onClick={calcBmi} fullWidth>Calculate BMI</Button>
        {bmi && (
          <div style={{ marginTop: '20px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '52px', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{bmi}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Your BMI Score</div>
            </div>
            <BMIScale bmi={parseFloat(bmi)} />
          </div>
        )}
      </div>

      {/* Workout History Placeholder */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Recent Sessions</h3>
        {[
          { date: 'Today', workout: 'HIIT Cardio', duration: 25, calories: 280, score: 92 },
          { date: 'Yesterday', workout: 'Push Day', duration: 45, calories: 340, score: 88 },
          { date: '2 days ago', workout: 'Yoga Flow', duration: 30, calories: 140, score: 95 },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0',
            borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: 'var(--radius)',
              background: ['var(--primary-50)', 'var(--success-light)', 'var(--purple-light)'][i],
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
            }}>
              {['🏃', '🏋️', '🧘'][i]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>{s.workout}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {s.date} · {s.duration} min · {s.calories} cal
              </div>
            </div>
            <div style={{
              fontSize: '13px', fontWeight: 700, color: s.score >= 90 ? 'var(--success)' : s.score >= 75 ? 'var(--warning)' : 'var(--danger)',
              background: s.score >= 90 ? 'var(--success-light)' : s.score >= 75 ? 'var(--warning-light)' : 'var(--danger-light)',
              padding: '5px 12px', borderRadius: '99px',
            }}>
              {s.score}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
