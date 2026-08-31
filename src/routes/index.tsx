import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Hero } from "../components/Hero";
import { PageContent, Section } from "../components/layout";
import { Sponsors } from "../components/Sponsors";
import { Heading, Paragraph, TextLink } from "../components/text";
import { links } from "../lib/data";

export const Route = createFileRoute("/")({
  component: MainPage,
});

function MainPage() {
  const { t } = useTranslation();

  return (
    <PageContent className="gap-10 text-center">
      {/* Hero: logo, time line, flip clock phases, ticket CTA */}
      <Hero />

      {/* What's this all about */}
      <Section className="gap-4">
        <Heading level={2} text={t("main.header")} />
        <Paragraph text={t("main.main_1")} />
        <Paragraph text={t("main.main_2")} />
        <Paragraph text={t("main.main_3")} />
        <Paragraph>
          {t("main.main_4.text")}
          <TextLink to="/guide" text={t("main.main_4.anchor")} />.
        </Paragraph>
        <Paragraph>
          {t("main.main_5.text")}
          <TextLink to="/contact" text={t("main.main_5.anchor")} />.
        </Paragraph>
      </Section>

      {/* Sponsor logos between the intro and the policy sections */}
      <Sponsors />

      {/* Safer space policy - link lives in data.ts */}
      <Section className="max-w-none items-center">
        <Heading level={2} text={t("safer_space.header")} />
        <TextLink href={links.saferSpace} text={t("safer_space.click")} className="bg-inline" />
      </Section>

      {/* Photo galleries */}
      <Section className="max-w-none items-center">
        <Heading level={2} text={t("main.photos.header")} />
        <Paragraph text={t("main.photos.text")} className="w-fit" />
        <div className="flex gap-4">
          {links.photos.map((photo) => (
            <TextLink key={photo.label} href={photo.url} text={photo.label} className="bg-inline" />
          ))}
        </div>
      </Section>
    </PageContent>
  );
}
