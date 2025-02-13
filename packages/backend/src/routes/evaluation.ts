import { Router } from 'express';
import { evaluateSubmission } from '../services/evaluationService';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { text, taskType } = req.body;
    
    if (!text || !taskType) {
      return res.status(400).json({ 
        error: 'Missing required fields: text and taskType' 
      });
    }

    if (!['paraphrase', 'factCheck'].includes(taskType)) {
      return res.status(400).json({ 
        error: 'Invalid taskType. Must be either "paraphrase" or "factCheck"' 
      });
    }

    const result = await evaluateSubmission(text, taskType);
    res.json(result);
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ 
      error: 'Error processing submission' 
    });
  }
});

export const evaluationRouter = router;
