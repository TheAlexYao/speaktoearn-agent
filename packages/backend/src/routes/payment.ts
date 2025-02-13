import express, { Router } from 'express';
import { processPayment } from '../services/paymentService';

interface PaymentRequest {
  recipientAddress: string;
  taskId: string;
}

const router = Router();

const handlePayment: express.RequestHandler = async (req, res, next) => {
  try {
    const { recipientAddress, taskId } = req.body as PaymentRequest;
    
    if (!recipientAddress || !taskId) {
      res.status(400).json({ 
        error: 'Missing required fields: recipientAddress and taskId' 
      });
      return;
    }

    const result = await processPayment(recipientAddress, taskId);
    res.json(result);
  } catch (error) {
    console.error('Payment error:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        error: error.message || 'Error processing payment'
      });
    } else {
      res.status(500).json({ 
        error: 'Unknown error processing payment'
      });
    }
  }
};

router.post('/process', handlePayment);

export const paymentRouter = router;
