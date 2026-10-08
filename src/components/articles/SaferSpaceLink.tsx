import { useTranslation } from "react-i18next";

import { links } from "../../lib/data";
import { useActiveLang } from "../../lib/lang";
import { TextLink } from "../text";

// Centering is <Center>'s job. Standalone use shows the i18n "click to read"
// label; passing `text` renders an inline mention with a custom label instead
// (e.g. "LTKY's safe principles" inside a sentence).
export function SaferSpaceLink({ text }: { text?: string }) {
  const { t } = useTranslation();
  const lang = useActiveLang();
  return <TextLink href={links.saferSpace[lang]} text={text ?? t("safer_space.click")} />;
}
