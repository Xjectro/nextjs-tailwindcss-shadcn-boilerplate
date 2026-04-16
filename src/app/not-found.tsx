'use client';

import { Button } from '@/shared/ui/primitives/button';
import { useTranslations } from 'next-intl';

export default function RootNotFound() {
  const t = useTranslations('common');

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-lg text-muted-foreground">
            {t('not_found_description')}
          </p>
          <Button variant="default" asChild>
            <a href="/">{t('go_home')}</a>
          </Button>
        </div>
      </body>
    </html>
  );
}
