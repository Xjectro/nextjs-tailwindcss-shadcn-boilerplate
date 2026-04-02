'use client';

import { Button } from '@/shared/ui/primitives/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button variant="default" asChild>
        <a href="/">Go Home</a>
      </Button>
    </div>
  );
}
