export interface AgentThought {
  thought: string;
  reasoning: string;
  plan?: string[];
  criticism?: string;
  improvement?: string;
}

export interface AgentAction {
  action: string;
  input: any;
  output: any;
  success: boolean;
  error?: string;
}

export interface CriteriaScores {
  accuracy: number;
  clarity: number;
  completeness: number;
}

export interface EvaluationResult {
  decision: 'Pass' | 'Fail';
  score: number;
  feedback: string;
  criteriaScores?: CriteriaScores;
  agentThoughts?: AgentThought[];
  agentActions?: AgentAction[];
}
