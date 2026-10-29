import { SiDiscord, SiInstagram } from "@icons-pack/react-simple-icons";
import { Link, useRouterState } from "@tanstack/react-router";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LangToggle } from "@/components/lang-toggle";

import { links } from "../../lib/data";
import { langFromPath } from "../../lib/lang";
import { ARTICLE_SECTIONS } from "../../lib/navigation";
import { Hint } from "../Hint";
import { LogoLink } from "../media/LogoLink";
import { Sponsors } from "../media/Sponsors";
import { LINK_ICON_CLS } from "../text/TextLink";

// Shared organizer logo row; sized per breakpoint context by the caller.
function OrganizerLogos({
  imgClassName,
  linkClassName,
}: {
  imgClassName: string;
  linkClassName?: string;
}) {
  return (
    <>
      {links.organizers.map((org) => (
        <LogoLink
          key={org.name}
          href={org.url}
          name={org.name}
          src={org.logo}
          whiteSrc={org.logoWhite}
          tinted
          imgClassName={imgClassName}
          linkClassName={linkClassName}
        />
      ))}
    </>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = langFromPath(pathname);

  return (
    <footer className="mt-auto bg-(--panel-tint) py-6 backdrop-blur-lg">
      {/* Kept small so it doesn't compete with the organizer logos below. */}
      <section
        aria-label={t("footer.sponsors")}
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2.5 px-4 pb-5 sm:px-8"
      >
        <Sponsors size={{ min: 28, max: 40 }} className="p-0" gap={20} />
      </section>
      {/* One wrapping flex row; the lines re-arrange per breakpoint. Geometry matches main. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-start gap-x-8 gap-y-2.5 px-4 sm:px-8 sm:items-center">
        {/* On narrow screens the columns wrap inside the nav while the socials stay pinned to the
            top-right corner of the grid; sm:contents dissolves the wrapper so they rejoin the main row. */}
        <div className="order-1 grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2.5 sm:contents">
          {/* fluid ps inset keeps the groups off the edge on wrapped layouts */}
          <nav
            className="flex min-w-0 flex-nowrap gap-x-8 gap-y-2.5 ps-[5vw] sm:order-2 sm:flex-1 sm:justify-end sm:ps-0 md:me-[5%]"
            aria-label={t("footer.links")}
          >
            <div className="flex min-w-0 flex-col items-start gap-0.5 sm:gap-1">
              <h3 className="text-base font-semibold text-primary uppercase">{t("footer.site")}</h3>
              <div className="flex flex-col">
                {ARTICLE_SECTIONS.map((link) => (
                  <Link
                    key={link.article}
                    to="/$lang/$article"
                    params={{ lang, article: link.article }}
                    className="py-1 text-base text-foreground/70 transition-colors hover:text-primary"
                  >
                    {t(link.labelKey)}
                    <LinkIcon aria-hidden className={LINK_ICON_CLS} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex min-w-0 flex-col items-start gap-0.5 sm:gap-1">
              <h3 className="text-base font-semibold text-primary uppercase">
                {t("footer.event")}
              </h3>
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

          <div className="flex shrink-0 items-center gap-1.5 sm:order-3 sm:self-start sm:gap-3.5">
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
                    <SiInstagram className="size-5 sm:size-6" />
                  ) : s.name === "Discord" ? (
                    <SiDiscord className="size-5 sm:size-6" />
                  ) : null}
                </a>
              </Hint>
            ))}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-4.5 sm:order-1 sm:flex">
          <OrganizerLogos imgClassName="aspect-square w-14" />
        </div>

        {/* order-4 + w-full keep the legal block on its own lines. Mobile: logos + toggle share
            the top line, copyright wraps centered below; sm returns to the single copyright/toggle row. */}
        <div className="order-4 mt-5.5 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-foreground/10 pt-3.5">
          <div className="order-1 flex items-center gap-1.5 sm:hidden">
            <OrganizerLogos imgClassName="aspect-square h-9 w-9" linkClassName="p-1" />
          </div>
          <p className="order-3 flex w-full flex-wrap items-center justify-center gap-2 text-base text-foreground/50 sm:order-none sm:w-fit sm:justify-start">
            {t("footer.copyright", { year: new Date().getFullYear() })}
            <a
              href={`https://github.com/RuutRy/haalarilanit-website-source/tree/${import.meta.env.VITE_COMMIT_HASH}`}
              target="_blank"
              rel="noreferrer"
              title={`build ${import.meta.env.VITE_COMMIT_HASH}`}
              className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-xs text-foreground/60 transition-colors hover:text-primary sm:text-sm"
            >
              <code className="flex items-center gap-1">
                {import.meta.env.VITE_COMMIT_HASH}
                <ExternalLink aria-hidden className={LINK_ICON_CLS} />
              </code>
            </a>
          </p>
          <div className="order-2 shrink-0">
            <LangToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
