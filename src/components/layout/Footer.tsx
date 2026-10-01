import { SiDiscord, SiInstagram } from "@icons-pack/react-simple-icons";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { LangToggle } from "@/components/lang-toggle";

import { links } from "../../lib/data";
import { langFromPath } from "../../lib/lang";
import { Hint } from "../Hint";
import { LogoLink } from "../media/LogoLink";

export function Footer() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = langFromPath(pathname);

  return (
    <footer className="mt-auto bg-background px-4 py-8">
      {/* Mobile: everything left-aligned in one column - centered
          blocks read like a splash page and scatter the eye. lg: brand
          left, link columns center, socials right. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex items-center gap-4">
          {links.organizers.map((org) => (
            <LogoLink
              key={org.name}
              href={org.url}
              name={org.name}
              src={org.logo}
              whiteSrc={org.logoWhite}
              tinted
              imgClassName="w-14 aspect-square"
            />
          ))}
        </div>

        <nav className="grid grid-cols-2 gap-10 lg:self-start" aria-label={t("footer.site")}>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-primary uppercase">{t("footer.site")}</h3>
            <Link
              to="/$lang/contact"
              params={{ lang }}
              className="text-sm text-foreground/70 transition-colors hover:text-primary"
            >
              {t("nav.contacts")}
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-primary uppercase">{t("footer.event")}</h3>
            {links.ticket && (
              <a
                href={links.ticket}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-foreground/70 transition-colors hover:text-primary"
              >
                {t("footer.ticket")}
              </a>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {links.socials.map((s) => (
            <Hint key={s.name} label={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="rounded-lg p-2 text-foreground/70 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {s.name === "Instagram" ? (
                  <SiInstagram className="size-6" />
                ) : s.name === "Discord" ? (
                  <SiDiscord className="size-6" />
                ) : null}
              </a>
            </Hint>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-start gap-3 border-t border-foreground/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-2 text-sm text-foreground/50">
          {t("footer.copyright", { year: new Date().getFullYear() })}
          <a
            href={`https://github.com/RuutRy/haalarilanit-website-source/tree/${import.meta.env.VITE_COMMIT_HASH}`}
            target="_blank"
            rel="noreferrer"
            title={`build ${import.meta.env.VITE_COMMIT_HASH}`}
            className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-xs text-foreground/60 transition-colors hover:text-primary"
          >
            <code>{import.meta.env.VITE_COMMIT_HASH}</code>
          </a>
        </p>
        <LangToggle />
      </div>
    </footer>
  );
}
