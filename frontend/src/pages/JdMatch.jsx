import React, { useState, useEffect } from 'react';
import { useJdMatch } from '../hooks/useJdMatch';
import FileUploader from '../components/FileUploader';
import JdMatchPanel from '../components/JdMatchPanel';

export default function JdMatch() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [file, setFile] = useState(null);
  const [hasSessionResume, setHasSessionResume] = useState(false);
  
  const { result, loading, error, runMatch } = useJdMatch();

  useEffect(() => {
    const textInSession = sessionStorage.getItem('resume_text');
    if (textInSession) {
      setResumeText(textInSession);
      setHasSessionResume(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jdText) return alert("JD Text is required");
    if (!file && !resumeText) return alert("Resume file or context is required");

    // The API layer precedence logic dictates: If file is provided, send file only. Else send resumeText.
    await runMatch({ resumeText, jdText, file });
  };

  const handleClearSession = () => {
    sessionStorage.removeItem('resume_text');
    setResumeText('');
    setHasSessionResume(false);
    setFile(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Job Description Match</h1>
      <p style={{ color: 'var(--color-text-secondary, #9ca3af)', marginBottom: '2rem' }}>
        Paste the job description below and we'll check how well your resume fits the requirements.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Job Description</label>
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '1rem',
              background: 'var(--color-bg-surface, #111)',
              color: 'var(--color-text-primary, #fff)',
              border: '1px solid var(--color-border, #333)',
              borderRadius: '8px',
              fontFamily: 'inherit'
            }}
            placeholder="Paste Job Description here..."
          />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Resume</label>
           
           {hasSessionResume && !file ? (
             <div style={{ padding: '1.5rem', background: 'var(--color-bg-surface, #1f2937)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <h4 style={{ color: 'var(--color-success, #22c55e)' }}>Using recently analyzed resume</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary, #9ca3af)' }}>We've pulled your resume from this session.</p>
               </div>
               <button 
                  type="button" 
                  onClick={handleClearSession}
                  style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--color-danger, #ef4444)', color: 'var(--color-danger, #ef4444)', borderRadius: '4px' }}
                >
                 Replace with New File
               </button>
             </div>
           ) : (
             <FileUploader onFileSelect={(f) => setFile(f)} />
           )}
           {file && (
             <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--color-success, #22c55e)' }}>Selected file: {file.name}</p>
           )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '1rem',
            background: 'var(--color-accent-primary, #2563eb)',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem'
          }}
        >
          {loading ? 'Matching...' : 'Match Resume'}
        </button>
      </form>

      {error && (
         <div style={{ color: 'var(--color-danger, #ef4444)', padding: '1rem', border: '1px solid currentColor', borderRadius: '8px', marginBottom: '2rem' }}>
           {error}
         </div>
      )}

      {/* Render JdMatchPanel as requested by giving it the cachedResult directly */}
      {result && (
        <div>
          <h2>Match Results</h2>
          <JdMatchPanel 
             cachedResult={result} 
             // We don't need onFetchMatch because it's a standalone result payload passed directly
             onFetchMatch={() => Promise.resolve()} 
             job={null} 
             resumeText={null}
          />
        </div>
      )}

    </div>
  );
}
