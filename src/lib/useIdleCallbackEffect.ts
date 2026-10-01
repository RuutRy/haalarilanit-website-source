import { useEffect, type DependencyList } from "react";

type RunIdle = (cb: () => void) => void;

// idle-scheduled effect: runs effect(runIdle) on mount/dep change, where runIdle
// defers the callback via requestIdleCallback (setTimeout 0 fallback). pending
// idle callbacks are cancelled on cleanup, along with the effect's own cleanup.
export function useIdleCallbackEffect(
  effect: (runIdle: RunIdle) => void | (() => void),
  deps: DependencyList,
) {
  useEffect(() => {
    // requestIdleCallback isn't on older Safari; the SSR pass never runs effects
    const useRIC = typeof window.requestIdleCallback === "function";

    const ids = new Set<number>();
    const runIdle: RunIdle = (cb) => {
      const id = useRIC ? window.requestIdleCallback(cb) : window.setTimeout(cb, 0);
      ids.add(id);
    };

    const cleanup = effect(runIdle);

    return () => {
      for (const id of ids) {
        if (useRIC) window.cancelIdleCallback(id);
        else window.clearTimeout(id);
      }
      cleanup?.();
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- pass-through deps
  }, deps);
}
