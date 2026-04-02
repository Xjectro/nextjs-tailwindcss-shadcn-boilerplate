'use client';

import { Button } from '@/shared/ui/primitives/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-center text-muted-foreground">
            {error.message || 'A critical error occurred.'}
          </p>
          <Button variant="default" onClick={reset}>
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}
