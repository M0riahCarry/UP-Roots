// Tiny in-memory cache with a time-to-live. Used so repeated requests for the
// same search or plant are served from memory instead of re-hitting Perenual,
// which has a small daily request limit (the cause of the 429 errors).
export function createCache(ttlMs) {
  const store = new Map();
  return {
    get(key) {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (Date.now() > entry.expires) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value) {
      store.set(key, { value, expires: Date.now() + ttlMs });
    },
  };
}
