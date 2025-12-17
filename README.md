# Generative OS

An AI-powered operating system interface inspired by the movie *Her*. A conversational UI where everything is generated on-demand — schedules, weather, emails, tasks, and more — all rendered as dynamic, streaming UI components.

## Features

- **Generative UI**: AI responses stream in real-time, building UI components progressively as they're generated
- **Her-inspired Design**: Minimal, warm, and ambient interface with subtle animations
- **Dynamic Components**: Uses shadcn/ui components (Card, Badge, Progress, etc.) rendered from JSON specifications
- **Streaming JSON**: Partial JSON parsing enables UI to render incrementally during generation

## Tech Stack

- **Next.js 16** with App Router
- **Vercel AI SDK** for streaming chat
- **shadcn/ui** for components
- **Tailwind CSS** for styling
- **partial-json** for streaming JSON parsing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your AI Gateway API key to `.env`:
   ```
   AI_GATEWAY_API_KEY=your_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## How It Works

The AI responds with markdown containing ```` ```ui ```` code blocks with JSON UI specifications:

```json
{
  "component": "Card",
  "props": { "className": "w-full max-w-md" },
  "children": [
    { "component": "CardHeader", "children": [
      { "component": "CardTitle", "children": "Weather" }
    ]},
    { "component": "CardContent", "children": [
      { "component": "p", "children": "72°F and sunny" }
    ]}
  ]
}
```

As the JSON streams in character-by-character, the `partial-json` library parses incomplete JSON, and components render progressively.

## Available Components

- **Card**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Display**: `Badge`, `Button`, `Progress`, `Alert`, `AlertTitle`, `AlertDescription`, `Separator`
- **HTML**: `div`, `span`, `p`, `h1`-`h6`, `ul`, `ol`, `li`, `strong`, `em`

## License

MIT
