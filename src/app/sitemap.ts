import fs from 'fs';
import type { MetadataRoute } from 'next';
import path from 'path';

import { routing } from '@/i18n/routing';
import { getBaseUrl } from '@/shared/lib/get-base-url';

/**
 * Recursively discovers all static routes from the App Router directory structure.
 * Skips dynamic segments (except [locale]), api routes, and internal folders.
 */
function getAllRoutes(): string[] {
  const appDir = path.join(process.cwd(), 'src/app');

  function findPageFiles(dir: string, baseRoute = ''): string[] {
    const routes: string[] = [];

    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          if (
            item.name.startsWith('[') &&
            item.name.endsWith(']') &&
            item.name !== '[locale]'
          ) {
            continue;
          }

          if (['api', '_components', '_lib'].includes(item.name)) {
            continue;
          }

          if (item.name === '[locale]') {
            routes.push(...findPageFiles(fullPath, ''));
          } else {
            const newRoute = `${baseRoute}/${item.name}`;
            routes.push(...findPageFiles(fullPath, newRoute));
          }
        } else if (
          item.name === 'page.tsx' ||
          item.name === 'page.ts' ||
          item.name === 'page.jsx' ||
          item.name === 'page.js'
        ) {
          routes.push(baseRoute || '/');
        }
      }
    } catch (error) {
      console.warn('Error reading directory:', dir, error);
    }

    return routes;
  }

  const routes = findPageFiles(appDir);

  return [
    ...new Set(
      routes.map((route) => {
        if (route === '/') return '';
        return route.startsWith('/') ? route : `/${route}`;
      }),
    ),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();
  const routes = getAllRoutes();
  const { locales, defaultLocale } = routing;

  return routes.map((route) => {
    // Build hrefLang alternates for each route
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] =
        locale === defaultLocale
          ? `${baseUrl}${route}`
          : `${baseUrl}/${locale}${route}`;
    }
    // x-default points to the default locale variant
    languages['x-default'] = `${baseUrl}${route}`;

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      alternates: { languages },
    };
  });
}
