import { MailIcon, SendIcon } from "lucide-react";

import type { Contact } from "../lib/types";

// Roles per language; a new language = an entry here + a matching Contact field.
const ROLE_KEY = { fi: "rolesFi", en: "rolesEn" } as const;

type Lang = keyof typeof ROLE_KEY;

type ContactCardProps = {
  contact: Contact;
  lang: Lang;
};

// One contact: name, roles, email/Telegram links. A missing value renders an
// invisible spacer so both links keep their row and the cards stay levelled.
export function ContactCard({ contact, lang }: ContactCardProps) {
  const hasEmail = contact.email.trim().length > 0;
  const hasTelegram = contact.telegram.trim().length > 0;

  const rowCls = "h-7 flex items-center justify-center gap-2 text-fluid text-primary";
  const linkCls = `${rowCls} hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`;
  const spacerCls = `${rowCls} opacity-0`;

  return (
    <section className="flex w-full max-w-xs flex-col items-center gap-1 rounded-2xl border border-foreground/10 bg-background p-4 text-center shadow-lg min-h-40">
      <p className="text-h3-fluid">{contact.name}</p>
      <p className="text-fluid text-foreground/70">{contact[ROLE_KEY[lang]].join(" · ")}</p>
      <div className="mt-auto flex w-full flex-col gap-1">
        {hasEmail ? (
          <a href={`mailto:${contact.email}`} className={linkCls}>
            <MailIcon className="size-5" />
            {contact.email}
          </a>
        ) : (
          <span aria-hidden="true" className={spacerCls}>
            <MailIcon className="size-5" />a
          </span>
        )}
        {hasTelegram ? (
          <a
            href={`https://t.me/${contact.telegram}`}
            target="_blank"
            rel="noreferrer"
            className={linkCls}
          >
            <SendIcon className="size-5" />
            {contact.telegram}
          </a>
        ) : (
          <span aria-hidden="true" className={spacerCls}>
            <SendIcon className="size-5" />a
          </span>
        )}
      </div>
    </section>
  );
}
