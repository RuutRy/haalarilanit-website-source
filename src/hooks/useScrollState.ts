import { useSyncExternalStore } from "react";

type ScrollState = { y: number; scrollable: number; vh: number };

let state: ScrollState = { y: 0, scrollable: 0, vh: 800 };
let raf = 0;
const listeners = new Set<() => void>();

function read(): ScrollState {
  return {
    y: window.scrollY,
    scrollable: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
    vh: window.innerHeight,
  };
}

function update() {
  raf = 0;
  const next = read();
  if (next.y === state.y && next.scrollable === state.scrollable && next.vh === state.vh) return;
  state = next;
  for (const listener of listeners) listener();
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(update);
}

// Shared scroll state for the threshold affordances (header mark, up
// button): one rAF-throttled subscription, listeners only while someone
// is subscribed. Scroll events + rAF are green across the build-target
// bar (vite.config.ts); nothing scroll-timeline based.
function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    state = read(); // page can load already scrolled (restoration, refresh)
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onScroll);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
}

export function useScrollState(): ScrollState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}
