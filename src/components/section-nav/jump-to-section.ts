// No custom scroll machinery: html.gliding keeps it smooth, wheel/touch cancels it natively.
export function jumpToSection(id: string): void {
  history.replaceState(null, "", `#${id}`);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("gliding");
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "instant" : "smooth" });
}
