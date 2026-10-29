import { useTranslation } from "react-i18next";

import { sponsors } from "../../lib/data";
import { SponsorWall } from "../media/SponsorWall";

export function Sponsors() {
  const { t } = useTranslation();
  if (sponsors.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <h1 className="text-h1-fluid">{t("sponsors")}</h1>
      <SponsorWall />
    </div>
  );
}
