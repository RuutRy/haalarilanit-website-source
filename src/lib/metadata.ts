// Route-head meta wiring: per-route canonical + og:url, og:locale per
// language, Event JSON-LD on the front page.

import { event, eventYear, SITE_URL } from "./data";
import i18n from "./i18n";

const OG_LOCALES: Record<string, string> = { fi: "fi_FI", en: "en_US" };

/** The route language i18n is synced to by the root's beforeLoad. */
export function currentLang(): string {
  return (i18n.language || "fi").split("-")[0];
}

// ISO instant in Helsinki wall time: local components match formatEventTime,
// November is EET (+02:00).
export function isoHelsinki(date: Date): string {
  const part = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${part(date.getMonth() + 1)}-${part(date.getDate())}T${part(date.getHours())}:${part(date.getMinutes())}:00+02:00`;
}

export function eventJsonLd(description: string): string {
  const lang = currentLang();
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.name} ${eventYear}`,
    description,
    startDate: isoHelsinki(event.start),
    endDate: isoHelsinki(event.end),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "LAB-kampuksen liikuntasali",
      address: { "@type": "PostalAddress", addressLocality: "Lappeenranta", addressCountry: "FI" },
    },
    image: [`${SITE_URL}/og-image.png`],
    url: `${SITE_URL}/${lang}`,
    organizer: { "@type": "Organization", name: "RuutRy" },
  });
}

export interface SeoPage {
  /** Route path the page is canonical for, e.g. "/fi" or "/en/contact". */
  path: string;
  title: string;
  description: string;
  /** schema.org JSON-LD (the front page's Event). */
  jsonLd?: string;
}

export function seoHead(page: SeoPage) {
  const lang = currentLang();
  const url = `${SITE_URL}${page.path}`;
  const locale = OG_LOCALES[lang] ?? OG_LOCALES.fi;
  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:url", content: url },
      { property: "og:locale", content: locale },
      { property: "og:locale:alternate", content: locale === "en_US" ? "fi_FI" : "en_US" },
    ],
    links: [{ rel: "canonical", href: url }],
    ...(page.jsonLd ? { scripts: [{ type: "application/ld+json", children: page.jsonLd }] } : {}),
  };
}
