import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Hero } from "../components/Hero";
import { Sponsors } from "../components/Sponsors";
import { links } from "../lib/data";

export const Route = createFileRoute("/")({
  component: MainPage,
});

function MainPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-10 text-center">
      {/* Hero: logo, time line, flip clock phases, ticket CTA */}
      <Hero />

      {/* What's this all about */}
      <section className="flex w-full max-w-3xl flex-col gap-4">
        <h2 className="glass-inline text-h2-fluid">{t("main.header")}</h2>
        <p className="glass-panel text-justify">{t("main.main_1")}</p>
        <p className="glass-panel text-justify">{t("main.main_2")}</p>
        <p className="glass-panel text-justify">{t("main.main_3")}</p>
        <p className="glass-panel text-justify">
          {t("main.main_4.text")}
          <Link to="/guide" className="text-accent hover:underline">
            {t("main.main_4.anchor")}
          </Link>
          .
        </p>
        <p className="glass-panel text-justify">
          {t("main.main_5.text")}
          <Link to="/contact" className="text-accent hover:underline">
            {t("main.main_5.anchor")}
          </Link>
          .
        </p>
      </section>

      {/* Sponsor logos between the intro and the policy sections */}
      <Sponsors />

      {/* Safer space policy - link lives in data.ts */}
      <section className="flex w-full flex-col items-center gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("safer_space.header")}</h2>
        <a
          href={links.saferSpace}
          target="_blank"
          rel="noopener"
          className="glass-inline text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("safer_space.click")}
        </a>
      </section>

      {/* Photo galleries */}
      <section className="flex w-full flex-col items-center gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("main.photos.header")}</h2>
        <p className="glass-panel w-fit">{t("main.photos.text")}</p>
        <div className="flex gap-4">
          {links.photos.map((photo) => (
            <a
              key={photo.label}
              href={photo.url}
              target="_blank"
              rel="noopener"
              className="glass-inline text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {photo.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
