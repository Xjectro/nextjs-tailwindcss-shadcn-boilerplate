'use client';

import { Button } from '@/shared/ui/primitives/button';
import { useTranslations } from 'next-intl';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const t = useTranslations('common');

  return (
    <html lang="en">
      <body className="font-sans">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold">{t('something_went_wrong')}</h1>
          <p className="max-w-md text-center text-muted-foreground">
            {error.message || t('critical_error')}
          </p>
          <Button variant="default" onClick={reset}>
            {t('try_again')}
          </Button>
        </div>
      </body>
    </html>
  );
}
