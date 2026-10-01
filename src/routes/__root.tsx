import { createRootRoute, HeadContent, Outlet, redirect, Scripts } from "@tanstack/react-router";
import { type ReactNode, StrictMode } from "react";

// side-effect import: i18n init
import "../lib/i18n";
// side-effect import: tailwind
import "../tailwind.css";
// side-effect import: theme tokens
import "../index.css";
import { Background } from "../components/background/Background";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/header";
import { TooltipProvider } from "../components/ui/tooltip";
import { SITE_URL } from "../lib/data";
import { syncRouteLanguage } from "../lib/i18n";
import {
  DEFAULT_LANG,
  isLang,
  LANG_404_META_NAME,
  LANGS,
  preferredLang,
  useActiveLang,
} from "../lib/lang";

// Pre-paint head script: sends the bare root to the visitor's language and
// 404 hits of the static document (marker meta) to /<lang>/404. It has to be
// client JS - the static host can neither read localStorage nor split its 404
// override per tree. The payload crosses JSON.stringify once with `<` escaped.
const LANG_REDIRECT_CONFIG = JSON.stringify({
  langs: LANGS,
  default: DEFAULT_LANG,
  marker: LANG_404_META_NAME,
}).replace(/</g, "\\u003c");

const LANG_REDIRECT_SCRIPT = `try{var c=${LANG_REDIRECT_CONFIG},p=location.pathname,l=localStorage.getItem("lang"),m=document.querySelector('meta[name="'+c.marker+'"]');if(p==="/"||p===""){location.replace("/"+(c.langs.indexOf(l)>=0?l:c.default))}else if(m){var s=p.split("/")[1],w=c.langs.indexOf(s)>=0?s:c.langs.indexOf(l)>=0?l:c.default,t="/"+w+"/404";if(p!==t)location.replace(t)}}catch(e){}`;

export const Route = createRootRoute({
  // The i18n instance is shared between SSR renders: without this sync the
  // previous page's language would leak into the next one. Tree paths pin
  // the language; 404s prefer the remembered one (the server has no
  // localStorage).
  beforeLoad: ({ preload, location }) => {
    syncRouteLanguage(preload, preferredLang(location.pathname));
    // 404s render only at /<lang>/404 (full-page loads bounce pre-paint);
    // "/" is a real page (the head script normalizes it).
    const segment = location.pathname.split("/")[1];
    if (!isLang(segment) && location.pathname !== "/") {
      throw redirect({
        to: "/$lang/404",
        params: { lang: preferredLang(location.pathname) },
        replace: true,
      });
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Haalarilanit" },
      // Site-wide card meta; descriptions and og:locale are per route (see
      // seoHead). og:image is a raster - platforms skip svg images.
      { property: "og:title", content: "Haalarilanit" },
      { property: "og:site_name", content: "Haalarilanit" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/assets/og-image.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Haalarilanit 2026 logotype" },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#e38717" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      // Preload the display font: with font-display: block headlines
      // would otherwise stay invisible until the post-CSS font fetch.
      {
        rel: "preload",
        href: "/fonts/groteskia/GROTESKIA.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/assets/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/favicon-32x32.png" },
      { rel: "icon", type: "image/svg+xml", href: "/assets/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/assets/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
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
  // <html lang> follows the effective language (URL tree, remembered on 404s).
  const lang = useActiveLang();
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
        {/* After HeadContent so the 404 marker meta is parsed; pre-paint redirects. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: build-time constant; all config crosses JSON.stringify with `<` escaped */}
        <script dangerouslySetInnerHTML={{ __html: LANG_REDIRECT_SCRIPT }} />
      </head>
      <body>
        <StrictMode>{children}</StrictMode>
        <Scripts />
      </body>
    </html>
  );
}
