import { Link } from '@/i18n/navigation';
import {
  createPageSeo,
  getPageSeoData,
  jsonLd,
  JsonLdScript,
} from '@/shared/lib/seo';
import { Button } from '@/shared/ui/primitives/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/primitives/card';
import { ThemeToggle } from '@/shared/ui/react/theme-toggle';
import { Fragment } from 'react';

// One-liner: auto-reads title/description/keywords from messages['home']
export function generateMetadata() {
  return createPageSeo('home');
}

export default async function HomePage() {
  const seo = await getPageSeoData('home');

  return (
    <Fragment>
      <JsonLdScript data={jsonLd.website(seo)} />

      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          {/* Header with Theme Toggle */}
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Next.js Boilerplate (Home)</h1>
            <ThemeToggle />
          </header>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Welcome to Next.js TailwindCSS ShadCN Boilerplate
                </CardTitle>
                <CardDescription>
                  A modern, production-ready boilerplate with Next.js 15,
                  TailwindCSS 4, ShadCN UI, and internationalization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>This boilerplate includes:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>🌙 Dark/Light theme support with next-themes</li>
                    <li>🌍 Internationalization with next-intl</li>
                    <li>🎨 ShadCN UI components</li>
                    <li>⚡ TailwindCSS 4 for styling</li>
                    <li>📱 Responsive design</li>
                    <li>🔧 TypeScript for type safety</li>
                    <li>🧪 Jest testing setup</li>
                    <li>📏 ESLint and Prettier configuration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>🌙 Theme Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Toggle between light, dark, and system themes using the
                    button in the top right corner.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🌍 Internationalization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Support for multiple languages with next-intl. Currently
                    supports English and Turkish.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎨 UI Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Beautiful and accessible UI components built with Radix UI
                    and styled with TailwindCSS.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button variant="default" asChild>
                <Link href="/get-started">Get Started</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </Fragment>
  );
}
