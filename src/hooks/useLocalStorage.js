import { useState, useEffect } from "react";

// Generic hook: behaves like useState, but the value also persists in the
// browser's localStorage so it survives refreshes. Reused later by "My Garden".
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initialValue;
  });

  // Whenever the value changes, write it back to localStorage.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
