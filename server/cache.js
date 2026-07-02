import fs from "node:fs";
import path from "node:path";

// Tiny in-memory cache with a time-to-live. Used so repeated requests for the
// same search or plant are served from memory instead of re-hitting Perenual,
// which has a small daily request limit (the cause of the 429 errors).
//
// Pass a persistFile to also save entries to disk: cached plant data then
// survives server restarts, so over time the app builds its own local dataset
// and depends on the external API less and less.
export function createCache(ttlMs, persistFile) {
  const store = new Map();
  let saveTimer = null;

  //load previously saved entries (dropping any that have expired)
  if (persistFile) {
    try {
      const entries = JSON.parse(fs.readFileSync(persistFile, "utf8"));
      const now = Date.now();
      for (const [key, entry] of entries) {
        if (entry && entry.expires > now) store.set(key, entry);
      }
    } catch {
      //no file yet, or unreadable — start fresh
    }
  }

  //write at most once per second, so a burst of sets doesn't hammer the disk
  function scheduleSave() {
    if (!persistFile || saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      try {
        fs.mkdirSync(path.dirname(persistFile), { recursive: true });
        fs.writeFileSync(persistFile, JSON.stringify([...store.entries()]));
      } catch {
        //persistence is best-effort; the in-memory cache still works
      }
    }, 1000);
    saveTimer.unref?.();
  }

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
      scheduleSave();
    },
  };
}
