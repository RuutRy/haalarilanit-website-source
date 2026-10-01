import { createFileRoute, notFound } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

import { isLang } from "../lib/lang";

// Layout for the language trees: the URL owns language. Language state
// itself is synced in RootDocument (changeLanguage above the tree), so
// this layout only validates the param and exposes typed context.
export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isLang(params.lang)) throw notFound();
    return { lang: params.lang };
  },
  component: () => <Outlet />,
});
