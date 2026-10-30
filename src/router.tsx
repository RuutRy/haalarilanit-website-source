import { createRouter } from "@tanstack/react-router";

import { NotFoundPage } from "./components/NotFoundPage";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Deliberate navigations glide to the top; back/forward restorations are forced back to instant.
    scrollRestorationBehavior: "smooth",
    defaultPreload: "render",
    // Hydration on real 404 hits must match the served 404 document's tree - /fi/404 renders this same component.
    defaultNotFoundComponent: () => <NotFoundPage />,
  });

  // Back/forward must restore scroll instantly (a glide through history feels broken).
  // The option is read globally, so flip it around each popstate; the timeout covers no-op popstates.
  if (typeof window !== "undefined") {
    addEventListener("popstate", () => {
      router.options.scrollRestorationBehavior = "instant";
      const unsubscribe = router.subscribe("onRendered", () => {
        unsubscribe();
        router.options.scrollRestorationBehavior = "smooth";
      });
      setTimeout(() => {
        unsubscribe();
        router.options.scrollRestorationBehavior = "smooth";
      }, 2000);
    });
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
