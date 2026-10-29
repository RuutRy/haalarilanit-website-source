import { Link } from "@tanstack/react-router";

import { type Lang, storeLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

type LangToggleOptionProps = {
  label: string;
  selected: boolean;
  to: string;
  lang: Lang;
};

// Real link to the same page in the target tree (crawlable, no-JS fallback);
// the click remembers the choice. resetScroll={false} keeps the reader's
// position: a lang switch swaps content in place, it is not a new page.
export function LangToggleOption({ label, selected, to, lang }: LangToggleOptionProps) {
  return (
    <Link
      to={to}
      params={{ lang }}
      onClick={() => storeLang(lang)}
      resetScroll={false}
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
