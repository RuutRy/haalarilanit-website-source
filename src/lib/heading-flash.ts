// Jump/deep-link feedback: the chip flashes accent and bounces once
// (.section-flash in index.css). The forced reflow restarts the animation
// when the same heading is flashed twice in a row.
export function flashHeading(id: string): void {
  const heading = document.getElementById(id);
  heading?.classList.remove("section-flash");
  void heading?.offsetWidth;
  heading?.classList.add("section-flash");
  setTimeout(() => heading?.classList.remove("section-flash"), 1800);
}
