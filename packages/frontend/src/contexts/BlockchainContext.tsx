import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlockchainStep, TaskSession } from '../../../backend/src/types/blockchain';

interface BlockchainContextType {
  currentSession?: TaskSession;
  setCurrentSession: (session: TaskSession) => void;
  steps: BlockchainStep[];
  addStep: (step: BlockchainStep) => void;
  clearSteps: () => void;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<TaskSession>();
  const [steps, setSteps] = useState<BlockchainStep[]>([]);

  useEffect(() => {
    if (currentSession) {
      setSteps(currentSession.steps);
    }
  }, [currentSession]);

  const addStep = (step: BlockchainStep) => {
    setSteps(prev => [...prev, step]);
  };

  const clearSteps = () => {
    setSteps([]);
    setCurrentSession(undefined);
  };

  return (
    <BlockchainContext.Provider
      value={{
        currentSession,
        setCurrentSession,
        steps,
        addStep,
        clearSteps,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}
