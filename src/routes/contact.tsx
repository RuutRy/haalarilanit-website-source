import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ContactCard } from "../components/ContactCard";
import { PageContent } from "../components/layout";
import { Heading } from "../components/text";
import { contacts } from "../lib/data";
import i18n from "../lib/i18n";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();

  const lang = (i18n.language ?? "fi") === "fi" ? "fi" : "en";
  const visibleContacts = contacts.filter((c) => c.name.trim().length > 0);

  return (
    <PageContent>
      <Heading level={1} text={t("contacts.header")} />

      {visibleContacts.length > 0 ? (
        <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
          {visibleContacts.map((contact) => (
            <ContactCard key={contact.name} contact={contact} lang={lang} />
          ))}
        </div>
      ) : (
        <section className="w-full max-w-2xl">
          <p className="bg-panel w-fit text-center">{t("contacts.placeholder")}</p>
        </section>
      )}
    </PageContent>
  );
}
