import { useTranslation } from "react-i18next";

import { Lightbox } from "../media/Lightbox";

// Venue floor plan. Finnish drawing is the default; when the English
// floorplan lands in /assets/ it swaps in automatically on /en pages.
export function Floorplan() {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-2xl p-3 sm:p-4">
      <Lightbox
        src="/assets/floorplan-fi.svg"
        srcEn="/assets/floorplan-en.svg"
        alt={t("guidance.floorplan_alt")}
      />
    </div>
  );
}
