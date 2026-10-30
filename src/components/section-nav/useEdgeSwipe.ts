import { useDrag } from "@use-gesture/react";
import { type RefObject, useRef } from "react";

export type SwipeSide = "left" | "right";

type SwipeStart = { x: number; y: number; side: SwipeSide };

// Arm within EDGE px of a screen edge, commit after SLOP px, open after DIST px.
const EDGE = 40;
const SLOP = 12;
const DIST = 56;

// "vertical" hands back to scrolling, "commit" opens, "steer" claims the horizontal drag, null ignores.
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

// passive: false so the drag can claim the gesture; vertical scrolling stays native via touch-action.
// Binding mounts once, so enabled/onOpen ride refs.
export function useEdgeSwipe(options: {
  enabled: boolean;
  armedRef: RefObject<boolean>;
  onOpen: (side: SwipeSide) => void;
}): void {
  const { enabled, armedRef, onOpen } = options;

  // The armed gesture (start point + side) while a drag is in flight.
  const gestureRef = useRef<SwipeStart | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useDrag(
    (state) => {
      // touch only - pointerType lives on the event, not the state
      if (!("pointerType" in state.event) || state.event.pointerType !== "touch") return;
      if (!enabledRef.current || !armedRef.current) return;

      if (state.first) {
        const [x, y] = state.initial;
        const side = x <= EDGE ? "left" : x >= window.innerWidth - EDGE ? "right" : null;
        gestureRef.current = side ? { x, y, side } : null;
        return;
      }
      const gesture = gestureRef.current;
      if (!gesture) return;
      if (state.last) {
        gestureRef.current = null;
        return;
      }

      const result = resolveSwipe(
        gesture,
        { x: state.values[0], y: state.values[1] },
        { slop: SLOP, dist: DIST },
      );
      if (result === "vertical") {
        gestureRef.current = null;
        state.cancel();
        return;
      }
      // Claim the drag from scroll/selection - including the committing move.
      if (result === "steer" || result === "commit") {
        if (state.event.cancelable) state.event.preventDefault();
      }
      if (result === "commit") {
        gestureRef.current = null;
        onOpenRef.current(gesture.side);
        state.cancel();
      }
    },
    // Prerender-safe: hooks run during SSR, where window is undefined - use-gesture skips window binding then.
    {
      target: typeof window === "undefined" ? undefined : window,
      eventOptions: { passive: false },
    },
  );
}
