import { createFileRoute } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { contacts } from "../lib/data";
import i18n from "../lib/i18n";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();

  const finnish = (i18n.language ?? "fi") === "fi";
  const visibleContacts = contacts.filter((c) => c.name.trim().length > 0);

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="glass-inline text-h1-fluid">{t("contacts.header")}</h1>

      {visibleContacts.length > 0 ? (
        <div className="flex w-full flex-wrap items-stretch justify-center gap-6">
          {visibleContacts.map((contact) => (
            <section
              key={contact.name}
              className="flex w-full max-w-xs flex-col items-center gap-2 rounded-2xl border border-milk/10 bg-ink p-6 text-center shadow-lg"
            >
              <p className="text-h3-fluid">{contact.name}</p>
              <p className="text-fluid text-milk/70">
                {(finnish ? contact.rolesFi : contact.rolesEn).join(" · ")}
              </p>
              {/* Email sits at the bottom of every card, and an invisible
                  spacer keeps the height when there is no email - so all
                  cards line up regardless of name/role lengths */}
              {contact.email.trim().length > 0 ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-auto inline-flex items-center gap-2 pt-2 text-fluid text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <MailIcon className="size-5" />
                  {contact.email}
                </a>
              ) : (
                <span
                  aria-hidden="true"
                  className="mt-auto inline-flex items-center gap-2 pt-2 text-fluid opacity-0"
                >
                  <MailIcon className="size-5" />a
                </span>
              )}
            </section>
          ))}
        </div>
      ) : (
        <section className="w-full max-w-2xl">
          <p className="glass-panel w-fit text-center">{t("contacts.placeholder")}</p>
        </section>
      )}
    </div>
  );
}
