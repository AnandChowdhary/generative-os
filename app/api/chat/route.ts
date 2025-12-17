import {
  streamText,
  convertToModelMessages,
  UIMessage,
  stepCountIs,
  createGateway,
} from 'ai';
import { tools } from '@/ai/tools';

// Create Vercel AI Gateway provider
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4'),
    system: `You are a friendly weather assistant. When users ask about weather for any location, use the displayWeather tool to show them a beautiful weather widget. Be helpful and conversational.`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });

  return result.toUIMessageStreamResponse();
}
