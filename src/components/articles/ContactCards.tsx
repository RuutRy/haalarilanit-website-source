import { useTranslation } from "react-i18next";

import { contacts } from "../../lib/data";
import { useActiveLang } from "../../lib/lang";
import { ContactCard } from "../ContactCard";
import { Paragraph } from "../text";

// Contact cards from data.ts; when every name is empty, a placeholder line.
export function ContactCards() {
  const { t } = useTranslation();
  const lang = useActiveLang();

  const visibleContacts = contacts.filter((c) => c.name.trim().length > 0);

  if (visibleContacts.length === 0) {
    return (
      <Paragraph className="w-full max-w-2xl text-center">{t("contacts.placeholder")}</Paragraph>
    );
  }

  return (
    <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
      {visibleContacts.map((contact) => (
        <ContactCard key={contact.name} contact={contact} lang={lang} />
      ))}
    </div>
  );
}
