import React from 'react';

export default function ScoreRing({ score }) {
  const normalizedScore = isNaN(score) ? 0 : Math.max(0, Math.min(100, score));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = 'var(--color-danger, #ef4444)'; // default red
  if (normalizedScore >= 80) color = 'var(--color-success, #22c55e)'; // green
  else if (normalizedScore >= 50) color = 'var(--color-accent-primary, #eab308)'; // yellow

  return (
    <div className="score-ring" style={{ position: 'relative', width: '100px', height: '100px' }}>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="var(--color-border, #e5e7eb)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: 'var(--color-text-primary, inherit)'
      }}>
        {Math.round(normalizedScore)}
      </div>
    </div>
  );
}
