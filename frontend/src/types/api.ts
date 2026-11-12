
export interface ApiError {
  detail: string;
}

export interface AIRequest {
  code: string;
  language: string;
  instructions?: string;
}

export interface AIResponse {
  result: string;
  model?: string;
}

export interface CodeAnalysisRequest {
  code: string;
  language: string;
}

export interface CodeIssue {
  line: number;
  severity: "error" | "warning" | "info";
  message: string;
  rule?: string;
}

export interface CodeAnalysisResponse {
  score?: number;
  issues: CodeIssue[];
  summary?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface CodeReview {
  id: number;
  project_id?: number;
  status?: string;
  summary?: string;
  created_at?: string;
}
