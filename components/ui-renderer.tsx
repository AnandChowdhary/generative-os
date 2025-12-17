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

// Loading state component - matches the thinking orb style
export function UIRendererLoading() {
  return (
    <div className="flex flex-col items-center gap-6 animate-float py-8">
      <div className="relative flex items-center justify-center">
        {/* Ripple effects */}
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-violet-400/30 to-pink-400/30 animate-ripple" />
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-violet-400/20 to-pink-400/20 animate-ripple" style={{ animationDelay: '0.5s' }} />

        {/* Main orb */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 animate-breathe animate-glow flex items-center justify-center">
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
          <div className="w-6 h-6 rounded-full bg-white/50 backdrop-blur-sm" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground/70 tracking-wide">
        creating...
      </p>
    </div>
  );
}
