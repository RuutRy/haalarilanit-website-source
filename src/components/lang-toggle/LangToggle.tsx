import { useRouterState } from "@tanstack/react-router";

import { LANGS, langFromPath } from "@/lib/lang";
import { resolveLangTarget } from "@/lib/navigation";

import { LangToggleOption } from "./LangToggleOption";

// Subtle segmented FI | EN control, pinned to the top right of the
// header (desktop) and reused in the mobile menu + footer. Real links
// to the same page in the other tree. w-fit matters in the mobile
// menu: a plain flex div there would stretch the pill across the
// whole sheet, leaving the EN cell a vast empty half.
export function LangToggle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = langFromPath(pathname);
  const target = resolveLangTarget(pathname);

  return (
    <div
      role="group"
      aria-label="Kieli / Language"
      className="flex w-fit overflow-hidden rounded-md border border-foreground/10"
    >
      {LANGS.map((code) => (
        <LangToggleOption
          key={code}
          label={code.toUpperCase()}
          selected={current === code}
          to={code === current ? pathname : `/$lang${target}`}
          lang={code}
        />
      ))}
    </div>
  );
}
