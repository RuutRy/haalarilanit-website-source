import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SectionNav } from "@/components/section-nav";
import { stripLang } from "@/lib/lang";
import type { MDXComponents } from "@/lib/mdx";
import { MDX_BLOCKS } from "@/lib/mdx-blocks";
import { cn } from "@/lib/utils";
import { BackToTop } from "../articles/BackToTop";
import { ContactCards } from "../articles/ContactCards";
import { DiscordWidget } from "../articles/DiscordWidget";
import { Floorplan } from "../articles/Floorplan";
import { PhotoGalleries } from "../articles/PhotoGalleries";
import { SaferSpaceLink } from "../articles/SaferSpaceLink";
import { Sponsors } from "../articles/Sponsors";
import { Hero } from "../hero/Hero";
import { Img } from "../media/Img";
import { Lightbox } from "../media/Lightbox";
import { H1, H2, H3 } from "./heading";
// Direct imports, not ./index: the barrel re-exports Article, and reading
// Mark through it at module-eval time hits the cycle (undefined in dev SSR).
import { Mark } from "./Mark";
import { Paragraph } from "./Paragraph";
import type { To } from "./TextLink";
import { TextLink } from "./TextLink";
import { TextPanel } from "./TextPanel";

// Content aligns to the start; the column centers, and <Center> opts in.
export const WRAPPER = "flex w-full flex-col gap-8";
const COLUMN = "mx-auto w-full max-w-3xl";

// Internal links go through the typed router (typos warn in dev/prerender),
// external links open a new tab.
function A({ href, children }: { href?: string; children?: ReactNode }) {
  const router = useRouter();
  if (href?.startsWith("/")) {
    // Template-string key against the typed route registry needs a cast.
    const path = `/$lang${stripLang(href)}` as keyof typeof router.routesByPath;
    if (!router.routesByPath[path]) {
      console.warn(`article link "${href}" does not match a route`);
    }
    return <TextLink to={href as To}>{children}</TextLink>;
  }
  return <TextLink href={href}>{children}</TextLink>;
}

// Plain ![alt](src) image; click-to-zoom is an explicit <Lightbox> wrap.
function MdxImg({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return <img src={src} alt={alt ?? ""} loading="lazy" className="block max-w-full rounded-lg" />;
}

// Opt-in centering for mdx prose.
function Center({ children }: { children?: ReactNode }) {
  return <div className="self-center text-center">{children}</div>;
}

// remark-article-structure turns ## blocks into section panels; h1 and embedded components stay outside.
function MdxSection({ children }: { children?: ReactNode }) {
  return <TextPanel className={COLUMN}>{children}</TextPanel>;
}

function MdxP({ children }: { children?: ReactNode }) {
  return <Paragraph className={COLUMN}>{children}</Paragraph>;
}

function MdxUl({ children }: { children?: ReactNode }) {
  return <ul className={cn(COLUMN, "list-inside list-disc ps-0 text-justify")}>{children}</ul>;
}

// Dots window above a subpage sheet; -mb-8 keeps it flush against the sheet.
const StripSpace = () => <div aria-hidden className="dots-strip -mb-8 h-12" />;

// Bottom-of-hero scroll hint (the plugin places it in the hero strip); visuals in .shine-chevron.
const ScrollHint = () => (
  <div data-scroll-hint aria-hidden className="mt-auto flex shrink-0 flex-col items-center">
    <span className="shine-chevron size-[min(2.5rem,4cqh)] opacity-40" />
    <span className="shine-chevron mt-[-0.4em] size-[min(2.5rem,4cqh)] opacity-70" />
    <span className="shine-chevron mt-[-0.4em] size-[min(2.5rem,4cqh)]" />
  </div>
);

export const mdxComponents: MDXComponents = {
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

  // <Img>: authored size, stays inside its ## section; <Lightbox>: opt-in zoom.
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
