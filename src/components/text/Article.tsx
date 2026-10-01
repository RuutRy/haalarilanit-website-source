import type {
  ComponentType,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

import { useRouter } from "@tanstack/react-router";
import { Link, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { articleVars } from "@/lib/articleVars";
import { stripLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

import type { To } from "./TextLink";

import { BackToTop } from "../articles/BackToTop";
import { ContactCards } from "../articles/ContactCards";
import { Floorplan } from "../articles/Floorplan";
import { PhotoGalleries } from "../articles/PhotoGalleries";
import { SaferSpaceLink } from "../articles/SaferSpaceLink";
import { SectionNav } from "../articles/SectionNav";
import { DiscordWidget } from "../DiscordWidget";
import { Hero } from "../Hero";
import { Lightbox } from "../media/Lightbox";
import { Sponsors } from "../Sponsors";
import { Paragraph, TextLink, TextPanel } from "./index";

const articles = import.meta.glob<{
  default: ComponentType<Record<string, unknown>>;
}>("../../content/**/*.mdx", { eager: true });

// One alignment owner for every article page: centered column, chips
// centered, panels and paragraphs filling the same max-w-3xl measure.
const WRAPPER = "flex w-full flex-col items-center gap-8 text-center";
const COLUMN = "w-full max-w-3xl";

// MDX headings carry the chip look; H1 at page top, H2 inside panels.
// The slug id (from remark-h2-sections) goes on the wrapper span so the
// hash scroll target survives; the copy-link button is the affordance.
// The wrapper hugs the chip (w-fit + mx-auto: centered in the flex
// column contexts and in panels alike), so left-full puts the button
// right next to the heading text instead of at the far edge of the
// column. The button waits for hover (fine pointers only); touch has
// no hover, so there the heading itself is the affordance: holding it
// for a second copies the link (useHoldToCopy below). The chip opts out
// of selection/callout so the OS long-press menu can't hijack the hold.
const HOLD_MS = 1000;

// Hold-to-copy for touch: arm on pointerdown, fire at 1s, cancel on
// release or movement past 10px (scroll/drag intent). pointercancel is
// deliberately NOT a cancel: after the OS long-press menu is prevented
// the browser may still abort the pointer stream, and the hold should
// survive that. The flash the section jump uses is the feedback;
// `copied` also drives the hover button's icon swap.
// Clipboard writes need a secure context - on e.g. a LAN http address
// navigator.clipboard doesn't exist at all, so fall back to the
// hidden-textarea execCommand dance instead of dying before any
// feedback.
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

function useHoldToCopy(id: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const start = useRef<{ x: number; y: number; touch: boolean } | null>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const clear = () => {
    clearTimeout(timer.current);
    timer.current = 0;
    start.current = null;
  };

  const copy = () => {
    clear();
    void copyText(`${window.location.origin}${window.location.pathname}#${id}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      const heading = document.getElementById(id);
      heading?.classList.remove("section-flash");
      void heading?.offsetWidth; // restart the flash animation
      heading?.classList.add("section-flash");
      setTimeout(() => heading?.classList.remove("section-flash"), 1800);
    });
  };

  return {
    copied,
    copy,
    bind: {
      onPointerDown: (e: ReactPointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        start.current = { x: e.clientX, y: e.clientY, touch: e.pointerType !== "mouse" };
        clearTimeout(timer.current);
        timer.current = window.setTimeout(copy, HOLD_MS);
      },
      onPointerMove: (e: ReactPointerEvent) => {
        const s = start.current;
        if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 10) clear();
      },
      onPointerUp: clear,
      onPointerLeave: clear,
      onContextMenu: (e: ReactMouseEvent) => {
        // The OS long-press menu would race the hold on touch; desktop
        // right-click keeps its browser menu.
        if (start.current?.touch) e.preventDefault();
      },
    },
  };
}

function CopyLinkButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      data-copy-link
      aria-label={copied ? t("a11y.copied") : t("a11y.copy_link")}
      title={copied ? t("a11y.copied") : t("a11y.copy_link")}
      className="pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-full border bg-background p-1.5 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 md:pointer-events-auto"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onCopy}
    >
      {/* Direct swap to the check - no intermediate shrink/fade step:
          the copy icon pops out as the check pops in simultaneously. */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 700, damping: 26 }}
          className="col-start-1 row-start-1 block"
        >
          {copied ? (
            <Check className="size-3.5 text-primary" aria-hidden />
          ) : (
            <Link className="size-3.5" aria-hidden />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function AnchoredChip({
  as,
  id,
  className,
  children,
}: {
  as: "h1" | "h2";
  id?: string;
  className: string;
  children?: ReactNode;
}) {
  const hold = useHoldToCopy(id ?? "");
  const chip = createElement(as, { className }, children);
  if (!id) return chip;
  return (
    <span
      id={id}
      {...hold.bind}
      className="group relative mx-auto grid w-fit select-none [-webkit-touch-callout:none]"
    >
      {chip}
      <CopyLinkButton copied={hold.copied} onCopy={hold.copy} />
    </span>
  );
}

function H1({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <AnchoredChip as="h1" id={id} className="text-h1-fluid">
      {children}
    </AnchoredChip>
  );
}
function H2({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <AnchoredChip as="h2" id={id} className="text-h2-fluid">
      {children}
    </AnchoredChip>
  );
}
function H3({ children }: { children?: ReactNode }) {
  return createElement("h3", { className: "self-center text-h3-fluid" }, children);
}

// Article links: internal -> router path (children pass through untouched,
// link text may be formatted markdown); external -> arrow + new tab. The
// router's own generated route registry validates internal hrefs - a typo
// warns during dev and the prerender build instead of silently breaking.
function A({ href, children }: { href?: string; children?: ReactNode }) {
  const router = useRouter();
  if (href?.startsWith("/")) {
    // routesByPath is keyed by the generated route full paths; the
    // template-string key needs a cast against the typed registry.
    const path = `/$lang${stripLang(href)}` as keyof typeof router.routesByPath;
    if (!router.routesByPath[path]) {
      console.warn(`article link "${href}" does not match a route`); // oxlint-disable-line no-console -- content typo signal
    }
    return <TextLink to={href as To}>{children}</TextLink>;
  }
  return <TextLink href={href}>{children}</TextLink>;
}

// GitHub-style ![alt](src) - local /assets/ and third-party https URLs
// both work (MDX's default URL transform allows them). Every article
// image opens in the shared Lightbox (click / tap, exit top right).
function MdxImg({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return <Lightbox src={src} alt={alt ?? ""} />;
}

// Centered block: opt-in alignment for text that reads better centered
// (single-line captions under a section header). Center in mdx.
function Center({ children }: { children?: ReactNode }) {
  return <div className="self-center text-center">{children}</div>;
}

const mdxComponents: Record<string, ComponentType> = {
  h1: H1 as ComponentType,
  h2: H2 as ComponentType,
  h3: H3 as ComponentType,
  // remark-h2-sections turns every ## block into a section -> panel.
  // h1, leading content and embedded components stay outside.
  section: function MdxSection({ children }: { children?: ReactNode }) {
    return <TextPanel className={COLUMN}>{children}</TextPanel>;
  },
  p: function MdxP({ children }: { children?: ReactNode }) {
    return <Paragraph className={COLUMN}>{children}</Paragraph>;
  },
  // List takes string items, MDX passes element children - a plain ul
  // with the shared list classes.
  ul: function MdxUl({ children }: { children?: ReactNode }) {
    return <ul className={cn(COLUMN, "list-inside list-disc ps-0 text-justify")}>{children}</ul>;
  },
  li: "li" as never,
  a: A as ComponentType,
  img: MdxImg as ComponentType,
  Center,

  // Front-page Discord server widget (live channels + online count).
  DiscordWidget,

  // Full-page building blocks embedded from the mdx files.
  Hero: Hero as ComponentType,
  Sponsors: Sponsors as ComponentType,
  Floorplan,
  PhotoGalleries,
  SaferSpaceLink,
  ContactCards,
  SectionNav,
  BackToTop,
  // Dots window above a subpage sheet: a slim 48px wallpaper window
  // between the header and the sheet. -mb-8 cancels the wrapper's gap-8
  // below it so the strip sits flush against the sheet.
  StripSpace: function StripSpace() {
    return <div aria-hidden className="dots-strip -mb-8 h-12" />;
  } as ComponentType,
  // Bottom-of-hero scroll hint (plugin places it in the hero strip).
  ScrollHint: function ScrollHint() {
    return <ChevronDown aria-hidden className="size-6 animate-bounce text-primary/70" />;
  } as ComponentType,
};

// An article is the full page: title, prose and embedded components.
// The hero strip is a static full viewport; scrolling down simply lands
// on the flat content sheet.
export function Article({ name, lang }: { name: string; lang: string }) {
  const path = `../../content/${lang}/${name}.mdx`;
  const mod = articles[path];

  if (!mod) {
    // Missing language file falls back to the default tree - make the
    // gap visible instead of silently rendering Finnish on /en pages.
    if (lang !== "fi") console.warn(`article "${name}" missing for lang "${lang}", using fi`); // oxlint-disable-line no-console -- build/regression signal, not app logging
    const fallback = articles[`../../content/fi/${name}.mdx`];
    if (!fallback) return null;
    return (
      <div className={WRAPPER}>
        <fallback.default components={mdxComponents} {...articleVars(lang as never)} />
      </div>
    );
  }

  return (
    <div className={WRAPPER}>
      <mod.default components={mdxComponents} {...articleVars(lang as never)} />
    </div>
  );
}
