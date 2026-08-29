import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageContent, Section } from "../components/layout";
import { Heading, List, Paragraph } from "../components/text";

export const Route = createFileRoute("/rules")({
  component: RulesPage,
});

function RulesPage() {
  const { t } = useTranslation();

  return (
    <PageContent>
      <Heading level={1} text={t("rules.header")} />

      <Section>
        <Heading level={2} text={t("rules.dont_bring.header")} />
        <List
          items={[
            t("rules.dont_bring.category_1"),
            t("rules.dont_bring.category_2"),
            t("rules.dont_bring.category_3"),
          ]}
        />
      </Section>

      <Section>
        <Heading level={2} text={t("rules.substances.header")} />
        <Paragraph text={t("rules.substances.point_1")} />
        <Paragraph text={t("rules.substances.point_2")} />
      </Section>

      <Section>
        <Heading level={2} text={t("rules.power.header")} />
        <Paragraph text={t("rules.power.point_1")} />
        <Paragraph text={t("rules.power.point_2")} />
      </Section>

      <Section>
        <Heading level={2} text={t("rules.damages.header")} />
        <Paragraph text={t("rules.damages.text")} />
      </Section>

      <Section>
        <Heading level={2} text={t("rules.network.header")} />
        <Paragraph text={t("rules.network.beginning")} />
        <List
          items={[
            t("rules.network.category_1"),
            t("rules.network.category_2"),
            t("rules.network.category_3"),
            t("rules.network.category_4"),
            t("rules.network.category_5"),
          ]}
        />
      </Section>

      <Section>
        <Heading level={2} text={t("rules.sleep.header")} />
        <Paragraph text={t("rules.sleep.text")} />
      </Section>

      <Section>
        <Heading level={2} text={t("rules.other.header")} />
        <List
          items={[
            t("rules.other.point_1"),
            t("rules.other.point_2"),
            t("rules.other.point_3"),
            t("rules.other.point_4"),
          ]}
        />
      </Section>
    </PageContent>
  );
}
