'use client';
import { useState, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';

const QUICK_PROMPTS = [
  'How do I build muscle faster?',
  'Best exercises for fat loss?',
  'How many rest days do I need?',
  'What should I eat before a workout?',
  'How to improve my flexibility?',
  'Create a weekly training plan',
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '14px', animation: 'fadeIn 0.3s ease',
    }}>
      {!isUser && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0, marginRight: '10px', alignSelf: 'flex-end',
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '75%', padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        background: isUser ? 'var(--primary)' : 'var(--surface)',
        color: isUser ? '#fff' : 'var(--text)',
        fontSize: '14px', lineHeight: 1.6,
        boxShadow: isUser ? '0 4px 12px rgba(37,99,235,0.25)' : 'var(--shadow-sm)',
        border: isUser ? 'none' : '1px solid var(--border-light)',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

export default function AICoach() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Fitness Coach 🤖💪 I'm here to help you with workouts, nutrition, recovery, and anything fitness-related. What would you like to work on today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [daysM, setDaysM] = useState('2');
  const [consistency, setConsistency] = useState('70');
  const [behavior, setBehavior] = useState(null);
  const [behaviorLoading, setBehaviorLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || "I'm here to help! Could you clarify your question?" }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't connect to the coaching service. Please try again!" }]);
    }
    setLoading(false);
  };

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

  const riskColors = { low: 'var(--success)', medium: 'var(--warning)', high: 'var(--danger)', unknown: 'var(--text-secondary)' };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '960px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          Powered by AI
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          AI Coach
        </h1>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 40%, #2563EB 100%)',
        borderRadius: 'var(--radius-xl)', padding: '28px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '24px',
        boxShadow: '0 12px 40px rgba(37,99,235,0.2)',
      }}>
        <div style={{ fontSize: '56px' }}>🤖</div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
            Your Personal AI Coach
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Ask anything about workouts, nutrition, recovery, or get a personalized plan tailored to your goals.
          </div>
        </div>
      </div>

      {/* Chat */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)', marginBottom: '24px',
        border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: 'var(--success)', boxShadow: '0 0 6px var(--success)',
          }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>AI Coach Online</span>
        </div>

        {/* Messages */}
        <div style={{ height: '380px', overflowY: 'auto', padding: '20px 20px 10px' }} className="hide-scroll">
          {messages.map((m, i) => <Message key={i} msg={m} />)}
          {loading && (
            <div style={{ display: 'flex', gap: '5px', padding: '8px 16px', width: 'fit-content' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-tertiary)',
                  animation: 'pulse 1s ease infinite', animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scroll">
            {QUICK_PROMPTS.map((q, i) => (
              <button key={i} onClick={() => send(q)} style={{
                padding: '6px 14px', border: '1.5px solid var(--border)', borderRadius: '99px',
                background: 'var(--surface-2)', color: 'var(--text-secondary)',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s ease', flexShrink: 0,
              }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
              >{q}</button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask your AI coach anything..."
            style={{
              flex: 1, padding: '12px 16px', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)',
              background: 'var(--surface-2)', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <Button variant="primary" size="md" onClick={() => send()} loading={loading} icon="✈️" />
        </div>
      </div>

      {/* Behavior Analysis */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Consistency Analyzer</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Check your dropout risk and get motivational insights</p>
        </div>
        <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>DAYS MISSED (this week)</label>
            <input value={daysM} onChange={e => setDaysM(e.target.value)} type="number" min="0" max="7"
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)',
              }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>CONSISTENCY SCORE (0–100)</label>
            <input value={consistency} onChange={e => setConsistency(e.target.value)} type="number" min="0" max="100"
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)',
              }} />
          </div>
        </div>
        <Button variant="primary" size="md" loading={behaviorLoading} onClick={analyzeBehavior} fullWidth icon="🧠">
          Analyze My Consistency
        </Button>
        {behavior && (
          <div style={{
            marginTop: '20px', padding: '18px', animation: 'fadeIn 0.3s ease',
            background: riskColors[behavior.risk?.toLowerCase()] + '12',
            borderRadius: 'var(--radius-md)', border: `1.5px solid ${riskColors[behavior.risk?.toLowerCase()]}30`,
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '28px' }}>
                {behavior.risk?.toLowerCase() === 'low' ? '✅' : behavior.risk?.toLowerCase() === 'high' ? '⚠️' : '💛'}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: riskColors[behavior.risk?.toLowerCase()] }}>
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
