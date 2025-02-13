import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

import { AgentThought, AgentAction, CriteriaScores } from '../types/evaluation';

export interface EvaluationResult {
  decision: 'Pass' | 'Fail';
  score: number;
  feedback: string;
  criteriaScores?: CriteriaScores;
  agentThoughts?: AgentThought[];
  agentActions?: AgentAction[];
  payment?: PaymentResult | { error: string };
}

export interface PaymentResult {
  success: boolean;
  transactionHash: string;
  amount: string;
  taskId: string;
}

export type TaskType = 'paraphrase' | 'factCheck';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const evaluateSubmission = async (
  text: string,
  taskType: TaskType,
  walletAddress: string
): Promise<EvaluationResult> => {
  const response = await api.post('/evaluate', { text, taskType, walletAddress });
  return response.data;
};

export const processPayment = async (
  recipientAddress: string,
  taskId: string
): Promise<PaymentResult> => {
  const response = await api.post('/payment/process', {
    recipientAddress,
    taskId,
  });
  return response.data;
};
