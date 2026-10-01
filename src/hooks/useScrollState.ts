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
  // Server snapshot must be a CONSTANT, not the live module state: SSR
  // renders the page-top state (y=0), and the client's hydration render
  // has to produce the exact same markup. The live state is a trap here -
  // on a reload the browser restores the scroll position before hydration,
  // the init-read in subscribe() mutates module state during the hydration
  // commit, and a getServerSnapshot reading it makes the (StrictMode
  // double) hydration render diverge from the SSR markup. React logs an
  // attribute mismatch and keeps the SERVER className - the up button
  // stays hidden and the header logo parked until the next real scroll.
  // With a stable server snapshot, hydration matches SSR cleanly and the
  // client/server divergence instead triggers the useSyncExternalStore
  // post-hydration re-render, which patches the threshold classes.
  const SERVER_STATE: ScrollState = { y: 0, scrollable: 0, vh: 0 };
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}
