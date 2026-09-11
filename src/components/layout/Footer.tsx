import { useTranslation } from "react-i18next";

import { links } from "../../lib/data";
import { LogoLink } from "../media/LogoLink";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto bg-background px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        {/* Organizer logos render from data. */}
        <div className="flex items-center gap-4">
          {links.organizers.map((org) => (
            <LogoLink
              key={org.name}
              href={org.url}
              name={org.name}
              src={org.logo}
              whiteSrc={org.logoWhite}
              tinted
              imgClassName="w-16 aspect-square"
            />
          ))}
        </div>
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
