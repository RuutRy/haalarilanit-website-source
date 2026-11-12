import GithubSlugger from "github-slugger";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { contactGroups } from "../../lib/data";
import { flashHeading } from "../../lib/heading-flash";
import { useActiveLang } from "../../lib/lang";
import { jumpToSection } from "../section-nav/jump-to-section";
import { DEEP_LINK_DELAY_MS } from "../section-nav/SectionNav";
import { whenScrollSettled } from "../section-nav/scroll-settle";
import { Paragraph } from "../text";
import { H2 } from "../text/heading";
import { ContactCard } from "./ContactCard";

// Contact sections from data.ts: a heading, then that section's cards.
// Nameless people are skipped and sections left with nobody stay hidden;
// when nothing at all is listed, a placeholder line.
export function ContactCards() {
  const { t } = useTranslation();
  const lang = useActiveLang();

  const groups = contactGroups
    .map((group) => {
      // Same slug recipe as markdown headings. Slug per group: the group key
      // keeps cross-group ids unique, the slugger only dedupes names inside
      // one section.
      const slugger = new GithubSlugger();
      const people = group.people
        .filter((p) => p.name.trim().length > 0)
        .map((p) => ({ ...p, id: `${group.key}-${slugger.slug(p.name)}` }));
      return { ...group, people };
    })
    .filter((group) => group.people.length > 0);

  // Bare subpages get no SectionNav, so the deep-link glide lives here: the
  // same settle wait, jump and flash as sheet pages get on load.
  useEffect(() => {
    let initial = "";
    try {
      initial = decodeURIComponent(location.hash.slice(1));
    } catch {
      return; // malformed escape: deep link skipped
    }
    // A click mid-glide leaves the suffixed form in the url; match it too.
    const id = [initial, initial.replace(/-$/, "")].find((i) => document.getElementById(i));
    if (!id) return;
    const timer = setTimeout(() => {
      jumpToSection(id);
      whenScrollSettled(() => {
        document.documentElement.classList.remove("gliding");
        flashHeading(id);
      });
    }, DEEP_LINK_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (groups.length === 0) {
    return (
      <Paragraph className="w-full max-w-2xl text-center">{t("contacts.placeholder")}</Paragraph>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-10">
      {groups.map((group) => (
        <section key={group.key} className="flex w-full flex-col items-center gap-4">
          <H2 id={group.key} className="frost bare-heading">
            {group.label[lang]}
          </H2>
          <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
            {group.people.map((person) => (
              <ContactCard key={person.id} contact={person} id={person.id} lang={lang} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
