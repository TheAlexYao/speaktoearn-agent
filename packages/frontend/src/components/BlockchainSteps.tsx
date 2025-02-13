import { FC, ReactNode } from 'react';
import { BlockchainStep, AgentThought, AgentAction } from '../../../backend/src/types/blockchain';
import { useBlockchain } from '../contexts/BlockchainContext';

const StepIcon = ({ type }: { type: BlockchainStep['type'] }) => {
  const icons = {
    contract_call: '📝',
    transaction: '💸',
    balance_check: '💰',
    evaluation: '🤖',
  };
  return <span className="text-2xl">{icons[type]}</span>;
};

const StepStatus = ({ status }: { status: BlockchainStep['status'] }) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AgentThoughts: FC<{ thoughts: AgentThought[] }> = ({ thoughts }) => {
  if (!thoughts?.length) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-medium mb-2">Agent Thoughts</h3>
      <div className="space-y-4">
        {thoughts.map((thought, index) => (
          <div key={index} className="bg-blue-50 p-3 rounded-lg">
            <div className="font-medium text-blue-900">{thought.thought}</div>
            <div className="text-sm text-blue-700 mt-1">{thought.reasoning}</div>
            {thought.plan && (
              <div className="mt-2">
                <div className="text-sm font-medium text-blue-900">Plan:</div>
                <ul className="list-disc list-inside text-sm text-blue-700">
                  {thought.plan.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
            {(thought.criticism || thought.improvement) && (
              <div className="mt-2 space-y-1">
                {thought.criticism && (
                  <div className="text-sm text-red-600">
                    <span className="font-medium">Criticism:</span> {thought.criticism}
                  </div>
                )}
                {thought.improvement && (
                  <div className="text-sm text-green-600">
                    <span className="font-medium">Improvement:</span> {thought.improvement}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const formatValue = (value: unknown): ReactNode => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value, null, 2);
};

const AgentActions: FC<{ actions: AgentAction[] }> = ({ actions }) => {
  if (!actions?.length) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-medium mb-2">Agent Actions</h3>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="font-medium">{action.action}</div>
              <div className={`text-sm font-medium ${action.success ? 'text-green-600' : 'text-red-600'}`}>
                {action.success ? 'Success' : 'Failed'}
              </div>
            </div>
            <div className="mt-2 space-y-2">
              <div>
                <div className="text-sm font-medium">Input:</div>
                <pre className="text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  {formatValue(action.input)}
                </pre>
              </div>
              {action.output && (
                <div>
                  <div className="text-sm font-medium">Output:</div>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                    {typeof action.output === 'string' ? action.output : JSON.stringify(action.output, null, 2)}
                  </pre>
                </div>
              )}
              {action.error && (
                <div className="text-sm text-red-600">
                  <span className="font-medium">Error:</span> {action.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EvaluationDetails = ({ details }: { details: BlockchainStep['details'] }) => {
  if (!details?.evaluationResult) return null;

  const { score, feedback, criteria_scores } = details.evaluationResult;

  return (
    <div className="mt-2 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Score:</span>
          <span className="text-lg">{String(score)}/100</span>
        </div>
        <div>
          <span className="font-medium">Feedback:</span>
          <p className="text-gray-600">{feedback ? String(feedback) : ''}</p>
        </div>
        {criteria_scores && (
          <div>
            <span className="font-medium">Detailed Scores:</span>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {Object.entries(criteria_scores).map(([criterion, score]) => (
                <div key={criterion} className="bg-gray-50 p-2 rounded">
                  <div className="text-sm font-medium capitalize">{criterion}</div>
                  <div className="text-lg">{String(score)}/100</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {details.agentThoughts && (
        <AgentThoughts thoughts={details.agentThoughts} />
      )}

      {details.agentActions && (
        <AgentActions actions={details.agentActions} />
      )}
    </div>
  );
};

const TransactionDetails = ({ details }: { details: BlockchainStep['details'] }) => {
  if (!details?.transactionHash) return null;

  return (
    <div className="mt-2">
      <a
        href={details.blockExplorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
      >
        <span>View on Celoscan</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
};

const BlockchainSteps = () => {
  const { steps } = useBlockchain();

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold mb-4">Transaction Steps</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StepIcon type={step.type} />
                <div>
                  <div className="font-medium">{step.description}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(step.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <StepStatus status={step.status} />
            </div>

            {step.type === 'evaluation' && (
              <EvaluationDetails details={step.details} />
            )}

            {(step.type === 'transaction' || step.type === 'contract_call') && (
              <TransactionDetails details={step.details} />
            )}

            {step.type === 'balance_check' && step.details?.balance && (
              <div className="mt-2">
                <span className="font-medium">Balance: </span>
                <span>{step.details.balance} CELO</span>
              </div>
            )}

            {step.details?.error && (
              <div className="mt-2 text-red-600">
                Error: {step.details.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainSteps;
