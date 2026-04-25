import { useState } from 'react';
import { searchJobs } from '../services/api';

export function useJobSearch() {
  const [jobs, setJobs] = useState([]);
  const [detectedRole, setDetectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSearch = async (resumeText) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchJobs(resumeText);
      setJobs(result.jobs || []);
      setDetectedRole(result.detected_role || null);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred while finding jobs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { jobs, detectedRole, loading, error, runSearch, setJobs };
}
