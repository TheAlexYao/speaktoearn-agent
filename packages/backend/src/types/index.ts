export interface CriteriaScores {
  accuracy: number;
  clarity: number;
  completeness: number;
}

export interface EvaluationResult {
  decision: 'Pass' | 'Fail';
  score: number;
  feedback: string;
  criteriaScores: CriteriaScores;
}

export interface PaymentResult {
  success: boolean;
  transactionHash: string;
  amount: string;
  taskId: string;
}
