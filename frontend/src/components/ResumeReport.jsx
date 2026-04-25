import React from 'react';
import ScoreRing from './ScoreRing';

export default function ResumeReport({ data }) {
  if (!data) return null;

  const { score, feedback, llm_analysis, grammar_errors } = data;

  return (
    <div className="resume-report" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <ScoreRing score={score} />
        <div>
          <h2>Overall Score: {score}/100</h2>
          <p style={{ color: 'var(--color-text-secondary, #666)' }}>
            {llm_analysis?.shortlisting_verdict === "would shortlist" 
               ? "✅ High chance of shortlisting" 
               : "⚠️ Needs improvement before applying"}
          </p>
        </div>
      </div>

      {feedback && feedback.length > 0 && (
        <section>
          <h3>Formatting Checks</h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {feedback.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {llm_analysis && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {llm_analysis.strengths && llm_analysis.strengths.length > 0 && (
            <div style={{ background: 'var(--color-bg-surface, #f9fafb)', padding: '1rem', borderRadius: '8px' }}>
              <h3 style={{ color: 'var(--color-success, #15803d)' }}>Strengths</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {llm_analysis.strengths.map((str, i) => <li key={i}>✓ {str}</li>)}
              </ul>
            </div>
          )}
          {llm_analysis.weaknesses && llm_analysis.weaknesses.length > 0 && (
            <div style={{ background: 'var(--color-bg-surface, #f9fafb)', padding: '1rem', borderRadius: '8px' }}>
              <h3 style={{ color: 'var(--color-danger, #b91c1c)' }}>Weaknesses</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {llm_analysis.weaknesses.map((wk, i) => <li key={i}>✗ {wk}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {llm_analysis?.improvements && llm_analysis.improvements.length > 0 && (
        <section>
          <h3>Suggested Improvements</h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {llm_analysis.improvements.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ul>
        </section>
      )}

      {grammar_errors && grammar_errors.length > 0 && (
        <section>
          <h3>Grammar Issues</h3>
          <p style={{ color: 'var(--color-text-secondary, #666)', fontSize: '0.9rem' }}>
            Note: Technical terms may be falsely flagged.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {grammar_errors.map((g, i) => (
              <div key={i} style={{ padding: '1rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '6px' }}>
                <p><strong>Error:</strong> {g.message}</p>
                <p style={{ fontFamily: 'monospace', background: 'var(--color-bg-surface, #f3f4f6)', padding: '0.5rem' }}>{g.context}</p>
                {g.suggestions && g.suggestions.length > 0 && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    <strong>Did you mean:</strong> {g.suggestions.slice(0,3).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
