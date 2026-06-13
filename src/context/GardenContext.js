import { createContext, useContext } from "react";

// The context object + the hook to read it live here (no component), so this
// file can be imported anywhere without tripping React's fast-refresh rule.
export const GardenContext = createContext(null);

// Small custom hook so components just call useGarden() instead of importing
// both useContext and the context object everywhere.
export function useGarden() {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error("useGarden must be used inside a GardenProvider");
  }
  return context;
}
