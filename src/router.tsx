import { createRouter } from "@tanstack/react-router";

import i18n from "./lib/i18n";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Deliberate navigations glide to the top; back/forward restorations
    // below are forced back to instant.
    scrollRestorationBehavior: "smooth",
    defaultPreload: "render",
    defaultNotFoundComponent: () => (
      <h2 className="text-center">{i18n.t("content_unavailable")}</h2>
    ),
  });

  // Browser back/forward must restore the scroll position instantly -
  // a smooth glide through page history feels broken. Flip the behavior
  // for popstate restorations, then restore it once the scroll has run
  // (it happens synchronously in onRendered, well under the delay).
  // Browser-only: getRouter also runs during SSR.
  if (typeof window !== "undefined") {
    addEventListener("popstate", () => {
      router.options.scrollRestorationBehavior = "instant";
      setTimeout(() => {
        router.options.scrollRestorationBehavior = "smooth";
      }, 100);
    });
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
