import { useEffect, useRef } from "react";

// Breakpoint vars from @theme static (tailwind.css); read off :root since
// matchMedia can't use var().
export const COMPACT_BREAKPOINT = "--breakpoint-compact";
export const RAIL_BREAKPOINT = "--breakpoint-rail";

// Closes a state-driven sheet when the viewport crosses into the breakpoint
// of its CSS-driven desktop takeover (which hides itself below it, so an
// open sheet would float beside it). close rides a ref (no resubscribe).
export function useCloseOnMediaMatch(breakpointVar: string, close: () => void) {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(breakpointVar).trim();
    if (!value) {
      // biome-ignore lint/suspicious/noConsole: missing var = force-close silently dies
      console.error(`useCloseOnMediaMatch: ${breakpointVar} missing from the shipped CSS`);
      return;
    }
    const mq = window.matchMedia(`(min-width: ${value})`);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) closeRef.current();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpointVar]);
}
