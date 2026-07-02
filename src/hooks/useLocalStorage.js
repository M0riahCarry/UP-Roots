import { useState, useEffect } from "react";

// Generic hook: behaves like useState, but the value also persists in the
// browser's localStorage so it survives refreshes.
// The optional `migrate` runs once on the stored value at load time, so callers
// can upgrade or discard data saved by older versions of the app.
export function useLocalStorage(key, initialValue, migrate) {
  const [value, setValue] = useState(() => {
    //never let a corrupted stored value crash the app — fall back to the default
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return initialValue;
      const parsed = JSON.parse(stored);
      return migrate ? migrate(parsed) : parsed;
    } catch {
      return initialValue;
    }
  });

  // Whenever the value changes, write it back to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      //storage can be full or blocked (private mode) — the app still works,
      //the value just won't persist
    }
  }, [key, value]);

  return [value, setValue];
}
