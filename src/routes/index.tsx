import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import type { Lang } from "../lib/lang";

import { DEFAULT_LANG, isLang } from "../lib/lang";

// Root: sniff language (localStorage -> navigator -> fi) and forward
// to the language tree. The redirect runs after mount so hydration
// matches the language-neutral prerendered shell (no #418).
function sniffLang(): Lang {
  const stored = localStorage.getItem("language");
  if (isLang(stored)) return stored;
  const nav = navigator.language?.slice(0, 2);
  return isLang(nav) ? nav : DEFAULT_LANG;
}

function RedirectHome() {
  const router = useRouter();
  useEffect(() => {
    void router.navigate({ to: "/$lang", params: { lang: sniffLang() }, replace: true });
  }, [router]);
  return null;
}

export const Route = createFileRoute("/")({
  component: RedirectHome,
});
