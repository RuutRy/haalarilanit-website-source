import { useTranslation } from "react-i18next";

import { links } from "../../lib/data";
import { useActiveLang } from "../../lib/lang";
import { TextLink } from "../text";

// Safer space policy link, extracted from the front page shell.
export function SaferSpaceLink() {
  const { t } = useTranslation();
  const lang = useActiveLang();
  return (
    <div className="flex justify-center">
      <TextLink href={links.saferSpace[lang]} text={t("safer_space.click")} />
    </div>
  );
}
