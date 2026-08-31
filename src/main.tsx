import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";

// oxlint-disable-next-line import/no-unassigned-import -- i18n init
import "./lib/i18n";
import { TooltipProvider } from "./components/ui/tooltip";
import { routeTree } from "./routeTree.gen";
// oxlint-disable-next-line import/no-unassigned-import -- tailwind
import "./tailwind.css";
// oxlint-disable-next-line import/no-unassigned-import -- theme tokens
import "./index.css";

function NotFound() {
  const { t } = useTranslation();
  return <h2 className="text-center">{t("content_unavailable")}</h2>;
}

const router = createRouter({
  routeTree,
  defaultPreload: "render",
  scrollRestoration: true,
  defaultNotFoundComponent: NotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider delayDuration={100}>
      <RouterProvider router={router} />
    </TooltipProvider>
  </StrictMode>,
);
