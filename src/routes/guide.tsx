import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/guide")({
  component: GuidePage,
});

function GuidePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="glass-inline text-h1-fluid">{t("guidance.header")}</h1>

      <div className="glass-panel w-full max-w-2xl p-3 sm:p-4">
        <img
          src="/assets/floorplan.svg"
          alt="Tapahtumapaikan pohjakartta"
          width={1053}
          height={1365}
          decoding="async"
          className="h-auto w-full [filter:var(--white-filter)]"
        />
      </div>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <p className="glass-panel text-justify">{t("guidance.paragraph_1")}</p>
        <p className="glass-panel text-justify">{t("guidance.paragraph_2")}</p>
      </section>

      <h1 className="glass-inline text-h1-fluid">{t("equipment.header")}</h1>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <p className="glass-panel text-justify">{t("equipment.descriptor")}</p>
        <ul className="glass-panel list-disc ps-6 text-start">
          <li>{t("equipment.equipment_1")}</li>
          <li>{t("equipment.equipment_2")}</li>
          <li>{t("equipment.equipment_3")}</li>
          <li>{t("equipment.equipment_4")}</li>
          <li>{t("equipment.equipment_5")}</li>
          <li>{t("equipment.equipment_6")}</li>
          <li>{t("equipment.equipment_7")}</li>
          <li>{t("equipment.equipment_8")}</li>
          <li>{t("equipment.equipment_9")}</li>
        </ul>
      </section>
    </div>
  );
}
