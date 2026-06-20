// ─── Core Types ───────────────────────────────────────────────────────────────

export interface ProjectAnalysis {
  projectName: string;
  improvedBullets: string[];
  metricSuggestions: string[];
  missingKeywords: string[];
}

export interface AnalysisResult {
  atsScore: number;
  matchScore?: number;
  summary: string;
  strengths: string[];
  projects: ProjectAnalysis[];
  globalMissingKeywords: string[];
}

export interface APIResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';

export interface AnalysisState {
  status: UploadStatus;
  result: AnalysisResult | null;
  error: string | null;
}
