'use client';

import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { useEffect, useRef } from 'react';

/**
 * Navigation Events Component
 * Listens to route changes and displays a loading indicator using NProgress
 */
export function NavigationEvents() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  /**
   * Effect to handle route changes
   * Starts NProgress on route change start and completes it after a short delay
   */
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    NProgress.start();
    // Simulate a delay for demonstration purposes
    setTimeout(() => {
      NProgress.done();
    }, 300);
  }, [pathname]);

  return null;
}
