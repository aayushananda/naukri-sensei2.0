import React, { useEffect, useState } from 'react';
import ScoreRing from './ScoreRing';

export default function JdMatchPanel({ resumeText, job, cachedResult, onFetchMatch }) {
  const [loading, setLoading] = useState(!cachedResult);

  useEffect(() => {
    if (!cachedResult && resumeText && job) {
      setLoading(true);
      onFetchMatch(job).finally(() => setLoading(false));
    }
  }, [cachedResult, resumeText, job, onFetchMatch]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-base, #111)', color: 'var(--color-text-secondary, #999)', borderRadius: '8px', border: '1px solid var(--color-border, #333)', marginTop: '1rem' }}>
        <p>Running semantic matching and gap analysis...</p>
      </div>
    );
  }

  if (!cachedResult) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-base, #111)', color: 'var(--color-danger, #ef4444)', borderRadius: '8px', border: '1px solid var(--color-border, #333)', marginTop: '1rem' }}>
        <p>Failed to load match analysis.</p>
      </div>
    );
  }

  const { resume_match, gap_in_resume } = cachedResult;

  return (
    <div style={{ 
      marginTop: '1rem', 
      padding: '1.5rem', 
      background: 'var(--color-bg-base, #0B0F19)', 
      borderRadius: '8px',
      border: '1px solid var(--color-border, #1f2937)'
    }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <ScoreRing score={resume_match?.match_score || 0} />
        <div>
          <h3>Match Score details</h3>
          <p><strong>Most relevant section:</strong> {resume_match?.most_relevant_section}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {gap_in_resume?.gaps && gap_in_resume.gaps.length > 0 && (
          <div style={{ padding: '1rem', background: 'var(--color-bg-surface, #111827)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--color-danger, #ef4444)', marginBottom: '0.5rem' }}>Identified Gaps</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {gap_in_resume.gaps.map((gap, i) => (
                <li key={i}>{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {gap_in_resume?.suggested_keywords && gap_in_resume.suggested_keywords.length > 0 && (
          <div style={{ padding: '1rem', background: 'var(--color-bg-surface, #111827)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--color-accent-primary, #3b82f6)', marginBottom: '0.5rem' }}>Suggested Keywords to Add</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {gap_in_resume.suggested_keywords.map((kw, i) => (
                <span key={i} style={{ padding: '0.2rem 0.6rem', background: 'var(--color-bg-base, #1f2937)', borderRadius: '999px', fontSize: '0.8rem' }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {gap_in_resume?.improvements && gap_in_resume.improvements.length > 0 && (
          <div style={{ padding: '1rem', background: 'var(--color-bg-surface, #111827)', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Recommended Improvements</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {gap_in_resume.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
