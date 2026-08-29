import Parallax from "parallax-js";
import { useEffect, useRef, type RefObject } from "react";

import { BackgroundImage } from "./BackgroundImage";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const LIMIT = 100; // px, max layer travel (the lib clamps final px after scalar)
const SCROLL_RANGE = 1400; // px, scroll distance over which drift maxes out
const SCROLL_DRIFT = 60; // px, max upward drift from scrolling

function useParallaxBg(
  rootRef: RefObject<HTMLDivElement | null>,
  sceneRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (prefersReducedMotion || !root || !scene) return;

    const instance = new Parallax(scene, {
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

    const onScroll = () => {
      root.style.setProperty(
        "--scroll-drift",
        `${-SCROLL_DRIFT * Math.min(window.scrollY / SCROLL_RANGE, 1)}px`,
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      instance.destroy();
    };
  }, [rootRef, sceneRef]);
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
            <BackgroundImage />
          </div>
        </div>
      </div>
    </div>
  );
}
