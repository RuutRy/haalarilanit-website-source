import Parallax from "parallax-js";
import { type RefObject, useEffect, useRef } from "react";

import { useIdleCallbackEffect } from "@/hooks/useIdleCallbackEffect";

// module-scope read is fine in the browser; guard for the Node prerender pass
const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const LIMIT = 100; // px, max layer travel (the lib clamps final px after scalar)
const SCROLL_RANGE = 1400; // px, scroll distance over which drift maxes out
const SCROLL_DRIFT = 60; // px, max upward drift from scrolling

function useParallaxBg(
  rootRef: RefObject<HTMLDivElement | null>,
  sceneRef: RefObject<HTMLDivElement | null>,
) {
  // init does layout reads (offsetWidth); idle-scheduling keeps them off the
  // startup path. browsers without requestIdleCallback skip the parallax
  useIdleCallbackEffect(
    (runIdle) => {
      const scene = sceneRef.current;
      if (prefersReducedMotion || !scene) return;

      let instance: Parallax | undefined;
      runIdle(() => {
        instance = new Parallax(scene, {
          relativeInput: true,
          clipRelativeInput: true,
          calibrateX: false, // calibration re-zeros input; meant for gyro, not mouse
          calibrateY: false,
          invertX: false, // lib default is opposite-cursor; the bg follows the cursor
          invertY: false,
          limitX: LIMIT,
          limitY: LIMIT,
          frictionX: 0.08,
          frictionY: 0.08,
          scalarX: 1,
          scalarY: 1,
        });
      });

      return () => instance?.destroy();
    },
    [sceneRef],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onScroll = () => {
      root.style.setProperty(
        "--scroll-drift",
        `${-SCROLL_DRIFT * Math.min(window.scrollY / SCROLL_RANGE, 1)}px`,
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [rootRef]);
}

export function Background() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  useParallaxBg(rootRef, sceneRef);
  return (
    <div ref={rootRef} aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <div className="drift">
        <div ref={sceneRef} className="parallax-scene absolute inset-0">
          <div className="bg-wall" data-depth="1">
            <div className="bg-art" />
          </div>
        </div>
      </div>
    </div>
  );
}
