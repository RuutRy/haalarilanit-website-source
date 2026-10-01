import { flashHeading } from "@/lib/heading-flash";

import { whenScrollSettled } from "./scroll-settle";

// Glide to a section; the deferred hash write keeps scroll anchoring from fighting the glide.
export function jumpToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  whenScrollSettled(() => {
    history.replaceState(null, "", `#${id}`);
    flashHeading(id);
  });
}
