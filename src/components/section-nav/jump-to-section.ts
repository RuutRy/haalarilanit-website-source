// Jumps to a section: the uri gets the clean `#${id}` instantly and the
// browser's own scroll-to-fragment does the gliding (html.gliding keeps it
// smooth; wheel/touch input cancels it natively). No custom scroll machinery.
export function jumpToSection(id: string): void {
  history.replaceState(null, "", `#${id}`);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("gliding");
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "instant" : "smooth" });
}
