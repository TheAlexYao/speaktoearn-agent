import express, { Router, Request, Response, NextFunction } from 'express';
import { evaluateSubmission } from '../services/evaluationService';
import { processPayment, getTaskSession } from '../services/paymentService';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { EvaluationResult } from '../types';

interface EvaluationRequest {
  text: string;
  taskType: 'paraphrase' | 'factCheck';
  walletAddress: string;
}

const router = Router();

const handleEvaluation: express.RequestHandler = async (req, res, next) => {
  try {
    console.log('Received evaluation request:', req.body);
    
    const { text, taskType, walletAddress } = req.body as EvaluationRequest;
    
    if (!text || !taskType || !walletAddress) {
      console.log('Missing fields:', { text: !!text, taskType: !!taskType, walletAddress: !!walletAddress });
      res.status(400).json({ 
        error: 'Missing required fields: text, taskType, and walletAddress' 
      });
      return;
    }

    if (!ethers.utils.isAddress(walletAddress)) {
      res.status(400).json({
        error: 'Invalid wallet address'
      });
      return;
    }

    if (!['paraphrase', 'factCheck'].includes(taskType)) {
      res.status(400).json({ 
        error: 'Invalid taskType. Must be either "paraphrase" or "factCheck"' 
      });
      return;
    }

    const taskId = uuidv4();
    const result = await evaluateSubmission(text, taskType, taskId);

    if (result.decision === 'Pass' && result.score >= 70) {
      try {
        const payment = await processPayment(walletAddress, taskId);
        const session = getTaskSession(taskId);
        const evaluationStep = session?.steps.find((s: { type: string }) => s.type === 'evaluation');
        res.status(200).json({
          ...result,
          agentThoughts: evaluationStep?.details?.agentThoughts,
          agentActions: evaluationStep?.details?.agentActions,
          payment
        });
      } catch (paymentError) {
        console.error('Payment failed:', paymentError);
        res.status(200).json({
          ...result,
          payment: { error: 'Payment processing failed' }
        });
      }
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Evaluation error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

router.post('/', handleEvaluation);

export default router;
