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

export interface BlockchainStep {
  id: string;
  timestamp: number;
  type: 'contract_call' | 'transaction' | 'balance_check' | 'evaluation';
  status: 'pending' | 'success' | 'error';
  description: string;
  details?: {
    transactionHash?: string;
    blockExplorerUrl?: string;
    balance?: string;
    evaluationResult?: {
      score: number;
      feedback: string;
      criteria_scores?: Record<string, number>;
    };
    error?: string;
    agentThoughts?: AgentThought[];
    agentActions?: AgentAction[];
  };
}

export interface TaskSession {
  taskId: string;
  steps: BlockchainStep[];
  completed: boolean;
  recipientAddress?: string;
}
