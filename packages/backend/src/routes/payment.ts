import { Router } from 'express';
import { processPayment } from '../services/paymentService';

const router = Router();

router.post('/process', async (req, res) => {
  try {
    const { recipientAddress, taskId } = req.body;
    
    if (!recipientAddress || !taskId) {
      return res.status(400).json({ 
        error: 'Missing required fields: recipientAddress and taskId' 
      });
    }

    const result = await processPayment(recipientAddress, taskId);
    res.json(result);
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      error: 'Error processing payment' 
    });
  }
});

export const paymentRouter = router;
