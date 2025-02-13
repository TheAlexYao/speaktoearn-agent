import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { EvaluationResult } from '../types';
import { BlockchainStep, AgentThought, AgentAction } from '../types/blockchain';
import { getTaskSession, createTaskSession } from './paymentService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const evaluationFunction = {
  name: 'evaluate_submission',
  description: 'Evaluate a text submission for quality and provide detailed feedback',
  parameters: {
    type: 'object',
    properties: {
      decision: {
        type: 'string',
        enum: ['Pass', 'Fail'],
        description: 'Whether the submission meets the quality criteria'
      },
      score: {
        type: 'integer',
        minimum: 0,
        maximum: 100,
        description: 'Numerical score for the submission'
      },
      feedback: {
        type: 'string',
        description: 'Detailed feedback explaining the evaluation'
      },
      criteria_scores: {
        type: 'object',
        properties: {
          accuracy: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            description: 'Score for factual accuracy'
          },
          clarity: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            description: 'Score for clarity and understandability'
          },
          completeness: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            description: 'Score for completeness of response'
          }
        },
        required: ['accuracy', 'clarity', 'completeness']
      }
    },
    required: ['decision', 'score', 'feedback', 'criteria_scores']
  }
};

export async function evaluateSubmission(
  text: string,
  taskType: 'paraphrase' | 'factCheck',
  taskId: string
): Promise<EvaluationResult> {
  const agentThoughts: AgentThought[] = [];
  const agentActions: AgentAction[] = [];
  // Create or get session
  let session = getTaskSession(taskId);
  if (!session) {
    session = createTaskSession(taskId);
  }

  // Initial agent thought
  agentThoughts.push({
    thought: 'Initiating evaluation process',
    reasoning: `Need to evaluate a ${taskType} submission using GPT-4o with function calling`,
    plan: [
      'Analyze submission content',
      'Use GPT-4o to evaluate based on criteria',
      'Process evaluation results',
      'Return structured feedback'
    ]
  });

  const step: BlockchainStep = {
    id: uuidv4(),
    timestamp: Date.now(),
    type: 'evaluation',
    status: 'pending',
    description: `Evaluating ${taskType} submission`,
    details: {
      agentThoughts,
      agentActions
    }
  };

  let apiAction: AgentAction | undefined;

  try {
    // Record agent action for API call
    apiAction = {
      action: 'call_gpt4o_api',
      input: {
        taskType,
        text,
        function: evaluationFunction.name
      },
      output: null,
      success: false
    };
    agentActions.push(apiAction);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert evaluator specializing in ${taskType} analysis. Evaluate the submission based on accuracy, clarity, and completeness.`
        },
        {
          role: "user",
          content: `Please evaluate this ${taskType}:\n\n${text}`
        }
      ],
      tools: [{ type: "function", function: evaluationFunction }],
      tool_choice: { type: "function", function: { name: "evaluate_submission" } }
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No evaluation result received');
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    // Record successful API response
    apiAction.success = true;
    apiAction.output = result;

    // Add agent thought about the evaluation result
    agentThoughts.push({
      thought: 'Evaluation completed successfully',
      reasoning: `The ${taskType} submission received a score of ${result.score}/100`,
      criticism: result.score < 70 ? 'Score is below acceptable threshold' : undefined,
      improvement: result.score < 70 ? 'Provide more detailed feedback for improvement' : undefined
    });

    step.status = 'success';
    step.details = {
      evaluationResult: result,
      agentThoughts,
      agentActions
    };

    session.steps.push(step);

    return {
      decision: result.decision,
      score: result.score,
      feedback: result.feedback,
      criteriaScores: result.criteria_scores
    };

  } catch (error: unknown) {
    // Record error in agent thought and action
    agentThoughts.push({
      thought: 'Evaluation failed',
      reasoning: 'Encountered an error during evaluation process',
      criticism: 'Error handling could be improved',
      improvement: 'Implement retry mechanism for transient errors'
    });

    if (apiAction) {
      apiAction.success = false;
      apiAction.error = error instanceof Error ? error.message : 'An unknown error occurred';
    }

    step.status = 'error';
    step.details = { 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      agentThoughts,
      agentActions
    };
    session.steps.push(step);
    throw error;
  }
}
