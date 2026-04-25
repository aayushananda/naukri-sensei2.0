import React, { useState } from 'react';
import JobCard from './JobCard';

export default function JobList({ jobs, matchCache, onFetchMatch, resumeText }) {
  const [expandedJobId, setExpandedJobId] = useState(null);

  if (!jobs || jobs.length === 0) {
    return <p style={{ color: 'var(--color-text-secondary, #9ca3af)' }}>No jobs found.</p>;
  }

  const handleToggle = (jobId) => {
    // Collapse if already expanded, else expand
    setExpandedJobId(prev => prev === jobId ? null : jobId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {jobs.map((job, idx) => {
        // Fallback to idx if job_id is missing from JSearch
        const jobId = job.job_id || `job-${idx}`;
        return (
          <JobCard 
            key={jobId}
            job={job}
            isExpanded={expandedJobId === jobId}
            onToggle={() => handleToggle(jobId)}
            resumeText={resumeText}
            cachedResult={matchCache[jobId]}
            onFetchMatch={() => onFetchMatch(jobId, job)}
          />
        );
      })}
    </div>
  );
}
