'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

// Type definitions for the UI specification
export interface UISpec {
  component: string;
  props?: Record<string, unknown>;
  children?: UISpec[] | string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

// Component registry - basic components only
const componentRegistry: Record<string, AnyComponent> = {
  // Card components
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,

  // Basic components
  Badge,
  Button,
  Progress,
  Separator,
  Skeleton,

  // Alert components
  Alert,
  AlertTitle,
  AlertDescription,
};

// HTML element components for basic layout
const htmlElements = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em'];

function renderUISpec(spec: UISpec, key?: string | number): React.ReactNode {
  const { component, props = {}, children } = spec;

  // Handle text nodes
  if (component === 'text' && typeof children === 'string') {
    return children;
  }

  // Handle HTML elements
  if (htmlElements.includes(component)) {
    const childContent = Array.isArray(children)
      ? children.map((child, index) =>
          typeof child === 'string' ? child : renderUISpec(child, index)
        )
      : children;

    return React.createElement(
      component,
      { ...props, key },
      childContent
    );
  }

  // Handle registered components
  const Component = componentRegistry[component];
  if (!Component) {
    console.warn(`Unknown component: ${component}`);
    return null;
  }

  // Render children
  let renderedChildren: React.ReactNode = null;
  if (children) {
    if (typeof children === 'string') {
      renderedChildren = children;
    } else if (Array.isArray(children)) {
      renderedChildren = children.map((child, index) =>
        typeof child === 'string' ? child : renderUISpec(child, index)
      );
    }
  }

  return (
    <Component key={key} {...props}>
      {renderedChildren}
    </Component>
  );
}

interface UIRendererProps {
  spec: UISpec;
}

export function UIRenderer({ spec }: UIRendererProps) {
  return <>{renderUISpec(spec)}</>;
}

// Loading state component
export function UIRendererLoading() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  );
}
