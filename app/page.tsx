'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Weather } from '@/components/weather';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-800">Weather Assistant</h1>
        <p className="text-sm text-gray-500">Ask me about the weather anywhere!</p>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Try asking: &quot;What&apos;s the weather in New York?&quot;</p>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-2'
                  : 'space-y-3'
              }`}
            >
              {message.parts.map((part, index) => {
                // Handle text parts
                if (part.type === 'text') {
                  if (message.role === 'user') {
                    return <span key={index}>{part.text}</span>;
                  }
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl rounded-bl-md px-4 py-2 shadow-sm"
                    >
                      {part.text}
                    </div>
                  );
                }

                // Handle weather tool parts
                if (part.type === 'tool-displayWeather') {
                  switch (part.state) {
                    case 'input-available':
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-4 shadow-sm animate-pulse"
                        >
                          <div className="flex items-center gap-2 text-gray-500">
                            <svg
                              className="w-5 h-5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            <span>
                              Getting weather for{' '}
                              {(part.input as { location: string })?.location}...
                            </span>
                          </div>
                        </div>
                      );
                    case 'output-available':
                      return (
                        <Weather
                          key={index}
                          {...(part.output as {
                            location: string;
                            weather: string;
                            temperature: number;
                            humidity: number;
                          })}
                        />
                      );
                    case 'output-error':
                      return (
                        <div
                          key={index}
                          className="bg-red-50 text-red-600 rounded-xl p-4"
                        >
                          Error loading weather: {part.errorText}
                        </div>
                      );
                    default:
                      return null;
                  }
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t bg-white p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about the weather..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white rounded-full px-6 py-2 font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
