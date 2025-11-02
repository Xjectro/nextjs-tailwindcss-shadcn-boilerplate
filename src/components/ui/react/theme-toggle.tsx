/**
 * Theme Toggle Component
 *
 * A button component that allows users to toggle between light, dark, and system themes.
 * Uses next-themes for theme management and provides a smooth transition experience.
 */

'use client';

import { Button } from '@/components/ui/primitives/button';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Theme Toggle Component
 *
 * Renders a button that cycles through available themes:
 * - Light mode (sun icon)
 * - Dark mode (moon icon)
 * - System mode (monitor icon)
 *
 * @returns {JSX.Element} Theme toggle button
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Loading theme</span>
      </Button>
    );
  }

  /**
   * Cycle through themes: light → dark → system → light
   */
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  /**
   * Get the appropriate icon based on current theme
   */
  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case 'system':
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  /**
   * Get accessible label for current theme
   */
  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system mode';
      case 'system':
        return 'Switch to light mode';
      default:
        return 'Toggle theme';
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-200 hover:scale-105"
      aria-label={getLabel()}
    >
      <div className="relative">{getIcon()}</div>
      <span className="sr-only">{getLabel()}</span>
    </Button>
  );
}
