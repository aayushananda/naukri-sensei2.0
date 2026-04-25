import { useState } from 'react';
import { analyzeResume } from '../services/api';

export function useResumeAnalysis() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeResume(file);
      setAnalysisResult(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred during verification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analysisResult, loading, error, runAnalysis };
}
