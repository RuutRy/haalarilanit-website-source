import { useEffect, useRef, type RefObject } from "react";

export type SwipeSide = "left" | "right";

type SwipeStart = { x: number; y: number; side: SwipeSide };

// Gesture geometry: arm within EDGE px of a screen edge, commit
// direction after SLOP px, open the panel after DIST px.
const EDGE = 40;
const SLOP = 12;
const DIST = 56;

// Pure decision for one touchmove sample. "vertical" = hand the gesture
// back to scrolling, "commit" = open the panel, "steer" = horizontal
// drag still under DIST (claim it), null = below slop (ignore).
export function resolveSwipe(
  start: SwipeStart,
  point: { x: number; y: number },
  config: { slop: number; dist: number },
): "vertical" | "commit" | "steer" | null {
  const dx = point.x - start.x;
  const dy = point.y - start.y;
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > config.slop) return "vertical";
  if (Math.abs(dx) > config.dist) return "commit";
  if (Math.abs(dx) > config.slop) return "steer";
  return null;
}

// Edge-swipe quick-jump below 2xl: touch starting within EDGE px of a screen edge arms
// the gesture; resolveSwipe classifies each move; non-passive touchmove only while
// armed (prevents scroll/selection claiming the drag); touchcancel disarms when the
// browser takes the gesture. Armed reads happen through armedRef so the listeners
// never re-subscribe while scrolling.
export function useEdgeSwipe(options: {
  enabled: boolean;
  armedRef: RefObject<boolean>;
  onOpen: (side: SwipeSide) => void;
}): void {
  const { enabled, armedRef, onOpen } = options;

  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    if (!enabled) return;
    let start: SwipeStart | null = null;

    const onArm = (e: TouchEvent) => {
      if (start || !armedRef.current) return;
      const touch = e.touches[0];
      let from: SwipeSide | null = null;
      if (touch.clientX <= EDGE) from = "left";
      else if (touch.clientX >= window.innerWidth - EDGE) from = "right";
      if (!from) return;
      start = { x: touch.clientX, y: touch.clientY, side: from };
      // Non-passive only while the gesture is ours to steer.
      addEventListener("touchmove", onSteer, { passive: false });
    };
    const disarm = () => {
      if (!start) return;
      start = null;
      removeEventListener("touchmove", onSteer);
    };
    const onSteer = (e: TouchEvent) => {
      if (!start) return;
      const result = resolveSwipe(
        start,
        { x: e.touches[0].clientX, y: e.touches[0].clientY },
        { slop: SLOP, dist: DIST },
      );
      if (result === "vertical") return disarm();
      // Claim the drag from scroll/selection - including the committing move.
      if (result === "steer" || result === "commit") {
        if (e.cancelable) e.preventDefault();
      }
      if (result === "commit") {
        onOpenRef.current(start.side);
        disarm();
      }
    };
    addEventListener("touchstart", onArm, { passive: true });
    addEventListener("touchend", disarm, { passive: true });
    addEventListener("touchcancel", disarm, { passive: true });
    return () => {
      disarm();
      removeEventListener("touchstart", onArm);
      removeEventListener("touchend", disarm);
      removeEventListener("touchcancel", disarm);
    };
  }, [enabled, armedRef]);
}
