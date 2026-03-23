'use client';
import { useState } from 'react';

export default function Tabs({ tabs, value, onChange, variant = 'pill', style = {} }) {
  if (variant === 'pill') {
    return (
      <div style={{
        display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px',
        ...style
      }} className="hide-scroll">
        {tabs.map(tab => {
          const active = value === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              style={{
                padding: '8px 16px', borderRadius: '99px', border: 'none',
                background: active ? 'var(--primary)' : 'var(--surface-2)',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: active ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
              }}
            >
              {tab.icon && <span style={{ marginRight: '5px' }}>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div style={{
        display: 'flex', borderBottom: '1.5px solid var(--border)', gap: '0',
        overflowX: 'auto', ...style
      }} className="hide-scroll">
        {tabs.map(tab => {
          const active = value === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              style={{
                padding: '12px 20px', border: 'none', background: 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '14px', fontWeight: active ? 600 : 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
                borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: '-1.5px', transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              {tab.icon && <span style={{ marginRight: '6px' }}>{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span style={{
                  marginLeft: '6px', background: active ? 'var(--primary-light)' : 'var(--surface-2)',
                  color: active ? 'var(--primary)' : 'var(--text-tertiary)',
                  padding: '1px 7px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return null;
}
