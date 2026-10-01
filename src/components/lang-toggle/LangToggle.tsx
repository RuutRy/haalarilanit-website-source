import { useRouterState } from "@tanstack/react-router";

import { LANGS, langFromPath } from "@/lib/lang";
import { resolveLangTarget } from "@/lib/navigation";

import { LangToggleOption } from "./LangToggleOption";

// Segmented FI | EN control; reused in the mobile menu + footer. w-fit keeps
// it from stretching across the mobile sheet.
export function LangToggle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = langFromPath(pathname);
  const target = resolveLangTarget(pathname);

  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset's UA styles (border, min-inline-size) would need resets in this pixel-tuned pill; role=group + aria-label is complete for AT
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
