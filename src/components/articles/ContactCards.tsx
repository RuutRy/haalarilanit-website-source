import { useTranslation } from "react-i18next";

import { contactGroups } from "../../lib/data";
import { useActiveLang } from "../../lib/lang";
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
    .map((group) => ({ ...group, people: group.people.filter((p) => p.name.trim().length > 0) }))
    .filter((group) => group.people.length > 0);

  if (groups.length === 0) {
    return (
      <Paragraph className="w-full max-w-2xl text-center">{t("contacts.placeholder")}</Paragraph>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-10">
      {groups.map((group) => (
        <section key={group.key} className="flex w-full flex-col items-center gap-4">
          <H2 className="frost bare-heading">{group.label[lang]}</H2>
          <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
            {group.people.map((person) => (
              <ContactCard key={person.name} contact={person} lang={lang} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
