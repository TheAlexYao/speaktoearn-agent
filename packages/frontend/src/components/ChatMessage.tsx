import React from 'react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser }) => {
  // Function to format the content with markdown-like syntax
  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('Original:') || line.startsWith('Incorrect statement:')) {
        return (
          <div key={index} className="my-2 p-2 bg-red-100 rounded border border-red-200">
            <strong className="text-red-700">{line.split(':')[0]}:</strong>
            <span className="text-red-900">{line.split(':')[1]}</span>
          </div>
        );
      }
      if (line.startsWith('Example good paraphrase:') || line.startsWith('Correct statement:')) {
        return (
          <div key={index} className="my-2 p-2 bg-green-100 rounded border border-green-200">
            <strong className="text-green-700">{line.split(':')[0]}:</strong>
            <span className="text-green-900">{line.split(':')[1]}</span>
          </div>
        );
      }
      if (line.startsWith('Task:')) {
        return (
          <div key={index} className="font-bold text-lg mb-2 text-gray-800">
            {line}
          </div>
        );
      }
      if (line.includes('decision') || line.includes('score') || line.includes('feedback')) {
        return (
          <div key={index} className="my-1 font-mono bg-gray-50 p-1 rounded">
            {line}
          </div>
        );
      }
      return <div key={index} className="my-1">{line}</div>;
    });
  };

  return (
    <div
      className={`p-4 rounded-lg ${isUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-[80%]`}
    >
      <div className="space-y-1">
        {formatContent(content)}
      </div>
    </div>
  );
};

export default ChatMessage;
