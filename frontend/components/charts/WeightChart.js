'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function WeightChart({ data = [], height = 160, color = '#2563EB' }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const coordsRef = useRef([]);

  const draw = useCallback((hoverIdx = null) => {
    if (!canvasRef.current || data.length < 2) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    const pad = { top: 10, right: 10, bottom: 24, left: 36 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const vals = data.map(d => d.weight);
    const min = Math.min(...vals) - 2;
    const max = Math.max(...vals) + 2;
    const range = max - min;

    const toX = i => pad.left + (i / (data.length - 1)) * chartW;
    const toY = v => pad.top + chartH - ((v - min) / range) * chartH;

    coordsRef.current = data.map((d, i) => ({ x: toX(i), y: toY(d.weight) }));

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      const val = max - (range / 4) * i;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(1), pad.left - 6, y + 4);
    }

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    grad.addColorStop(0, color + '30');
    grad.addColorStop(1, color + '00');
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(vals[0]));
    for (let i = 1; i < data.length; i++) {
      const cpx = (toX(i - 1) + toX(i)) / 2;
      ctx.bezierCurveTo(cpx, toY(vals[i - 1]), cpx, toY(vals[i]), toX(i), toY(vals[i]));
    }
    ctx.lineTo(toX(data.length - 1), h - pad.bottom);
    ctx.lineTo(toX(0), h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(vals[0]));
    for (let i = 1; i < data.length; i++) {
      const cpx = (toX(i - 1) + toX(i)) / 2;
      ctx.bezierCurveTo(cpx, toY(vals[i - 1]), cpx, toY(vals[i]), toX(i), toY(vals[i]));
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Points
    data.forEach((d, i) => {
      const isHover = i === hoverIdx;
      ctx.beginPath();
      ctx.arc(toX(i), toY(d.weight), isHover ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isHover ? color : '#fff';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isHover ? 2.5 : 2;
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label || '', toX(i), h - 6);
    });

    // Crosshair
    if (hoverIdx !== null) {
      const cx = toX(hoverIdx);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = color + '80';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, pad.top);
      ctx.lineTo(cx, h - pad.bottom);
      ctx.stroke();
      ctx.restore();
    }
  }, [data, color]);

  useEffect(() => {
    draw(null);
  }, [draw]);

  const handleMouseMove = useCallback((e) => {
    if (!canvasRef.current || data.length < 2) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const coords = coordsRef.current;
    let nearest = 0;
    let minDist = Infinity;
    coords.forEach((pt, i) => {
      const dist = Math.abs(pt.x - mouseX);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    draw(nearest);
    const pt = coords[nearest];
    const tooltipX = (pt.x / rect.width) * 100;
    setTooltip({
      idx: nearest,
      x: Math.min(Math.max(tooltipX, 5), 85),
      y: (pt.y / rect.height) * 100,
      weight: data[nearest].weight,
      label: data[nearest].label || '',
    });
  }, [data, draw]);

  const handleMouseLeave = useCallback(() => {
    draw(null);
    setTooltip(null);
  }, [draw]);

  if (data.length < 2) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '13px' }}>Log at least 2 entries to see your chart</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height, display: 'block', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: `${tooltip.x}%`,
          top: `${Math.max(0, tooltip.y - 14)}%`,
          transform: 'translate(-50%, -100%)',
          background: 'var(--text)',
          color: 'var(--bg)',
          fontSize: '11px',
          fontWeight: 700,
          padding: '4px 9px',
          borderRadius: '7px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.22)',
        }}>
          {tooltip.label && <span style={{ fontWeight: 500, marginRight: 4 }}>{tooltip.label}</span>}
          {tooltip.weight} kg
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--text)',
          }} />
        </div>
      )}
    </div>
  );
}
