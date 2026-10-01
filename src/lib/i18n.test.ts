import { expect, test } from "vitest";

import i18n, { syncRouteLanguage } from "./i18n";

// Regression: link mounts preload routes (defaultPreload "render") and
// preloading runs the target route's beforeLoad - including the language
// toggle into the other tree. A preload must never flip the language of
// the page being viewed; only real navigations sync it.
test("preload lanes leave the language alone; navigations sync it", () => {
  syncRouteLanguage(false, "fi");
  expect(i18n.language).toBe("fi");

  // Header/footer links into the EN tree preload /en/* while /fi/* is open.
  syncRouteLanguage(true, "en");
  expect(i18n.language).toBe("fi");

  syncRouteLanguage(true, "fi");
  expect(i18n.language).toBe("fi");

  syncRouteLanguage(false, "en");
  expect(i18n.language).toBe("en");
});
