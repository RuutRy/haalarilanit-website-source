import type { Lang } from "./lang";

import { event } from "./data";

const INTL_LOCALE: Record<Lang, string> = { fi: "fi", en: "en" };

function formatDate(lang: Lang, date: Date): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Strings derived from data.ts, spread onto the MDX component so articles
// can reference {props.eventStart} etc. Seed set: no article uses these
// yet - wire them into prose when dates appear in content.
export function articleVars(lang: Lang): Record<string, string> {
  return {
    eventStart: formatDate(lang, event.start),
    eventEnd: formatDate(lang, event.end),
  };
}
