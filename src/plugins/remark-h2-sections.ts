/// <reference types="@mdx-js/rollup" />

import type { Data, Literal, Parent, RootContent } from "mdast";

import GithubSlugger from "github-slugger";
import { findAfter } from "unist-util-find-after";
import { visit } from "unist-util-visit";

import { MDX_BLOCKS } from "../lib/mdx-blocks.ts";

// mdast doesn't know the MDX node kinds, nor the section/sheet/strip blocks
// this plugin emits, so they are declared and unioned locally. The reference
// above loads the MDX/remark-rehype type augmentations (mdast Data
// hName/hProperties) the plugin's trees actually carry.

export interface MdxJsxFlowElement extends Parent {
  type: "mdxJsxFlowElement";
  name?: string;
  attributes: unknown[];
}

export interface MdxExport extends Literal {
  type: "export";
}

export interface Section {
  type: "section";
  depth: number;
  children: MdxNode[];
  data?: Data;
}

export interface Sheet {
  type: "sheet";
  children: MdxNode[];
  data?: Data;
}

export interface Strip {
  type: "strip";
  children: MdxNode[];
  data?: Data;
}

export type MdxNode = RootContent | MdxJsxFlowElement | MdxExport | Section | Sheet | Strip;

interface MdxRoot {
  type: "root";
  children: MdxNode[];
}

// Heading text can sit at any depth (emphasis, links, ...), so extraction
// walks this loose shape instead of mdast's phrasing union.
type TextSource = {
  type?: string;
  value?: string;
  children?: TextSource[];
};

// Like remark-sectionize but only for depth-2 headings: `# Title` and any
// leading content stay outside the panels. Flow JSX (embedded components)
// also ends a section so blocks like <Sponsors /> stay standalone.
function isSectionEnd(n: MdxNode | { type: string; depth?: number }): boolean {
  return (
    (n.type === "heading" && (n.depth ?? 0) <= 2) ||
    n.type === "export" ||
    n.type === "mdxJsxFlowElement"
  );
}

function transform(tree: MdxRoot, file: { message: (msg: string, node?: RootContent) => void }) {
  // Slugs must be unique per page, so the slugger lives per file run.
  const slugger = new GithubSlugger();

  visit(tree, (node, index, parent) => {
    if (!parent?.children) return;
    // Top-level only: no nested sections inside a section.
    if (parent.type !== "root") return;
    if (node.type === "paragraph") {
      // Prose right after an embedded component renders with no panel
      // (components end sections) - flag it so authors notice.
      const prev = parent.children[index! - 1];
      if (prev?.type === "mdxJsxFlowElement") {
        file.message(
          "paragraph directly after a component renders outside a panel; move it under a ## section",
          node,
        );
      }
      return;
    }
    // Both h1 and h2 get anchor ids for copy-link / hash navigation.
    if (node.type === "heading" && (node.depth === 1 || node.depth === 2)) {
      const text = (node.children ?? []).map((c: TextSource) => c.value ?? headingText(c)).join("");
      node.data = {
        ...node.data,
        hProperties: { ...node.data?.hProperties, id: slugger.slug(text) },
      };
      // An h2 also starts a section - fall through to sectionize below.
      if (node.depth !== 2) return;
    }
    if (!(node.type === "heading" && node.depth === 2)) return;

    const end = findAfter(parent, node, isSectionEnd);
    // No section-end after the h2: the section runs to the document end.
    const endIndex = end ? parent.children.indexOf(end) : -1;

    const between = parent.children.slice(index, endIndex > 0 ? endIndex : undefined);

    const section: Section = {
      type: "section",
      depth: 2,
      children: between,
      data: { hName: "section" },
    };

    parent.children.splice(index!, between.length, section);
  });

  wrapSheet(tree);
}

function headingText(node: TextSource): string {
  return (node.children ?? []).map((c) => c.value ?? headingText(c)).join("");
}

// Flat document surface. Two layouts:
// - Article starts with `# Title` (subpages): the WHOLE article sits on the
//   sheet, with a StripSpace dots window above it.
// - Article starts with components/prose (front page): leading content is
//   the hero strip over the wallpaper (full viewport, scroll hint appended);
//   the sheet starts at the first ##.
// Pages with fewer than two ## sections get "no-anchors" (copy-link
// buttons hidden via CSS).
function wrapSheet(root: MdxRoot) {
  const kids = root.children ?? [];
  const firstSection = kids.findIndex((n) => n.type === "section");
  const sections = kids.filter((n) => n.type === "section").length;
  const subpage = kids[0]?.type === "heading" && kids[0]?.depth === 1;
  const start = subpage ? 0 : firstSection;
  if (start < 0 || start >= kids.length) return;

  const sheet: Sheet = {
    type: "sheet",
    children: [
      // SectionNav counts its sections client-side and hides itself; the
      // plugin is the single place that knows a sheet exists.
      inject(MDX_BLOCKS.sectionNav),
      ...kids.slice(start),
      // Back-to-top: CSS-fixed above the footer (see BackToTop).
      inject(MDX_BLOCKS.backToTop),
    ],
    data: {
      hName: "div",
      hProperties: {
        className: ["content-sheet", ...(sections < 2 ? ["no-anchors"] : [])],
      },
    },
  };

  root.children = subpage
    ? [inject(MDX_BLOCKS.stripSpace), sheet]
    : [
        {
          type: "strip",
          children: [
            ...kids.slice(0, start),
            // Scroll hint: the hero viewport invites the one-gesture roll
            // into the content sheet.
            inject(MDX_BLOCKS.scrollHint),
          ],
          data: { hName: "div", hProperties: { className: ["hero-strip"] } },
        },
        sheet,
      ];
}

const inject = (name: string): MdxJsxFlowElement => ({
  type: "mdxJsxFlowElement",
  name,
  attributes: [],
  children: [],
});

export default function remarkH2Sections() {
  return transform;
}
