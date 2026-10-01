// Scroll-quiet period (ms) after which gliding/auto-scrolling counts as
// done - used to defer the hash write and mark sections settled.
const SETTLE_MS = 200;

// Resolves cb once scrolling has been quiet for SETTLE_MS (scrollend isn't
// green across the build target).
export function whenScrollSettled(cb: () => void): void {
  let timer = 0;
  const fire = () => {
    clearTimeout(timer);
    removeEventListener("scroll", onScroll);
    cb();
  };
  const onScroll = () => {
    clearTimeout(timer);
    timer = window.setTimeout(fire, SETTLE_MS);
  };
  addEventListener("scroll", onScroll, { passive: true });
  timer = window.setTimeout(fire, SETTLE_MS);
}
