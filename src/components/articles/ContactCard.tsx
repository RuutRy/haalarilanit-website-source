import { MailIcon, SendIcon } from "lucide-react";

import type { Lang } from "../../lib/lang";
import type { Contact } from "../../lib/types";
import { H3 } from "../text/heading";

type ContactCardProps = {
  contact: Contact;
  // Anchor id for the hold-to-copy heading link.
  id: string;
  lang: Lang;
};

// One contact: name, roles, email/Telegram links. Empty rows are skipped
// outright; the flex row's items-stretch keeps the cards in a row levelled.
export function ContactCard({ contact, id, lang }: ContactCardProps) {
  const email = contact.email.trim();
  const telegram = contact.telegram.trim();
  const roles = contact.roles[lang];

  const linkCls =
    "h-7 flex items-center justify-center gap-2 text-fluid text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <section className="frost flex w-full max-w-xs flex-col items-center gap-1 rounded-2xl p-4 text-center shadow-lg">
      <H3 id={id}>{contact.name}</H3>
      {roles.length > 0 && <p className="text-fluid text-foreground/70">{roles.join(" · ")}</p>}
      <div className="mt-auto flex w-full flex-col gap-1">
        {email !== "" && (
          <a href={`mailto:${email}`} className={linkCls}>
            <MailIcon className="size-5" />
            {email}
          </a>
        )}
        {telegram !== "" && (
          <a href={`https://t.me/${telegram}`} target="_blank" rel="noreferrer" className={linkCls}>
            <SendIcon className="size-5" />
            {telegram}
          </a>
        )}
      </div>
    </section>
  );
}
