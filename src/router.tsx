import { createRouter } from "@tanstack/react-router";

import { NotFoundPage } from "./routes/not-found";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Deliberate navigations glide to the top; back/forward restorations
    // below are forced back to instant.
    scrollRestorationBehavior: "smooth",
    defaultPreload: "render",
    // Hydration on real 404 hits (unknown URLs) must match the
    // prerendered /404.html tree - i.e. the /not-found route component.
    defaultNotFoundComponent: () => <NotFoundPage />,
  });

  // Browser back/forward must restore scroll instantly - a smooth glide
  // through page history feels broken. scrollRestorationBehavior is only
  // read globally (router-core), so flip it around the popstate
  // restoration: instant before the restore, back to smooth once the
  // router has rendered that navigation. The timeout covers popstates
  // that produce no navigation (same-URL back).
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
