/// <reference types="@mdx-js/rollup" />

import GithubSlugger from "github-slugger";
import type { Data, Literal, Parent, RootContent } from "mdast";
import { findAfter } from "unist-util-find-after";
import { visit } from "unist-util-visit";

import { MDX_BLOCKS, MDX_SOFT_BLOCKS } from "../lib/mdx-blocks.ts";

// Local types: mdast doesn't know the MDX node kinds or the blocks this
// plugin emits; the reference above loads the mdast Data augmentations.

interface MdxJsxFlowElement extends Parent {
  type: "mdxJsxFlowElement";
  name?: string;
  attributes: unknown[];
}

interface MdxExport extends Literal {
  type: "export";
}

interface Section {
  type: "section";
  depth: number;
  children: MdxNode[];
  data?: Data;
}

interface Sheet {
  type: "sheet";
  children: MdxNode[];
  data?: Data;
}

interface Strip {
  type: "strip";
  children: MdxNode[];
  data?: Data;
}

type MdxNode = RootContent | MdxJsxFlowElement | MdxExport | Section | Sheet | Strip;

interface MdxRoot {
  type: "root";
  children: MdxNode[];
}

// Heading text can sit at any depth (emphasis, links), so walk a loose shape.
type TextSource = {
  type?: string;
  value?: string;
  children?: TextSource[];
};

// Soft blocks don't end a section; prose after them is normal body.
function isSoftBlock(n: MdxNode): n is MdxJsxFlowElement {
  return n.type === "mdxJsxFlowElement" && !!n.name && MDX_SOFT_BLOCKS.has(n.name);
}

// Only h2 sectionizes; `# Title`, leading content and embedded components stay outside panels.
function isSectionEnd(n: MdxNode | { type: string; depth?: number }): boolean {
  if (isSoftBlock(n as MdxNode)) return false;
  return (
    (n.type === "heading" && (n.depth ?? 0) <= 2) ||
    n.type === "export" ||
    n.type === "mdxJsxFlowElement"
  );
}

function transform(tree: MdxRoot, file: { message: (msg: string, node?: RootContent) => void }) {
  // Slugs must be unique per page, so the slugger lives per file run.
  const slugger = new GithubSlugger();

  // Anchor ids on h1-h3, in their own pass: sectionize's spliced sections
  // are never revisited by the walk below.
  visit(tree, "heading", (node) => {
    if (node.depth < 1 || node.depth > 3) return;
    const text = (node.children ?? []).map((c: TextSource) => c.value ?? headingText(c)).join("");
    node.data = {
      ...node.data,
      hProperties: { ...node.data?.hProperties, id: slugger.slug(text) },
    };
  });

  visit(tree, (node, index, parent) => {
    if (!parent?.children) return;
    if (typeof index !== "number") return;
    // Top-level only: no nested sections inside a section.
    if (parent.type !== "root") return;
    if (node.type === "paragraph") {
      // Prose right after a component renders with no panel - flag it.
      const prev = parent.children[index - 1];
      if (prev?.type === "mdxJsxFlowElement" && !isSoftBlock(prev)) {
        file.message(
          "paragraph directly after a component renders outside a panel; move it under a ## section",
          node,
        );
      }
      return;
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

    parent.children.splice(index, between.length, section);
  });

  wrapSheet(tree);
}

function headingText(node: TextSource): string {
  return (node.children ?? []).map((c) => c.value ?? headingText(c)).join("");
}

// Wrap the flat children into a sheet. Subpages (leading `# Title`) get the
// whole article plus a dots window; the front page puts the leading content
// in the hero strip and the sheet starts at the first ##.
function wrapSheet(root: MdxRoot) {
  const kids = root.children ?? [];
  // remark-mdx-frontmatter leaves a frontmatter export at the top; it renders
  // nothing and must stay outside the sheet, so content starts after it.
  const leadCount = kids[0]?.type === "mdxjsEsm" || kids[0]?.type === "yaml" ? 1 : 0;
  const lead = leadCount ? kids.slice(0, leadCount) : [];
  const content = kids.slice(leadCount);
  const firstSection = content.findIndex((n) => n.type === "section");
  const sections = content.filter((n) => n.type === "section").length;
  const subpage = content[0]?.type === "heading" && content[0]?.depth === 1;
  // A subpage without ## sections stays bare: no sheet, no chrome - its cards
  // carry their own frost, and the heading gets a frost pill of its own.
  if (subpage && sections === 0) {
    const head = content[0];
    head.data = {
      ...head.data,
      hProperties: { ...head.data?.hProperties, className: ["frost", "bare-heading"] },
    };
    // children stay as-is (any frontmatter lead included).
    return;
  }
  const start = subpage ? 0 : firstSection;
  if (start < 0 || start >= content.length) return;

  const sheet: Sheet = {
    type: "sheet",
    children: [
      ...content.slice(start),
      // Injected at the sheet's end so the sticky handle docks with BackToTop.
      inject(MDX_BLOCKS.sectionNav),
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
    ? [...lead, sheet]
    : [
        ...lead,
        {
          type: "strip",
          children: [...content.slice(0, start), inject(MDX_BLOCKS.scrollHint)],
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

export default function remarkArticleStructure() {
  return transform;
}
