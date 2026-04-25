import { useState } from 'react';
import { matchResume } from '../services/api';

export function useJdMatch() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runMatch = async ({ resumeText, jdText, file }) => {
    setLoading(true);
    setError(null);
    try {
      const matchData = await matchResume({ resumeText, jdText, file });
      setResult(matchData);
      return matchData;
    } catch (err) {
      setError(err.message || 'Error occurred while matching resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, runMatch, setResult };
}
