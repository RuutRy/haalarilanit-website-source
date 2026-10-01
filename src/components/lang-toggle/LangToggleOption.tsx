import { Link } from "@tanstack/react-router";

import { storeLang, type Lang } from "@/lib/lang";
import { cn } from "@/lib/utils";

type LangToggleOptionProps = {
  label: string;
  selected: boolean;
  to: string;
  lang: Lang;
};

// One cell of the segmented FI | EN pill: a real link to the same page
// in the target tree - crawlable (the prerender crawler crosses trees
// through these) and a no-JS fallback. The click also remembers the
// choice: the inline head script in __root sends a returning visitor
// from / to this tree before anything paints.
export function LangToggleOption({ label, selected, to, lang }: LangToggleOptionProps) {
  return (
    <Link
      to={to}
      params={{ lang }}
      onClick={() => storeLang(lang)}
      aria-current={selected ? "page" : undefined}
      className={cn(
        "w-10 px-2 py-1.5 text-center text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected ? "bg-foreground/10 text-foreground" : "text-foreground/40 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
