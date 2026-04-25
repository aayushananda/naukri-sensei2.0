import React, { useState, useRef } from 'react';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { useJobSearch } from '../hooks/useJobSearch';
import { useJdMatch } from '../hooks/useJdMatch';

import FileUploader from '../components/FileUploader';
import ResumeReport from '../components/ResumeReport';
import JobList from '../components/JobList';

export default function ResumeAnalysis() {
  const { analysisResult, loading: analyzing, error: analyzeErr, runAnalysis } = useResumeAnalysis();
  const { jobs, loading: searching, error: searchErr, runSearch } = useJobSearch();
  const { runMatch } = useJdMatch(); // used strictly as API caller here

  // State cache for inline JD matching: Record<jobId, matchResult>
  const [matchCache, setMatchCache] = useState({});

  const handleUpload = async (file) => {
    try {
      const result = await runAnalysis(file);
      // Persist resume text for JdMatch page
      sessionStorage.setItem('resume_text', result.resume_text);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFindJobs = async () => {
    if (analysisResult?.resume_text) {
      await runSearch(analysisResult.resume_text);
    }
  };

  // Expose fetch binder to JobList
  const handleFetchMatch = async (jobId, job) => {
    // If cache already has it, do nothing (JobList renders it from cache)
    if (matchCache[jobId]) return matchCache[jobId];

    try {
      const matchData = await runMatch({
        resumeText: analysisResult.resume_text,
        jdText: job.description
      });
      // Store in cache
      setMatchCache(prev => ({ ...prev, [jobId]: matchData }));
      return matchData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Resume Analysis</h1>
      
      {!analysisResult && !analyzing && (
        <FileUploader onFileSelect={handleUpload} />
      )}

      {analyzing && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Analyzing resume...</p>
        </div>
      )}

      {analyzeErr && (
        <div style={{ color: 'var(--color-danger, #ef4444)', padding: '1rem', border: '1px solid currentColor', borderRadius: '8px' }}>
          {analyzeErr}
        </div>
      )}

      {analysisResult && (
        <>
          <ResumeReport data={analysisResult} />

          <div style={{ marginTop: '3rem', padding: '2rem 0', borderTop: '1px solid var(--color-border, #333)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Ready for next steps?</h2>
            <button 
              onClick={handleFindJobs}
              disabled={searching}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--color-bg-base, #1f2937)',
                color: '#000000',
                border: '1px solid var(--color-border, #4b5563)',
                borderRadius: '8px',
                cursor: searching ? 'not-allowed' : 'pointer'
              }}
            >
              {searching ? 'Finding matches...' : 'Find Matching Jobs'}
            </button>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary, #9ca3af)' }}>
              We will automatically detect your role and fetch live listings.
            </p>
          </div>

          {searchErr && (
            <p style={{ color: 'var(--color-danger, #ef4444)' }}>{searchErr}</p>
          )}

          {jobs.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Found {jobs.length} Matches</h3>
              <JobList 
                jobs={jobs} 
                matchCache={matchCache} 
                onFetchMatch={handleFetchMatch}
                resumeText={analysisResult.resume_text}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
