import { useCallback, useEffect, useState } from "react";

import { event } from "../../lib/data";

// Re-render at the next phase boundary; resyncs on visibility change.
export function usePhaseNow() {
  const [now, setNow] = useState(() => Date.now());
  const refresh = useCallback(() => setNow(Date.now()), []);

  useEffect(() => {
    const target =
      now < event.start.getTime() ? event.start : now < event.end.getTime() ? event.end : null;
    if (!target) return;

    const MAX_TIMEOUT = 2_147_483_647; // browser max, ~24.8 days
    const delay = Math.max(0, Math.min(target.getTime() - now + 100, MAX_TIMEOUT));
    const id = setTimeout(refresh, delay);

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [now, refresh]);

  return { now, refresh };
}
