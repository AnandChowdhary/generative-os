'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { UIRenderer, UIRendererLoading, UISpec } from '@/components/ui-renderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Generative UI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Ask me anything - I&apos;ll create dynamic UI to show you the answer
        </p>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-8 space-y-2">
            <p>Try asking:</p>
            <ul className="space-y-1 text-sm">
              <li>&quot;What&apos;s the weather in Tokyo?&quot;</li>
              <li>&quot;Show me a comparison of programming languages&quot;</li>
              <li>&quot;Create a user profile card&quot;</li>
              <li>&quot;Display some sample data in a table&quot;</li>
            </ul>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2'
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
                      className="bg-muted rounded-2xl rounded-bl-md px-4 py-2"
                    >
                      {part.text}
                    </div>
                  );
                }

                // Handle renderUI tool parts
                if (part.type === 'tool-renderUI') {
                  switch (part.state) {
                    case 'input-available':
                      return <UIRendererLoading key={index} />;
                    case 'output-available':
                      const output = part.output as { ui: UISpec; title?: string };
                      return (
                        <div key={index} className="space-y-2">
                          {output.title && (
                            <p className="text-sm text-muted-foreground">{output.title}</p>
                          )}
                          <UIRenderer spec={output.ui} />
                        </div>
                      );
                    case 'output-error':
                      return (
                        <div
                          key={index}
                          className="bg-destructive/10 text-destructive rounded-xl p-4"
                        >
                          Error rendering UI: {part.errorText}
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
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
