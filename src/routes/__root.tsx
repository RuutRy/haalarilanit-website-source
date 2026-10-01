import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { StrictMode, type ReactNode } from "react";

// oxlint-disable-next-line import/no-unassigned-import -- i18n init
import "../lib/i18n";
// oxlint-disable-next-line import/no-unassigned-import -- tailwind
import "../tailwind.css";
// oxlint-disable-next-line import/no-unassigned-import -- theme tokens
import "../index.css";
import { Background } from "../components/background/Background";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { TooltipProvider } from "../components/ui/tooltip";
import i18n from "../lib/i18n";
import { langFromPath } from "../lib/lang";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Haalarilanit" },
      // Discord/og embed cards (see https://discord.com/developers/docs
      // -> reference -> social). og:image needs an absolute URL and a
      // raster file renders best in embeds - swap in a PNG when one
      // exists, SVGs are not supported by most scrapers.
      { property: "og:title", content: "Haalarilanit" },
      {
        property: "og:description",
        content: "Opiskelijoiden LAN-tapahtuma 19.-22.11.2026 LAB-kampuksen liikuntasalissa.",
      },
      { property: "og:url", content: "https://haalarilan.it" },
      { property: "og:image", content: "https://haalarilan.it/assets/logotext.svg" },
      { property: "og:type", content: "website" },
      // Accent color for the embed's left side bar (brand orange).
      { name: "theme-color", content: "#e38717" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "icon", type: "image/svg+xml", href: "/assets/favicon.svg" }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <TooltipProvider delayDuration={100}>
        <RootLayout />
      </TooltipProvider>
    </RootDocument>
  );
}

function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Background />
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  // <html> lang follows the URL tree so prerendered pages carry the
  // right language; React keeps the attribute in sync on navigation.
  const lang = langFromPath(useRouterState({ select: (s) => s.location.pathname }));
  // Language switches synchronously here, above every translated
  // component (header, footer, pages) - prerender and client nav
  // both pick it up before first paint of the tree's content.
  i18n.changeLanguage(lang);
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        <StrictMode>{children}</StrictMode>
        <Scripts />
      </body>
    </html>
  );
}
