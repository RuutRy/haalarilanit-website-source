import { useTranslation } from "react-i18next";

import { links } from "../../lib/data";
import { TextLink } from "../text";

// Safer space policy link, extracted from the front page shell. The
// policy PDF exists per language; i18n.language picks the tree.
export function SaferSpaceLink() {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex justify-center">
      <TextLink
        href={links.saferSpace[i18n.language === "en" ? "en" : "fi"]}
        text={t("safer_space.click")}
      />
    </div>
  );
}
