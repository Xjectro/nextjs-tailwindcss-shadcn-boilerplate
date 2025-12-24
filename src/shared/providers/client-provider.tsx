'use client';

/**
 * Client Providers
 * This file contains all client-side providers that require 'use client' directive.
 * These providers handle client-only features like theming and client-side state management.
 */
import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Theme Provider Component
 * Wraps the application with next-themes provider for dark mode support
 */
function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/**
 * Combined Client Providers
 * Combines all client-side providers into a single component
 * Add new client providers here as needed
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
