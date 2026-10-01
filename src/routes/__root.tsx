import { HeadContent, Outlet, Scripts, createRootRoute, redirect } from "@tanstack/react-router";
import { StrictMode, type ReactNode } from "react";

// oxlint-disable-next-line import/no-unassigned-import -- i18n init
import "../lib/i18n";
// oxlint-disable-next-line import/no-unassigned-import -- tailwind
import "../tailwind.css";
// oxlint-disable-next-line import/no-unassigned-import -- theme tokens
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
  LANGS,
  LANG_404_META_NAME,
  preferredLang,
  useActiveLang,
} from "../lib/lang";

// Runs in <head>, after HeadContent's tags (a script this late still
// executes before any body content paints). Two jobs:
// 1. the bare root always normalizes to the visitor's tree: remembered
//    language, else the default (/fi) - history-replaced, pre-paint;
// 2. on a 404 document (marker meta, stamped with the language it
//    renders in - only the prerendered 404 pages have it) the visitor
//    goes to /<lang>/404, a real prerendered page in that language. The
//    URL's tree wins over the remembered language; the per-tree pages
//    stamp their own language, which stops the loop.
// This is necessarily client JS (the static host can neither read
// localStorage nor split its single 404 override per tree), but it is
// pre-paint and single-hop, and bots/no-JS visitors keep the static 404
// status with no JS involvement at all.
// Every interpolated value crosses JSON.stringify exactly once (and `<` is
// escaped so the payload can never terminate the script element or smuggle
// markup, however the constants below change):
const LANG_REDIRECT_CONFIG = JSON.stringify({
  langs: LANGS,
  default: DEFAULT_LANG,
  marker: LANG_404_META_NAME,
}).replace(/</g, "\\u003c");

const LANG_REDIRECT_SCRIPT = `try{var c=${LANG_REDIRECT_CONFIG},p=location.pathname,l=localStorage.getItem("lang"),m=document.querySelector('meta[name="'+c.marker+'"]');if(p==="/"||p===""){location.replace("/"+(c.langs.indexOf(l)>=0?l:c.default))}else if(m){var s=p.split("/")[1],w=c.langs.indexOf(s)>=0?s:c.langs.indexOf(l)>=0?l:c.default,t="/"+w+"/404";if(p!==t)location.replace(t)}}catch(e){}`;

export const Route = createRootRoute({
  // Runs before every child's beforeLoad (top-down), on every real load:
  // the i18n instance is a process-wide singleton on the server, and
  // without this sync an earlier /en request would leave it English for
  // the next SSR'd URL - e.g. an unknown path renders an English 404
  // that the client then hydrates back to Finnish. Tree paths pin the
  // language to the URL; language-less paths (404s) prefer the visitor's
  // remembered language (browser only - the server has no localStorage).
  beforeLoad: ({ preload, location }) => {
    syncRouteLanguage(preload, preferredLang(location.pathname));
    // 404s always render at /<lang>/404: full-page loads bounce pre-paint
    // via the head script (before this ever runs); soft navigations get
    // the same redirect here, history-replaced so back skips the broken
    // URL. "/" is a real page (the script normalizes it) and /not-found
    // exists only to be prerendered into /404.html - neither redirects.
    const segment = location.pathname.split("/")[1];
    if (!isLang(segment) && location.pathname !== "/" && location.pathname !== "/not-found") {
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
      // Embed card meta; og:image needs an absolute URL.
      { property: "og:title", content: "Haalarilanit" },
      {
        property: "og:description",
        content:
          "Haalarilanit on suuri lanitapahtuma, jota on järjestetty LAB-kampuksen liikuntasalissa Lappeenrannassa. Luvassa on syksyn eeppisin pelihetki, kun lähes kaksisataa pelaajaa kerääntyy yhteen saliin ja nauttii yhdessä pelaamisen ilosta. Olitpa sitten intohimoinen e-urheilija tai rento viikonlopun pelaaja, peliseuraa riittää varmasti.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/assets/logotext.svg` },
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
      { rel: "icon", type: "image/svg+xml", href: "/assets/favicon.svg" },
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
  // <html lang> follows the effective language - the URL's tree, or the
  // remembered language on language-less paths (preferredLang, synced in
  // beforeLoad). useActiveLang reads the synced i18n instance, so the
  // attribute tracks a post-hydration 404 language flip like the rest
  // of the page.
  const lang = useActiveLang();
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
        {/* After HeadContent: the script reads the 404 marker meta the
            route head rendered. Still parser-blocking, so every redirect
            here happens before any paint. */}
        <script dangerouslySetInnerHTML={{ __html: LANG_REDIRECT_SCRIPT }} />
      </head>
      <body>
        <StrictMode>{children}</StrictMode>
        <Scripts />
      </body>
    </html>
  );
}
