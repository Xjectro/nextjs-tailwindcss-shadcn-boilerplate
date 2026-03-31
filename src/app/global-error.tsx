'use client';

import { Button } from '@/shared/ui/primitives/button';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    return (
        <html lang="en">
            <body>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        gap: '1rem',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#666', maxWidth: '400px', textAlign: 'center' }}>
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
