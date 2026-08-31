import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageContent, Section } from "../components/layout";
import { Heading, Paragraph } from "../components/text";

export const Route = createFileRoute("/tournament")({
  component: TournamentPage,
});

function TournamentPage() {
  const { t } = useTranslation();

  return (
    <PageContent>
      <Heading level={1} text={t("tournaments.header")} />
      <Section className="max-w-2xl">
        <Paragraph text={t("tournaments.text")} className="w-fit text-center" />
      </Section>
    </PageContent>
  );
}
