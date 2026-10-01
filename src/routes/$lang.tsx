import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

import { syncRouteLanguage } from "../lib/i18n";
import { isLang } from "../lib/lang";

// Layout for the language trees: the URL owns language. beforeLoad runs
// before first render on both server (prerender) and client navigation.
export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params, preload }) => {
    if (!isLang(params.lang)) throw notFound();
    syncRouteLanguage(preload, params.lang);
  },
  component: () => <Outlet />,
});
