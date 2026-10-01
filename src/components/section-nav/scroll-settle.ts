// Scroll-quiet period (ms) after which gliding/auto-scrolling counts as
// done - used to defer the heading flash and mark sections settled.
const SETTLE_MS = 200;

// Latest jump wins: a new settle cancels the pending one.
let pendingCancel: (() => void) | undefined;

// Resolves cb once scrolling has been quiet for SETTLE_MS (scrollend isn't
// green across the build target).
export function whenScrollSettled(cb: () => void): () => void {
  pendingCancel?.();
  let timer = 0;
  const cancel = () => {
    clearTimeout(timer);
    removeEventListener("scroll", onScroll);
    if (pendingCancel === cancel) pendingCancel = undefined;
  };
  const fire = () => {
    cancel();
    cb();
  };
  const onScroll = () => {
    clearTimeout(timer);
    timer = window.setTimeout(fire, SETTLE_MS);
  };
  addEventListener("scroll", onScroll, { passive: true });
  timer = window.setTimeout(fire, SETTLE_MS);
  pendingCancel = cancel;
  return cancel;
}
