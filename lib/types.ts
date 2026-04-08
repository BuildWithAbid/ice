export type Level = "beginner" | "intermediate" | "advanced";

export interface QuizOption {
  id: string;
  text: string;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
}

export interface Step {
  number: number;
  title: string;
  content: string;
  analogy: string | null;
  diagram: string | null; // Mermaid diagram code
  quiz: Quiz | null;
}

export interface Explanation {
  topic: string;
  level: Level;
  summary: string;
  steps: Step[];
}

export interface ExplainRequest {
  topic: string;
  level: Level;
}

export interface ExplainResponse {
  success: true;
  data: Explanation;
}

export interface ExplainError {
  success: false;
  error: string;
}

export type ApiResponse = ExplainResponse | ExplainError;
