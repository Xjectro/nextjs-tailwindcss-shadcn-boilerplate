/**
 * Root Layout Component
 *
 * This is the root layout that wraps all pages in the application.
 * It provides the basic HTML structure and global providers.
 *
 * Note: The actual content rendering happens in the locale-specific layout
 * at /app/[locale]/layout.tsx which handles internationalization.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Next.js Boilerplate',
    default: 'Next.js TailwindCSS ShadCN Boilerplate',
  },
  description:
    'A modern boilerplate project using Next.js 15, TailwindCSS 4, ShadCN UI components with internationalization support.',
  keywords: [
    'Next.js',
    'React',
    'TailwindCSS',
    'ShadCN',
    'TypeScript',
    'i18n',
    'Boilerplate',
  ],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yoursite.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'tr-TR': '/tr',
    },
  },
  openGraph: {
    title: 'Next.js TailwindCSS ShadCN Boilerplate',
    description:
      'A modern boilerplate project using Next.js 15, TailwindCSS 4, ShadCN UI components with internationalization support.',
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com', // Replace with your actual domain
    siteName: 'Next.js Boilerplate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js TailwindCSS ShadCN Boilerplate',
    description:
      'A modern boilerplate project using Next.js 15, TailwindCSS 4, ShadCN UI components with internationalization support.',
    creator: '@yourtwitterhandle', // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification tokens here
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
    // bing: 'your-bing-verification-token',
  },
};

/**
 * Root Layout Component
 *
 * This layout only provides the children prop and metadata.
 * The actual HTML structure and providers are handled in the locale-specific layout.
 *
 * @param children - The page content to render
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
