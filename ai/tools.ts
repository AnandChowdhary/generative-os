import { tool as createTool } from 'ai';
import { z } from 'zod';

// Type for UI specifications
interface UISpec {
  component: string;
  props?: Record<string, unknown>;
  children?: UISpec[] | string;
}

// Base schema for UI specifications
const baseUISpecSchema = z.object({
  component: z.string().describe('The component name'),
  props: z.record(z.string(), z.unknown()).optional().describe('Props to pass to the component'),
  children: z.any().optional().describe('Child components or text content'),
});

export const renderUITool = createTool({
  description: `Render a dynamic UI component using shadcn/ui components.

Available components:
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Badge, Button, Progress, Separator, Alert, AlertTitle, AlertDescription

HTML elements: div, span, p, h1, h2, h3, h4, h5, h6, ul, ol, li, strong, em

Example:
{
  "component": "Card",
  "props": { "className": "w-full max-w-md" },
  "children": [
    { "component": "CardHeader", "children": [
      { "component": "CardTitle", "children": "Title" }
    ]},
    { "component": "CardContent", "children": [
      { "component": "p", "children": "Content here" }
    ]}
  ]
}`,
  inputSchema: z.object({
    ui: baseUISpecSchema.describe('The UI specification to render'),
    title: z.string().optional().describe('A brief title describing what this UI shows'),
  }),
  execute: async function (input: { ui: UISpec; title?: string }) {
    return { ui: input.ui, title: input.title };
  },
});

export const tools = {
  renderUI: renderUITool,
};
