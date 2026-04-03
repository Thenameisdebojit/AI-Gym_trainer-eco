'use client';
import { useState, useEffect } from 'react';
import WeightChart from '../components/charts/WeightChart';
import Button from '../components/ui/Button';

const RISK_COLORS = { low: '#10B981', medium: '#F59E0B', high: '#EF4444', unknown: '#64748B' };

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = new Date().getDay();
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BODY_PART_ICONS = {
  chest: '💪', abs: '🔥', arms: '💪', legs: '🦵', back: '🎯',
  full_body: '⚡', default: '🏋️',
};

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
        {ranges.map((r, i) => <div key={i} style={{ flex: 1, background: r.color, opacity: current.label === r.label ? 1 : 0.3 }} />)}
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
        background: current.color + '15', borderRadius: 'var(--radius)', padding: '12px',
        border: `1.5px solid ${current.color}40`,
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

function RelativeDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function Report() {
  const [stats, setStats] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [daysM, setDaysM] = useState('2');
  const [consistency, setConsistency] = useState('70');
  const [behavior, setBehavior] = useState(null);
  const [behaviorLoading, setBehaviorLoading] = useState(false);
  const [weightHistory, setWeightHistory] = useState([
    { weight: 78.5, label: 'Jan' }, { weight: 77.2, label: 'Feb' },
    { weight: 76.8, label: 'Mar' }, { weight: 75.9, label: 'Apr' },
    { weight: 74.5, label: 'May' }, { weight: 73.8, label: 'Jun' },
  ]);
  const [newWeight, setNewWeight] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [weeklyData, setWeeklyData] = useState(
    DAYS.map(d => ({ label: d, value: 0 }))
  );

  useEffect(() => {
    fetch('/api/workout/stats').then(r => r.json()).then(setStats).catch(() => {});

    fetch('/api/sessions?type=stats').then(r => r.json()).then(setSessionStats).catch(() => {});

    setHistoryLoading(true);
    fetch('/api/sessions?limit=20')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data);
          const weekly = DAYS.map((d, i) => ({ label: d, value: 0 }));
          data.forEach(s => {
            if (!s.date) return;
            const d = new Date(s.date);
            const day = d.getDay();
            const idx = day === 0 ? 6 : day - 1;
            const daysDiff = Math.floor((Date.now() - d.getTime()) / 86400000);
            if (daysDiff < 7) weekly[idx].value += Math.round(s.calories || 0);
          });
          setWeeklyData(weekly);
        }
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  const analyzeBehavior = async () => {
    setBehaviorLoading(true);
    try {
      const res = await fetch(`/api/behavior?days_missed=${daysM}&consistency=${consistency}`);
      const data = await res.json();
      setBehavior(data);
    } catch {
      setBehavior({ risk: 'unknown', message: 'Could not analyze at this time.' });
    }
    setBehaviorLoading(false);
  };

  const calcBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) setBmi((w / (h * h)).toFixed(1));
  };

  const logWeight = () => {
    const w = parseFloat(newWeight);
    if (!w) return;
    const now = new Date();
    setWeightHistory(prev => [...prev, { weight: w, label: MONTH_NAMES[now.getMonth()] }]);
    setNewWeight('');
    if (height) {
      const h = parseFloat(height) / 100;
      if (h > 0) setBmi((w / (h * h)).toFixed(1));
    }
  };

  const totalSessions = sessionStats?.total_sessions ?? 0;
  const totalCalories = Math.round(sessionStats?.total_calories ?? stats?.calories_burned ?? 0);
  const totalMinutes = sessionStats?.total_minutes ?? (stats?.total_workouts ? stats.total_workouts * 28 : 0);

  return (
    <div style={{ padding: '24px 28px', maxWidth: '960px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          Your progress
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Report</h1>
      </div>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { icon: '✅', label: 'Sessions', value: totalSessions, sub: 'Completed', variant: '#2563EB' },
          { icon: '🔥', label: 'Calories', value: totalCalories, sub: 'Total burned', variant: '#F97316' },
          { icon: '⏱', label: 'Minutes', value: totalMinutes, sub: 'Training time', variant: '#10B981' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: '1 1 160px', background: 'var(--surface)', borderRadius: 'var(--radius-md)',
            padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: 'var(--radius)',
                background: s.variant + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}>{s.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', marginBottom: '20px', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>Weekly Activity</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Calories burned per day this week</p>
          </div>
          <div style={{
            background: 'var(--primary-50)', borderRadius: 'var(--radius)', padding: '8px 14px', textAlign: 'right',
          }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
              {weeklyData.reduce((a, b) => a + b.value, 0)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 500 }}>Total kcal</div>
          </div>
        </div>
        <WeeklyBar data={weeklyData} />
      </div>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
        <div style={{
          flex: 1, background: 'linear-gradient(135deg, #F59E0B, #F97316)',
          borderRadius: 'var(--radius-md)', padding: '20px', color: '#fff',
          boxShadow: '0 8px 24px rgba(249,115,22,0.25)',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '6px' }}>🏆</div>
          <div style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1 }}>{totalSessions}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.85, marginTop: '4px' }}>Total Sessions</div>
          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>Keep going!</div>
        </div>
        <div style={{
          flex: 1, background: 'var(--surface)', borderRadius: 'var(--radius-md)',
          padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>💪</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
            {sessionStats?.total_exercises ?? stats?.total_reps ?? 0}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Exercises Done</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Total completed</div>
        </div>
      </div>

      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', marginBottom: '20px', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>
          Recent Sessions
        </h3>

        {historyLoading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Loading sessions…
          </div>
        ) : history.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px', background: 'var(--surface-2)',
            borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏋️</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>No sessions yet</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Complete a workout in the Training tab to see your history here
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {history.map((s, i) => {
              const icon = BODY_PART_ICONS[s.body_part] || BODY_PART_ICONS.default;
              const durationMin = Math.round((s.duration || 0) / 60);
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0',
                  borderBottom: i < history.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: 'var(--radius)',
                    background: 'var(--primary-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', flexShrink: 0,
                  }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {RelativeDate(s.date)} · {durationMin > 0 ? `${durationMin} min` : 'Quick session'} · {Math.round(s.calories)} cal · {s.exercises_completed} exercises
                    </div>
                  </div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700,
                    padding: '4px 10px', borderRadius: '99px',
                    background: s.level === 'advanced' ? '#FEF2F2' : s.level === 'intermediate' ? '#FFFBEB' : '#F0FDF4',
                    color: s.level === 'advanced' ? '#EF4444' : s.level === 'intermediate' ? '#F59E0B' : '#10B981',
                    flexShrink: 0,
                  }}>
                    {s.level}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
              background: 'var(--surface-2)', outline: 'none',
            }}
          />
          <Button variant="primary" size="md" onClick={logWeight}>Log</Button>
        </div>
      </div>

      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>BMI Calculator</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Body Mass Index</p>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>WEIGHT (kg)</label>
            <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70"
              type="number" style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)', outline: 'none',
              }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>HEIGHT (cm)</label>
            <input value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175"
              type="number" style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)', outline: 'none',
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

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '24px', marginTop: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'linear-gradient(135deg,#2563EB15,#7C3AED15)', border: '1px solid #7C3AED20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧠</div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>Consistency Analyzer</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Check your dropout risk and get motivational insights</p>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg,#2563EB08,#7C3AED08)', borderRadius: 12, padding: '14px 16px', border: '1px solid #7C3AED15', marginBottom: 18, marginTop: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Enter how many days you missed this week and your estimated consistency score (0–100) to get a personalized dropout risk assessment and motivational advice.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>DAYS MISSED (this week)</label>
            <input value={daysM} onChange={e => setDaysM(e.target.value)} type="number" min="0" max="7"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>CONSISTENCY SCORE (0–100)</label>
            <input value={consistency} onChange={e => setConsistency(e.target.value)} type="number" min="0" max="100"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <Button variant="primary" size="md" loading={behaviorLoading} onClick={analyzeBehavior} fullWidth icon="🧠">
          Analyze My Consistency
        </Button>

        {behavior && (
          <div style={{ marginTop: '20px', padding: '18px', animation: 'fadeIn 0.3s ease', background: RISK_COLORS[behavior.risk?.toLowerCase()] + '12', borderRadius: 'var(--radius-md)', border: `1.5px solid ${RISK_COLORS[behavior.risk?.toLowerCase()]}30` }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '28px' }}>
                {behavior.risk?.toLowerCase() === 'low' ? '✅' : behavior.risk?.toLowerCase() === 'high' ? '⚠️' : '💛'}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: RISK_COLORS[behavior.risk?.toLowerCase()] }}>
                  {behavior.risk?.toUpperCase() || 'UNKNOWN'} DROPOUT RISK
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>
                  {behavior.message || behavior.recommendation || 'Keep tracking your progress!'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
