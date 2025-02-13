import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { evaluationRouter } from './routes/evaluation';
import { paymentRouter } from './routes/payment';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug logging
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('CELO_RPC_URL exists:', !!process.env.CELO_RPC_URL);
console.log('CONTRACT_ADDRESS exists:', !!process.env.CONTRACT_ADDRESS);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/evaluate', evaluationRouter);
app.use('/api/payment', paymentRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
