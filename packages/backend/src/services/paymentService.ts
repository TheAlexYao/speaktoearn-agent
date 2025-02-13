import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { PaymentResult } from '../types';
import { contractABI } from '../config/contract';
import { BlockchainStep, TaskSession } from '../types/blockchain';

const EXPLORER_URL = 'https://alfajores.celoscan.io';

if (!process.env.CELO_RPC_URL) {
  throw new Error('CELO_RPC_URL environment variable is not set');
}

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is not set');
}

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error('CONTRACT_ADDRESS environment variable is not set');
}

const provider = new ethers.providers.JsonRpcProvider(process.env.CELO_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

// Verify contract connection
contract.getContractBalance().catch((error: Error) => {
  console.error('Failed to connect to contract:', error);
  throw new Error('Failed to connect to contract. Please check your configuration.');
});

// In-memory store for task sessions
const taskSessions = new Map<string, TaskSession>();

export function getTaskSession(taskId: string): TaskSession | undefined {
  return taskSessions.get(taskId);
}

export function createTaskSession(taskId: string): TaskSession {
  const session: TaskSession = {
    taskId,
    steps: [],
    completed: false
  };
  taskSessions.set(taskId, session);
  return session;
}

function addStep(taskId: string, step: BlockchainStep) {
  const session = taskSessions.get(taskId);
  if (session) {
    session.steps.push(step);
  }
  return step;
}

export async function checkContractBalance(taskId: string): Promise<BlockchainStep> {
  const step: BlockchainStep = {
    id: uuidv4(),
    timestamp: Date.now(),
    type: 'balance_check',
    status: 'pending',
    description: 'Checking contract balance'
  };

  try {
    const balance = await contract.getContractBalance();
    step.status = 'success';
    step.details = {
      balance: ethers.utils.formatEther(balance)
    };
  } catch (error: unknown) {
    step.status = 'error';
    step.details = { error: error instanceof Error ? error.message : String(error) };
  }

  return addStep(taskId, step);
}

export async function processPayment(
  recipientAddress: string,
  taskId: string
): Promise<PaymentResult> {
  // Create or get session
  let session = getTaskSession(taskId);
  if (!session) {
    session = createTaskSession(taskId);
  }
  session.recipientAddress = recipientAddress;

  const step: BlockchainStep = {
    id: uuidv4(),
    timestamp: Date.now(),
    type: 'transaction',
    status: 'pending',
    description: `Sending payment to ${recipientAddress}`
  };

  try {
    // First check if task is already processed
    const isProcessed = await contract.processedTasks(taskId);
    if (isProcessed) {
      step.status = 'error';
      step.details = { error: 'Task has already been processed' };
      addStep(taskId, step);
      throw new Error('Task has already been processed');
    }

    // Send payment
    const tx = await contract.sendPayment(recipientAddress, taskId);
    step.details = {
      transactionHash: tx.hash,
      blockExplorerUrl: `${EXPLORER_URL}/tx/${tx.hash}`
    };

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: { event: string }) => e.event === 'PaymentSent');
    
    if (!event) {
      throw new Error('Payment event not found in transaction');
    }

    step.status = 'success';
    session.completed = true;
    addStep(taskId, step);

    return {
      success: true,
      transactionHash: receipt.transactionHash,
      amount: event.args.amount.toString(),
      taskId: event.args.taskId
    };

  } catch (error: unknown) {
    step.status = 'error';
    step.details = { error: error instanceof Error ? error.message : String(error) };
    addStep(taskId, step);
    throw error;
  }
}

export async function depositFunds(amount: string, taskId: string): Promise<BlockchainStep> {
  const step: BlockchainStep = {
    id: uuidv4(),
    timestamp: Date.now(),
    type: 'contract_call',
    status: 'pending',
    description: `Depositing ${amount} CELO to contract`
  };

  try {
    const tx = await contract.depositFunds({
      value: ethers.utils.parseEther(amount)
    });
    step.details = {
      transactionHash: tx.hash,
      blockExplorerUrl: `${EXPLORER_URL}/tx/${tx.hash}`
    };

    await tx.wait();
    step.status = 'success';

  } catch (error: unknown) {
    step.status = 'error';
    step.details = { error: error instanceof Error ? error.message : String(error) };
  }

  return addStep(taskId, step);
}
