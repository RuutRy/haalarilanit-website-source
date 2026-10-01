import { useTranslation } from "react-i18next";

import { links } from "../../lib/data";
import { useActiveLang } from "../../lib/lang";
import { TextLink } from "../text";

// Centering is <Center>'s job.
export function SaferSpaceLink() {
  const { t } = useTranslation();
  const lang = useActiveLang();
  return <TextLink href={links.saferSpace[lang]} text={t("safer_space.click")} />;
}
