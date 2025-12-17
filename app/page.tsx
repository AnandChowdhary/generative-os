'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useMemo } from 'react';
import { UIRenderer, UIRendererLoading, UISpec } from '@/components/ui-renderer';
import { Input } from '@/components/ui/input';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';

  // Get only the last user message and the last assistant message
  const lastMessages = useMemo(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    return { user: lastUserMsg, assistant: lastAssistantMsg };
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Minimal OS-style header */}
      <header className="px-6 py-4">
        <div className="flex items-center gap-2 text-muted-foreground/60 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>OS</span>
        </div>
      </header>

      {/* Main content area - centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {messages.length === 0 ? (
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-4xl font-light tracking-tight">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
            </h1>
            <p className="text-muted-foreground text-lg">
              How can I help you today?
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground/70">
              <button
                onClick={() => { setInput("What's my schedule today?"); }}
                className="px-3 py-1.5 rounded-full border border-border/50 hover:bg-muted/50 transition-colors"
              >
                What&apos;s my schedule?
              </button>
              <button
                onClick={() => { setInput("How's the weather?"); }}
                className="px-3 py-1.5 rounded-full border border-border/50 hover:bg-muted/50 transition-colors"
              >
                Weather
              </button>
              <button
                onClick={() => { setInput("Any new emails?"); }}
                className="px-3 py-1.5 rounded-full border border-border/50 hover:bg-muted/50 transition-colors"
              >
                Check emails
              </button>
              <button
                onClick={() => { setInput("Play some music"); }}
                className="px-3 py-1.5 rounded-full border border-border/50 hover:bg-muted/50 transition-colors"
              >
                Play music
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-6">
            {/* Last user message - subtle */}
            {lastMessages.user && (
              <div className="text-center">
                <span className="text-muted-foreground text-lg">
                  {lastMessages.user.parts.map((part, index) =>
                    part.type === 'text' ? <span key={index}>{part.text}</span> : null
                  )}
                </span>
              </div>
            )}

            {/* Assistant response */}
            {lastMessages.assistant && (
              <div className="space-y-4">
                {lastMessages.assistant.parts.map((part, index) => {
                  if (part.type === 'text' && part.text.trim()) {
                    return (
                      <p key={index} className="text-center text-foreground/90">
                        {part.text}
                      </p>
                    );
                  }

                  if (part.type === 'tool-renderUI') {
                    switch (part.state) {
                      case 'input-available':
                        return (
                          <div key={index} className="flex justify-center">
                            <UIRendererLoading />
                          </div>
                        );
                      case 'output-available':
                        const output = part.output as { ui: UISpec; title?: string };
                        return (
                          <div key={index} className="flex justify-center">
                            <UIRenderer spec={output.ui} />
                          </div>
                        );
                      case 'output-error':
                        return null; // Silently handle errors for cleaner UX
                      default:
                        return null;
                    }
                  }

                  return null;
                })}
              </div>
            )}

            {/* Loading state - cute thinking animation */}
            {isLoading && (
              <div className="flex flex-col items-center gap-6 animate-float">
                <div className="relative flex items-center justify-center">
                  {/* Ripple effects */}
                  <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-violet-400/30 to-pink-400/30 animate-ripple" />
                  <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-violet-400/20 to-pink-400/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-violet-400/10 to-pink-400/10 animate-ripple" style={{ animationDelay: '1s' }} />

                  {/* Main orb */}
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 animate-breathe animate-glow flex items-center justify-center">
                    {/* Inner shimmer */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
                    {/* Core */}
                    <div className="w-6 h-6 rounded-full bg-white/50 backdrop-blur-sm" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/70 tracking-wide">
                  thinking...
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input - fixed at bottom, minimal */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <Input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="w-full h-12 px-5 rounded-full border-border/50 bg-muted/30 backdrop-blur-sm text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
          />
        </form>
      </div>
    </div>
  );
}
