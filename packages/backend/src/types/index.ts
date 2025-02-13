export interface CriteriaScores {
  accuracy: number;
  clarity: number;
  completeness: number;
}

import { AgentThought, AgentAction } from './blockchain';

export interface EvaluationResult {
  decision: 'Pass' | 'Fail';
  score: number;
  feedback: string;
  criteriaScores: CriteriaScores;
  agentThoughts?: AgentThought[];
  agentActions?: AgentAction[];
}

export interface PaymentResult {
  success: boolean;
  transactionHash: string;
  amount: string;
  taskId: string;
}
