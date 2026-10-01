import { flashHeading } from "@/lib/heading-flash";

import { whenScrollSettled } from "./scroll-settle";

// Glide to a section, then - once the scroll settles - write the hash
// and flash the heading. The hash write is deferred so the browser's
// own scroll anchoring never fights the glide.
export function jumpToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  whenScrollSettled(() => {
    history.replaceState(null, "", `#${id}`);
    flashHeading(id);
  });
}
