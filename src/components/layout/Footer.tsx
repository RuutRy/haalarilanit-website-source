import { SiDiscord, SiInstagram } from "@icons-pack/react-simple-icons";
import { Link, useRouterState } from "@tanstack/react-router";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LangToggle } from "@/components/lang-toggle";

import { links } from "../../lib/data";
import { langFromPath } from "../../lib/lang";
import { Hint } from "../Hint";
import { LogoLink } from "../media/LogoLink";
import { LINK_ICON_CLS } from "../text/TextLink";

export function Footer() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = langFromPath(pathname);

  return (
    <footer className="mt-auto bg-(--panel-tint) py-6 backdrop-blur-lg">
      {/* One wrapping flex row; the lines re-arrange per breakpoint. Geometry matches main. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-start gap-x-8 gap-y-2.5 px-4 sm:px-8 lg:items-center">
        {/* fluid ps inset keeps the groups off the edge on wrapped layouts */}
        <nav
          className="order-1 flex gap-x-8 ps-[5vw] lg:order-2 lg:flex-1 lg:justify-end lg:me-[5%] lg:ps-0"
          aria-label={t("footer.links")}
        >
          <div className="flex flex-col items-start gap-0.5 lg:gap-1">
            <h3 className="text-base font-semibold text-primary uppercase">{t("footer.site")}</h3>
            <div className="flex flex-col">
              <Link
                to="/$lang/rules"
                params={{ lang }}
                className="py-1 text-base text-foreground/70 transition-colors hover:text-primary"
              >
                {t("nav.rules")}
                <LinkIcon aria-hidden className={LINK_ICON_CLS} />
              </Link>
              <Link
                to="/$lang/guide"
                params={{ lang }}
                className="py-1 text-base text-foreground/70 transition-colors hover:text-primary"
              >
                {t("nav.guidance")}
                <LinkIcon aria-hidden className={LINK_ICON_CLS} />
              </Link>
              <Link
                to="/$lang/tournament"
                params={{ lang }}
                className="py-1 text-base text-foreground/70 transition-colors hover:text-primary"
              >
                {t("nav.tournaments")}
                <LinkIcon aria-hidden className={LINK_ICON_CLS} />
              </Link>
              <Link
                to="/$lang/contact"
                params={{ lang }}
                className="py-1 text-base text-foreground/70 transition-colors hover:text-primary"
              >
                {t("nav.contacts")}
                <LinkIcon aria-hidden className={LINK_ICON_CLS} />
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-0.5 lg:gap-1">
            <h3 className="text-base font-semibold text-primary uppercase">{t("footer.event")}</h3>
            <div className="flex flex-col">
              {links.ticket && (
                <a
                  href={links.ticket}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1 text-base text-foreground/70 transition-colors hover:text-primary"
                >
                  {t("footer.ticket")}
                  <ExternalLink aria-hidden className={LINK_ICON_CLS} />
                </a>
              )}
              <a
                href={links.saferSpace[lang]}
                target="_blank"
                rel="noreferrer"
                className="py-1 text-base text-foreground/70 transition-colors hover:text-primary"
              >
                {t("footer.safer_space")}
                <ExternalLink aria-hidden className={LINK_ICON_CLS} />
              </a>
            </div>
          </div>
        </nav>

        <div className="order-3 flex w-full shrink-0 items-center justify-center gap-2.5 lg:order-1 lg:w-auto lg:justify-start lg:gap-4.5">
          {links.organizers.map((org) => (
            <LogoLink
              key={org.name}
              href={org.url}
              name={org.name}
              src={org.logo}
              whiteSrc={org.logoWhite}
              tinted
              imgClassName="aspect-square w-9 lg:w-14"
            />
          ))}
        </div>

        <div className="order-2 ms-auto flex shrink-0 items-center gap-1.5 lg:order-3 lg:ms-0 lg:self-start lg:gap-3.5">
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
                  <SiInstagram className="size-5 lg:size-6" />
                ) : s.name === "Discord" ? (
                  <SiDiscord className="size-5 lg:size-6" />
                ) : null}
              </a>
            </Hint>
          ))}
        </div>

        {/* order-4 + w-full keep the legal row on its own line */}
        <div className="order-4 mt-5.5 flex w-full items-center justify-between gap-4 border-t border-foreground/10 pt-3.5">
          <p className="flex flex-wrap items-center gap-2 text-base text-foreground/50">
            {t("footer.copyright", { year: new Date().getFullYear() })}
            <a
              href={`https://github.com/RuutRy/haalarilanit-website-source/tree/${import.meta.env.VITE_COMMIT_HASH}`}
              target="_blank"
              rel="noreferrer"
              title={`build ${import.meta.env.VITE_COMMIT_HASH}`}
              className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-sm text-foreground/60 transition-colors hover:text-primary"
            >
              <code className="flex items-center gap-1">
                {import.meta.env.VITE_COMMIT_HASH}
                <ExternalLink aria-hidden className={LINK_ICON_CLS} />
              </code>
            </a>
          </p>
          <LangToggle />
        </div>
      </div>
    </footer>
  );
}
