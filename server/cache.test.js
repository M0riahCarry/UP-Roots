import { describe, it, expect, vi, afterEach } from "vitest";
import { createCache } from "./cache.js";

afterEach(() => {
  vi.useRealTimers();
});

describe("createCache", () => {
  it("returns stored values before the TTL expires", () => {
    const cache = createCache(1000);
    cache.set("q", [1, 2, 3]);
    expect(cache.get("q")).toEqual([1, 2, 3]);
  });

  it("returns undefined for keys never set", () => {
    const cache = createCache(1000);
    expect(cache.get("missing")).toBeUndefined();
  });

  it("expires entries after the TTL", () => {
    vi.useFakeTimers();
    const cache = createCache(1000);
    cache.set("q", "value");

    vi.advanceTimersByTime(999);
    expect(cache.get("q")).toBe("value");

    vi.advanceTimersByTime(2);
    expect(cache.get("q")).toBeUndefined();
  });

  it("a fresh set resets the clock for that key", () => {
    vi.useFakeTimers();
    const cache = createCache(1000);
    cache.set("q", "old");
    vi.advanceTimersByTime(900);
    cache.set("q", "new");
    vi.advanceTimersByTime(900);
    expect(cache.get("q")).toBe("new");
  });
});
