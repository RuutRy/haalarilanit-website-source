// Scroll-quiet period (ms) after which gliding/auto-scrolling counts as
// done - used to defer the hash write and mark sections settled.
const SETTLE_MS = 200;

// Resolve cb once scrolling has been quiet for SETTLE_MS: a programmatic
// glide keeps firing scroll events, so the timer only completes once the
// browser is done scrolling - and with no glide it fires on its own.
// (scrollend would be the exact signal but is not green across the
// browserslist bar - see package.json.)
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
