'use client';
import { useState, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';
import { useAppSettings } from '../context/AppSettingsContext';

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '14px', animation: 'fadeIn 0.3s ease' }}>
      {!isUser && (
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginRight: '10px', alignSelf: 'flex-end' }}>🤖</div>
      )}
      <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px', background: isUser ? 'var(--primary)' : 'var(--surface)', color: isUser ? '#fff' : 'var(--text)', fontSize: '14px', lineHeight: 1.6, boxShadow: isUser ? '0 4px 12px rgba(37,99,235,0.25)' : 'var(--shadow-sm)', border: isUser ? 'none' : '1px solid var(--border-light)' }}>
        {msg.content}
      </div>
    </div>
  );
}

export default function AICoach() {
  const { t, language } = useAppSettings();
  const [messages, setMessages] = useState(() => [{ role: 'assistant', content: t.chatGreeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t.chatGreeting }]);
  }, [language]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const quickPrompts = [t.chatPrompt1, t.chatPrompt2, t.chatPrompt3, t.chatPrompt4, t.chatPrompt5, t.chatPrompt6];

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q, language }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || t.chatErrorMsg }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t.chatErrorMsg }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '960px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>Powered by AI</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>AI Coach</h1>
      </div>
      <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E3A8A,#2563EB)', borderRadius: 'var(--radius-xl)', padding: '28px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 12px 40px rgba(37,99,235,0.2)' }}>
        <div style={{ fontSize: '56px' }}>🤖</div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Your Personal AI Coach</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Ask anything about workouts, nutrition, or get a personalized plan. Also available as a floating button on every screen!</div>
        </div>
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', marginBottom: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>AI Coach · {t.chatOnline}</span>
        </div>
        <div style={{ height: '380px', overflowY: 'auto', padding: '20px 20px 10px' }} className="hide-scroll">
          {messages.map((m, i) => <Message key={i} msg={m} />)}
          {loading && (
            <div style={{ display: 'flex', gap: '5px', padding: '8px 16px', width: 'fit-content' }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-tertiary)', animation: 'pulse 1s ease infinite', animationDelay: `${i * 0.2}s` }} />)}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scroll">
            {quickPrompts.map((q, i) => (
              <button key={i} onClick={() => send(q)} style={{ padding: '6px 14px', border: '1.5px solid var(--border)', borderRadius: '99px', background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s ease', flexShrink: 0 }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
              >{q}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder={t.chatPlaceholder}
            style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)', background: 'var(--surface-2)', transition: 'border-color 0.2s', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <Button variant="primary" size="md" onClick={() => send()} loading={loading} icon="✈️" />
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.85)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
