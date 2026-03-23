'use client';
import { useState } from 'react';
import Button from '../ui/Button';

const DIFFICULTY_COLORS = {
  beginner: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  intermediate: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  advanced: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

const GRADIENT_MAP = {
  gym: 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)',
  cardio: 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)',
  yoga: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
  calisthenics: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
  'martial arts': 'linear-gradient(135deg, #92400E 0%, #F59E0B 100%)',
  rehab: 'linear-gradient(135deg, #5B21B6 0%, #8B5CF6 100%)',
  bodyweight: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
  default: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
};

const ICONS = {
  gym: '🏋️', cardio: '🏃', yoga: '🧘', calisthenics: '🤸',
  'martial arts': '🥊', rehab: '♿', bodyweight: '💪', default: '⚡',
};

export default function WorkoutCard({ workout, compact = false, onStart, style = {} }) {
  const [hovered, setHovered] = useState(false);
  const level = (workout.level || 'beginner').toLowerCase();
  const diff = DIFFICULTY_COLORS[level] || DIFFICULTY_COLORS.beginner;
  const domain = (workout.domain || 'default').toLowerCase();
  const gradient = GRADIENT_MAP[domain] || GRADIENT_MAP.default;
  const icon = ICONS[domain] || ICONS.default;

  const diffIcons = level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3;

  if (compact) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-md)',
          boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transition: 'all 0.25s ease', transform: hovered ? 'translateY(-2px)' : 'none',
          overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px', cursor: 'pointer', border: '1px solid var(--border-light)',
          ...style,
        }}
        onClick={onStart}
      >
        <div style={{
          width: '52px', height: '52px', borderRadius: 'var(--radius)', background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {workout.title || workout.exercise}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              ⏱ {workout.duration || 15} min
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {workout.exercises || workout.reps || '—'} {workout.reps ? 'reps' : 'exercises'}
            </span>
          </div>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '4px 8px',
          borderRadius: '99px', background: diff.bg, color: diff.text, flexShrink: 0,
        }}>
          {Array.from({ length: diffIcons }, (_, i) => '⚡').join('')}
        </span>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'all 0.25s ease', transform: hovered ? 'translateY(-4px)' : 'none',
        overflow: 'hidden', width: '200px', flexShrink: 0, cursor: 'pointer',
        border: '1px solid var(--border-light)', ...style,
      }}
      onClick={onStart}
    >
      <div style={{
        height: '110px', background: gradient, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '44px',
        position: 'relative',
      }}>
        {icon}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          borderRadius: '99px', padding: '3px 10px',
          fontSize: '11px', color: '#fff', fontWeight: 600,
        }}>
          {workout.duration || 15} min
        </div>
      </div>
      <div style={{ padding: '14px' }}>
        <div style={{
          fontSize: '10px', fontWeight: 600, color: diff.text,
          background: diff.bg, display: 'inline-flex', alignItems: 'center',
          gap: '4px', padding: '3px 8px', borderRadius: '99px', marginBottom: '8px',
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: diff.dot }} />
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </div>
        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '6px', lineHeight: 1.3 }}>
          {workout.title || workout.exercise}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {workout.exercises || '—'} exercises
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            {Array.from({ length: diffIcons }, () => '⚡').join('')}
          </span>
        </div>
      </div>
    </div>
  );
}
