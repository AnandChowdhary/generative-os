'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useMemo, useEffect } from 'react';
import { UIRenderer, UISpec } from '@/components/ui-renderer';
import { parse as parsePartialJson } from 'partial-json';

// Parse text content and extract UI blocks and text segments
function parseContent(text: string): Array<{ type: 'text' | 'ui'; content: string }> {
  const parts: Array<{ type: 'text' | 'ui'; content: string }> = [];
  const regex = /```ui\n([\s\S]*?)(?:```|$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }
    // Add the UI block
    parts.push({ type: 'ui', content: match[1] });
    lastIndex = regex.lastIndex;
  }

  // Add remaining text after last code block
  if (lastIndex < text.length) {
    const textContent = text.slice(lastIndex).trim();
    if (textContent) {
      parts.push({ type: 'text', content: textContent });
    }
  }

  return parts;
}

// Try to parse JSON, handling partial JSON during streaming
function tryParseUI(jsonString: string): UISpec | null {
  try {
    const parsed = parsePartialJson(jsonString.trim());
    if (parsed && typeof parsed === 'object' && 'component' in parsed) {
      return parsed as UISpec;
    }
  } catch {
    // Parsing failed
  }
  return null;
}

export default function Page() {
  const [input, setInput] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get only the last user message and the last assistant message
  const lastMessages = useMemo(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    return { user: lastUserMsg, assistant: lastAssistantMsg };
  }, [messages]);

  // Get the full text from the assistant message
  const assistantText = useMemo(() => {
    if (!lastMessages.assistant) return '';
    return lastMessages.assistant.parts
      .filter(part => part.type === 'text')
      .map(part => (part as { type: 'text'; text: string }).text)
      .join('');
  }, [lastMessages.assistant]);

  // Parse the content into text and UI parts
  const parsedContent = useMemo(() => parseContent(assistantText), [assistantText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  const greeting = currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening';
  const timeString = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateString = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col min-h-screen os-background overflow-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/[0.07] to-transparent blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-500/[0.05] to-transparent blur-3xl" />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/[0.03] to-transparent blur-3xl animate-float" style={{ animationDuration: '20s' }} />
      </div>

      {/* Minimal OS-style header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 animate-ping opacity-75" />
          </div>
          <span className="text-sm font-medium tracking-widest text-foreground/40 uppercase">os</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-light text-foreground/60">{timeString}</p>
          <p className="text-xs text-foreground/30">{dateString}</p>
        </div>
      </header>

      {/* Main content area - centered */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-36">
        {messages.length === 0 ? (
          <div className="text-center space-y-8 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Greeting */}
            <div className="space-y-3">
              <h1 className="text-5xl font-extralight tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Good {greeting}
              </h1>
              <p className="text-xl font-light text-muted-foreground/80">
                How can I help you today?
              </p>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { label: 'Schedule', query: "What's on my calendar today?" },
                { label: 'Weather', query: "How's the weather looking?" },
                { label: 'Emails', query: 'Do I have any new emails?' },
                { label: 'Tasks', query: 'What do I need to do today?' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setInput(item.query)}
                  className="group px-5 py-2.5 rounded-full border border-foreground/10 hover:border-foreground/20 bg-foreground/[0.02] hover:bg-foreground/[0.05] backdrop-blur-sm transition-all duration-300"
                >
                  <span className="text-sm font-light text-foreground/50 group-hover:text-foreground/70 transition-colors">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">
            {/* Last user message */}
            {lastMessages.user && (
              <div className="text-center">
                <p className="text-lg font-light text-foreground/40 italic">
                  &ldquo;{lastMessages.user.parts
                    .filter(part => part.type === 'text')
                    .map(part => (part as { type: 'text'; text: string }).text)
                    .join('')}&rdquo;
                </p>
              </div>
            )}

            {/* Parsed content - text and UI blocks */}
            <div className="space-y-6">
              {parsedContent.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <p key={index} className="text-center text-lg font-light text-foreground/80 leading-relaxed">
                      {part.content}
                    </p>
                  );
                }

                if (part.type === 'ui') {
                  const uiSpec = tryParseUI(part.content);
                  if (uiSpec) {
                    return (
                      <div key={index} className="flex justify-center">
                        <div className="relative">
                          <UIRenderer spec={uiSpec} />
                          {isLoading && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 animate-pulse" />
                          )}
                        </div>
                      </div>
                    );
                  }
                  // UI is still being generated - show partial or loading
                  return (
                    <div key={index} className="flex justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 animate-ripple" />
                          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 animate-breathe animate-glow flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-white/40" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {/* Show loading when streaming but no content yet */}
              {isLoading && parsedContent.length === 0 && (
                <div className="flex flex-col items-center gap-6 animate-float">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 animate-ripple" />
                    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-violet-500/15 to-pink-500/15 animate-ripple" style={{ animationDelay: '0.6s' }} />
                    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-violet-500/10 to-pink-500/10 animate-ripple" style={{ animationDelay: '1.2s' }} />

                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 animate-breathe animate-glow flex items-center justify-center">
                      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
                      <div className="w-5 h-5 rounded-full bg-white/40 backdrop-blur-sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/95 to-transparent z-50">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-full opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="relative w-full h-14 px-6 rounded-full border border-foreground/10 bg-foreground/[0.03] backdrop-blur-xl text-base font-light placeholder:text-foreground/30 focus:outline-none focus:border-foreground/20 transition-all duration-300 disabled:opacity-50"
            />
            {input && (
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-white opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
