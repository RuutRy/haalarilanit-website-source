import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageContent, Section } from "../components/layout";
import { MonoImage } from "../components/media/MonoImage";
import { Heading, List, Paragraph } from "../components/text";

export const Route = createFileRoute("/guide")({
  component: GuidePage,
});

function GuidePage() {
  const { t } = useTranslation();

  return (
    <PageContent>
      <Heading level={1} text={t("guidance.header")} />

      <div className="bg-panel w-full max-w-2xl p-3 sm:p-4">
        <MonoImage
          src="/assets/floorplan.svg"
          alt={t("guidance.floorplan_alt")}
          width={1053.263}
          height={1365.383}
          className="w-full"
        />
      </div>

      <Section>
        <Paragraph text={t("guidance.paragraph_1")} />
        <Paragraph text={t("guidance.paragraph_2")} />
      </Section>

      <Heading level={1} text={t("equipment.header")} />

      <Section>
        <Paragraph text={t("equipment.descriptor")} />
        <List
          items={[
            t("equipment.equipment_1"),
            t("equipment.equipment_2"),
            t("equipment.equipment_3"),
            t("equipment.equipment_4"),
            t("equipment.equipment_5"),
            t("equipment.equipment_6"),
            t("equipment.equipment_7"),
            t("equipment.equipment_8"),
            t("equipment.equipment_9"),
          ]}
        />
      </Section>
    </PageContent>
  );
}
