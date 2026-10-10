import { useTranslation } from "react-i18next";

import { Lightbox } from "../media/Lightbox";

export function Floorplan() {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-2xl p-3 sm:p-4">
      <Lightbox src="/assets/content/floorplan.svg" alt={t("guidance.floorplan_alt")} />
    </div>
  );
}
