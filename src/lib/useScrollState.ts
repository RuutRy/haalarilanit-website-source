import { useEffect, useState } from "react";

type ScrollState = {
  y: number;
  /** px of scrollable range: scrollHeight - viewport */
  scrollable: number;
  /** current viewport height */
  vh: number;
};

// Shared scroll-position state for the threshold affordances (header
// mark, up button): rAF-throttled scroll/resize listeners, one update
// per frame. Green everywhere - scroll events, rAF and the
// measurements are the oldest APIs in the book; nothing
// scroll-timeline or scrollend based, which the browserslist green bar
// (see .browserslistrc notes / package.json) rules out.
export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>({ y: 0, scrollable: 0, vh: 800 });
  useEffect(() => {
    let raf = 0;
    const read = () => ({
      y: window.scrollY,
      scrollable: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
      vh: window.innerHeight,
    });
    const update = () => {
      raf = 0;
      setState(read());
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return state;
}
