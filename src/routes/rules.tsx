import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/rules")({
  component: RulesPage,
});

function RulesPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="glass-inline text-h1-fluid">{t("rules.header")}</h1>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("rules.dont_bring.header")}</h2>
        <ul className="glass-panel list-inside list-disc ps-0 text-justify">
          <li>{t("rules.dont_bring.category_1")}</li>
          <li>{t("rules.dont_bring.category_2")}</li>
          <li>{t("rules.dont_bring.category_3")}</li>
        </ul>
      </section>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("rules.substances.header")}</h2>
        <p className="glass-panel text-justify">{t("rules.substances.point_1")}</p>
        <p className="glass-panel text-justify">{t("rules.substances.point_2")}</p>
      </section>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("rules.power.header")}</h2>
        <p className="glass-panel text-justify">{t("rules.power.point_1")}</p>
        <p className="glass-panel text-justify">{t("rules.power.point_2")}</p>
      </section>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("rules.damages.header")}</h2>
        <p className="glass-panel text-justify">{t("rules.damages.text")}</p>
      </section>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("rules.network.header")}</h2>
        <p className="glass-panel text-justify">{t("rules.network.beginning")}</p>
        <ul className="glass-panel list-inside list-disc ps-0 text-justify">
          <li>{t("rules.network.category_1")}</li>
          <li>{t("rules.network.category_2")}</li>
          <li>{t("rules.network.category_3")}</li>
          <li>{t("rules.network.category_4")}</li>
          <li>{t("rules.network.category_5")}</li>
        </ul>
      </section>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("rules.sleep.header")}</h2>
        <p className="glass-panel text-justify">{t("rules.sleep.text")}</p>
      </section>

      <section className="flex w-full max-w-3xl flex-col gap-2">
        <h2 className="glass-inline text-h2-fluid">{t("rules.other.header")}</h2>
        <ul className="glass-panel list-inside list-disc ps-0 text-justify">
          <li>{t("rules.other.point_1")}</li>
          <li>{t("rules.other.point_2")}</li>
          <li>{t("rules.other.point_3")}</li>
          <li>{t("rules.other.point_4")}</li>
        </ul>
      </section>
    </div>
  );
}
