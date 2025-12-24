export type StorageNamespaceOptions = {
  /**
   * Optional key prefix to avoid collisions across apps/features.
   * Example: prefix: 'auth' -> key 'token' becomes 'auth:token'
   */
  prefix?: string;
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function buildKey(key: string, options?: StorageNamespaceOptions): string {
  const prefix = options?.prefix?.trim();
  return prefix ? `${prefix}:${key}` : key;
}

function getLocalStorage(): Storage | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    // Access can throw in some environments (privacy mode, blocked storage, etc.)
    return null;
  }
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const localStorageService = {
  isAvailable(): boolean {
    return getLocalStorage() !== null;
  },

  get(key: string, options?: StorageNamespaceOptions): string | null {
    const storage = getLocalStorage();
    if (!storage) {
      return null;
    }

    try {
      return storage.getItem(buildKey(key, options));
    } catch {
      return null;
    }
  },

  set(key: string, value: string, options?: StorageNamespaceOptions): boolean {
    const storage = getLocalStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(buildKey(key, options), value);
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string, options?: StorageNamespaceOptions): boolean {
    const storage = getLocalStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.removeItem(buildKey(key, options));
      return true;
    } catch {
      return false;
    }
  },

  clear(options?: StorageNamespaceOptions): boolean {
    const storage = getLocalStorage();
    if (!storage) {
      return false;
    }

    const prefix = options?.prefix?.trim();
    try {
      // If no prefix, clear everything.
      if (!prefix) {
        storage.clear();
        return true;
      }

      // If prefix exists, only remove matching keys.
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i += 1) {
        const k = storage.key(i);
        if (k && k.startsWith(`${prefix}:`)) {
          keysToRemove.push(k);
        }
      }

      for (const k of keysToRemove) {
        storage.removeItem(k);
      }

      return true;
    } catch {
      return false;
    }
  },

  getJson<T = JsonValue>(
    key: string,
    options?: StorageNamespaceOptions,
  ): T | null {
    const raw = this.get(key, options);
    if (raw === null) {
      return null;
    }
    return safeJsonParse<T>(raw);
  },

  setJson<T extends JsonValue>(
    key: string,
    value: T,
    options?: StorageNamespaceOptions,
  ): boolean {
    return this.set(key, JSON.stringify(value), options);
  },

  has(key: string, options?: StorageNamespaceOptions): boolean {
    return this.get(key, options) !== null;
  },
};
