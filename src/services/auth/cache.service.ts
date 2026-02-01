'use server';

import { cookies } from 'next/headers';

export const CACHE_ID_KEY = 'cache_id';

/**
 * CACHE ID
 */
export async function getCacheId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CACHE_ID_KEY)?.value ?? null;
}
