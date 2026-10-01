import { useRouter } from "@tanstack/react-router";
import { Check, Link } from "lucide-react";
import type {
  ComponentType,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from "react";
import { createElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionNav } from "@/components/section-nav";
import { copyText } from "@/lib/clipboard";
import { flashHeading } from "@/lib/heading-flash";
import { DEFAULT_LANG, isLang, stripLang } from "@/lib/lang";
import type { MDXComponents } from "@/lib/mdx";
import { MDX_BLOCKS } from "@/lib/mdx-blocks";
import { cn } from "@/lib/utils";
import { BackToTop } from "../articles/BackToTop";
import { ContactCards } from "../articles/ContactCards";
import { Floorplan } from "../articles/Floorplan";
import { PhotoGalleries } from "../articles/PhotoGalleries";
import { SaferSpaceLink } from "../articles/SaferSpaceLink";
import { DiscordWidget } from "../DiscordWidget";
import { Hero } from "../Hero";
import { Img } from "../media/Img";
import { Lightbox } from "../media/Lightbox";
import { Sponsors } from "../Sponsors";
// Direct imports, NOT the ./index barrel: index re-exports Article, and the
// cycle made Mark undefined in dev SSR (it is read at module-eval time
// when mdxComponents is built; render-time reads survived the cycle).
import { Mark } from "./Mark";
import { Paragraph } from "./Paragraph";
import type { To } from "./TextLink";
import { TextLink } from "./TextLink";
import { TextPanel } from "./TextPanel";

const articles = import.meta.glob<{
  default: ComponentType<{ components?: MDXComponents }>;
}>("../../content/**/*.mdx", { eager: true });

// One alignment owner for every article page: centered column, chips
// centered, panels and paragraphs filling the same max-w-3xl measure.
const WRAPPER = "flex w-full flex-col items-center gap-8 text-center";
const COLUMN = "w-full max-w-3xl";

// Touch affordance: holding a heading for HOLD_MS copies its link; fine pointers get the hover button. Pointer quirks live in useHoldToCopy.
const HOLD_MS = 1000;

// Hold-to-copy for touch: arm on pointerdown, fire at 1s, cancel on
// release or movement past 10px (scroll/drag intent). pointercancel is
// deliberately NOT a cancel: after the OS long-press menu is prevented
// the browser may still abort the pointer stream, and the hold should
// survive that. The flash the section jump uses is the feedback;
// `copied` also drives the hover button's icon swap.
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
    void copyText(`${window.location.origin}${window.location.pathname}#${id}`).then((ok) => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      flashHeading(id);
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
      <span className="relative block size-3.5" aria-hidden>
        <Link
          className={cn(
            "absolute inset-0 size-full transition-all duration-150",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Check
          className={cn(
            "absolute inset-0 text-primary size-full transition-all duration-150",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>
    </button>
  );
}

function AnchoredChip({
  as,
  id,
  className,
  children,
}: {
  as: "h1" | "h2" | "h3";
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
function H3({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <AnchoredChip as="h3" id={id} className="text-h3-fluid">
      {children}
    </AnchoredChip>
  );
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
      console.warn(`article link "${href}" does not match a route`);
    }
    return <TextLink to={href as To}>{children}</TextLink>;
  }
  return <TextLink href={href}>{children}</TextLink>;
}

// GitHub-style ![alt](src) renders as a plain image (local /assets/ and
// third-party https URLs both work - MDX's default URL transform allows
// them). Click-to-zoom is opt-in: wrap content in <Lightbox> in the mdx.
function MdxImg({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return <img src={src} alt={alt ?? ""} loading="lazy" className="block max-w-full rounded-lg" />;
}

// Opt-in centering for mdx prose.
function Center({ children }: { children?: ReactNode }) {
  return <div className="self-center text-center">{children}</div>;
}

// remark-h2-sections turns every ## block into a section -> panel.
// h1, leading content and embedded components stay outside.
function MdxSection({ children }: { children?: ReactNode }) {
  return <TextPanel className={COLUMN}>{children}</TextPanel>;
}

function MdxP({ children }: { children?: ReactNode }) {
  return <Paragraph className={COLUMN}>{children}</Paragraph>;
}

function MdxUl({ children }: { children?: ReactNode }) {
  return <ul className={cn(COLUMN, "list-inside list-disc ps-0 text-justify")}>{children}</ul>;
}

// Dots window above a subpage sheet: a slim 48px wallpaper window
// between the header and the sheet. -mb-8 cancels the wrapper's gap-8
// below it so the strip sits flush against the sheet.
const StripSpace = () => <div aria-hidden className="dots-strip -mb-8 h-12" />;

// Bottom-of-hero scroll hint (plugin places it in the hero strip). No
// disc: three bare chevrons, each a masked span with a moving primary->light
// gradient sweep (.shine-chevron) plus a bloom glow, cascading in opacity -
// the solid bottom one is the pull. All three animate in unison. mt-auto
// pins the stack above the strip's bottom padding (pairs with the Hero
// wrapper's mt-auto). Sizes cap against cqh like the rest of the hero.
const ScrollHint = () => (
  <div data-scroll-hint aria-hidden className="mt-auto flex shrink-0 flex-col items-center">
    <span className="shine-chevron size-[min(2.5rem,4cqh)] opacity-40" />
    <span className="shine-chevron -mt-[0.4em] size-[min(2.5rem,4cqh)] opacity-70" />
    <span className="shine-chevron -mt-[0.4em] size-[min(2.5rem,4cqh)]" />
  </div>
);

const mdxComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  section: MdxSection,
  p: MdxP,
  ul: MdxUl,
  li: "li",
  a: A,
  img: MdxImg,
  Center,
  Mark,

  DiscordWidget,

  // Media: <Img> gets an explicitly authored size (see MDX_SOFT_BLOCKS - it
  // stays inside its ## section); <Lightbox> is the explicit click-to-zoom
  // opt-in wrapper.
  Img,
  Lightbox,

  // Full-page building blocks embedded from the mdx files.
  Hero,
  Sponsors,
  Floorplan,
  PhotoGalleries,
  SaferSpaceLink,
  ContactCards,
  [MDX_BLOCKS.sectionNav]: SectionNav,
  [MDX_BLOCKS.backToTop]: BackToTop,
  [MDX_BLOCKS.stripSpace]: StripSpace,
  [MDX_BLOCKS.scrollHint]: ScrollHint,
};

export function Article({ name, lang }: { name: string; lang: string }) {
  const active = isLang(lang) ? lang : DEFAULT_LANG;
  const path = `../../content/${active}/${name}.mdx`;
  const mod = articles[path];

  if (!mod) {
    // Missing language file: fall back to the default tree; console.warn surfaces the gap in dev and prerender builds.
    if (active !== "fi") console.warn(`article "${name}" missing for lang "${active}", using fi`);
    const fallback = articles[`../../content/fi/${name}.mdx`];
    if (!fallback) return null;
    return (
      <div className={WRAPPER}>
        <fallback.default components={mdxComponents} />
      </div>
    );
  }

  return (
    <div className={WRAPPER}>
      <mod.default components={mdxComponents} />
    </div>
  );
}
