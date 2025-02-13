import React, { createContext, useContext, useState, useCallback } from 'react';
import { evaluateSubmission, processPayment, TaskType } from '../services/api';
import { EvaluationResult, AgentThought } from '../types/evaluation';
import { ethers } from 'ethers';

interface Message {
  content: string;
  isUser: boolean;
}

interface ChatContextType {
  messages: Message[];
  selectedTask: TaskType | null;
  isProcessing: boolean;
  selectTask: (task: TaskType) => void;
  submitMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: 'Welcome to SpeakToEarn! Would you like to:\n1. Paraphrase a financial report sentence\n2. Correct a misstated fact',
      isUser: false,
    },
  ]);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectTask = useCallback((task: TaskType) => {
    setSelectedTask(task);
    const taskMessages: { [key in TaskType]: string } = {
      paraphrase: [
        'Task: Paraphrase the following sentence while maintaining its meaning.',
        'Original: "According to the company\'s quarterly report, revenue grew by 12% compared to the previous quarter despite a downturn in global markets."',
        'Example good paraphrase: "Despite challenging global market conditions, the quarterly report indicates a 12% revenue increase compared to the previous period."',
        '\nPlease provide your paraphrase:'
      ].join('\n'),
      factCheck: [
        'Task: Correct the following statement with accurate information.',
        'Incorrect statement: "The capital of Australia is Sydney."',
        'Correct statement: "The capital of Australia is Canberra. Sydney is the capital of New South Wales and the largest city in Australia."',
        '\nPlease provide your correction:'
      ].join('\n'),
    };
    setMessages(prev => [...prev, { content: taskMessages[task], isUser: false }]);
  }, []);

  const submitMessage = useCallback(async (content: string) => {
    if (!selectedTask) {
      // Handle task selection
      if (content === '1') {
        selectTask('paraphrase');
      } else if (content === '2') {
        selectTask('factCheck');
      } else {
        setMessages(prev => [
          ...prev,
          { content, isUser: true },
          { content: 'Please select 1 or 2 to choose a task.', isUser: false },
        ]);
      }
      return;
    }

    // Add user message
    setMessages(prev => [...prev, { content, isUser: true }]);
    setIsProcessing(true);

    try {
      // Get connected wallet address
      const ethereum = window.ethereum;
      if (!ethereum) {
        throw new Error('No ethereum provider found');
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await provider.listAccounts();
      if (!accounts[0]) {
        throw new Error('Please connect your wallet first');
      }
      const walletAddress = accounts[0];

      // Evaluate submission
      const result: EvaluationResult = await evaluateSubmission(content, selectedTask, walletAddress);
      
      // Add evaluation result message
      setMessages(prev => [
        ...prev,
        {
          content: `Evaluation Result:\nDecision: ${result.decision}\nScore: ${result.score}\n\nCriteria Scores:${result.criteriaScores ? `\nAccuracy: ${result.criteriaScores.accuracy}/100\nClarity: ${result.criteriaScores.clarity}/100\nCompleteness: ${result.criteriaScores.completeness}/100` : '\nNo detailed scores available'}\n\nFeedback: ${result.feedback}\n\nAI Agent Thoughts:${result.agentThoughts?.map((t: AgentThought) => `\n\nThought: ${t.thought}\nReasoning: ${t.reasoning}${t.plan ? `\nPlan:\n${t.plan.map(p => `- ${p}`).join('\n')}` : ''}${t.criticism ? `\nCriticism: ${t.criticism}` : ''}${t.improvement ? `\nImprovement: ${t.improvement}` : ''}`).join('') || '\nNo agent thoughts recorded.'}`,
          isUser: false,
        },
      ]);

      // If passed, process payment
      if (result.decision === 'Pass') {
        const paymentResult = await processPayment(walletAddress, Date.now().toString());
        
        setMessages(prev => [
          ...prev,
          {
            content: `Payment processed!\nTransaction Hash: ${paymentResult.transactionHash}\nView on Celoscan: https://alfajores.celoscan.io/tx/${paymentResult.transactionHash}\nAmount: ${ethers.utils.formatEther(paymentResult.amount)} CELO`,
            isUser: false,
          },
          {
            content: 'Would you like to try another task?\n1. Paraphrase a financial report sentence\n2. Correct a misstated fact',
            isUser: false,
          },
        ]);
        setSelectedTask(null);
      } else {
        setMessages(prev => [
          ...prev,
          {
            content: 'Would you like to try again with the same task?',
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          content: 'Sorry, there was an error processing your submission. Please try again.',
          isUser: false,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTask, selectTask]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        selectedTask,
        isProcessing,
        selectTask,
        submitMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
