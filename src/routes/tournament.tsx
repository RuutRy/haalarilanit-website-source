import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/tournament")({
  component: TournamentPage,
});

function TournamentPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="glass-inline text-h1-fluid">{t("tournaments.header")}</h1>
      <section className="w-full max-w-2xl">
        <p className="glass-panel w-fit text-center">{t("tournaments.text")}</p>
      </section>
    </div>
  );
}
