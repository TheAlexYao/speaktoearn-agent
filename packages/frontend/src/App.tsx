import { useEffect } from 'react'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import BlockchainSteps from './components/BlockchainSteps'
import { ChatProvider, useChat } from './contexts/ChatContext'
import { BlockchainProvider } from './contexts/BlockchainContext'

function Chat() {
  const { messages, isProcessing, submitMessage } = useChat();

  useEffect(() => {
    // Scroll to bottom when messages change
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">SpeakToEarn AI Agent</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-4 space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  content={message.content}
                  isUser={message.isUser}
                />
              ))}
              {isProcessing && (
                <div className="flex justify-center">
                  <div className="animate-pulse text-gray-500">Processing...</div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <ChatInput onSubmit={submitMessage} disabled={isProcessing} />
            </div>
          </div>

          {/* Blockchain Steps Panel */}
          <div className="bg-white shadow rounded-lg">
            <BlockchainSteps />
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <ChatProvider>
      <BlockchainProvider>
        <Chat />
      </BlockchainProvider>
    </ChatProvider>
  )
}

export default App
