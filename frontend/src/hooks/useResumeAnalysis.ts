import { useState, useCallback } from 'react';
import axios from 'axios';
import { AnalysisResult, AnalysisState } from '../types';

export function useResumeAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    result: null,
    error: null,
  });

  const analyze = useCallback(async (
    file: File,
    targetRole: string,
    jobDescription?: string
  ) => {
    setState({ status: 'uploading', result: null, error: null });

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      setState(prev => ({ ...prev, status: 'analyzing' }));

      const response = await axios.post<{ success: boolean; data: AnalysisResult }>
        ('/api/analyze-resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000, // 60s timeout for AI analysis
        });

      if (response.data.success && response.data.data) {
        setState({ status: 'success', result: response.data.data, error: null });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: unknown) {
      let errorMessage = 'Something went wrong. Please try again.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message;
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. The AI took too long to respond. Please try again.';
        }
        if (err.response?.status === 503) {
          errorMessage = 'Gemini API key is not configured. Please check the backend .env file.';
        }
      }
      setState({ status: 'error', result: null, error: errorMessage });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', result: null, error: null });
  }, []);

  return { ...state, analyze, reset };
}
