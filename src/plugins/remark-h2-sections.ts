import GithubSlugger from "github-slugger";
import { findAfter } from "unist-util-find-after";
import { visit } from "unist-util-visit";

type Node = {
  type: string;
  name?: string;
  attributes?: unknown[];
  depth?: number;
  value?: string;
  children?: Node[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};

// Like remark-sectionize but only for depth-2 headings: `# Title` and any
// leading content stay outside the panels. Flow JSX (embedded components)
// also ends a section so blocks like <Sponsors /> stay standalone.
function isSectionEnd(n: Node) {
  return (
    (n.type === "heading" && (n.depth ?? 0) <= 2) ||
    n.type === "export" ||
    n.type === "mdxJsxFlowElement"
  );
}

function transform(tree: Node, file: { message: (msg: string, node?: Node) => void }) {
  // Slugs must be unique per page, so the slugger lives per file run.
  const slugger = new GithubSlugger();

  // Visit's generic overloads fight the loose local Node type; cast the args.
  visit(
    tree as never,
    ((node: Node, index: number, parent: Node) => {
      if (!parent?.children) return;
      // Top-level only: no nested sections inside a section.
      if (parent.type !== "root") return;
      if (node.type === "paragraph") {
        // Prose right after an embedded component renders with no panel
        // (components end sections) - flag it so authors notice.
        const prev = parent.children[index - 1];
        if (prev?.type === "mdxJsxFlowElement") {
          file.message(
            "paragraph directly after a component renders outside a panel; move it under a ## section",
            node as never,
          );
        }
        return;
      }
      // Both h1 and h2 get anchor ids for copy-link / hash navigation.
      if (node.type === "heading" && (node.depth === 1 || node.depth === 2)) {
        const text = (node.children ?? []).map((c) => c.value ?? headingText(c)).join("");
        node.data = {
          ...node.data,
          hProperties: { ...node.data?.hProperties, id: slugger.slug(text) },
        };
        // An h2 also starts a section - fall through to sectionize below.
        if (node.depth !== 2) return;
      }
      if (!(node.type === "heading" && node.depth === 2)) return;

      const end = findAfter(parent as never, node as never, isSectionEnd) as unknown as Node;
      const endIndex = parent.children.indexOf(end);

      const between = parent.children.slice(index, endIndex > 0 ? endIndex : undefined);

      const section: Node = {
        type: "section",
        depth: 2,
        children: between,
        data: { hName: "section" },
      };

      parent.children.splice(index, between.length, section);
    }) as never,
  );

  wrapSheet(tree);
}

function headingText(node: Node): string {
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
function wrapSheet(root: Node) {
  const kids = root.children ?? [];
  const firstSection = kids.findIndex((n) => n.type === "section");
  const sections = kids.filter((n) => n.type === "section").length;
  const subpage = kids[0]?.type === "heading" && kids[0]?.depth === 1;
  const start = subpage ? 0 : firstSection;
  if (start < 0 || start >= kids.length) return;

  const sheet: Node = {
    type: "sheet",
    children: [
      // SectionNav counts its sections client-side and hides itself; the
      // plugin is the single place that knows a sheet exists.
      { type: "mdxJsxFlowElement", name: "SectionNav", attributes: [], children: [] },
      ...kids.slice(start),
      // Back-to-top: CSS-fixed above the footer (see BackToTop).
      { type: "mdxJsxFlowElement", name: "BackToTop", attributes: [], children: [] },
    ],
    data: {
      hName: "div",
      hProperties: {
        className: ["content-sheet", ...(sections < 2 ? ["no-anchors"] : [])],
      },
    },
  };

  root.children = subpage
    ? [{ type: "mdxJsxFlowElement", name: "StripSpace", attributes: [], children: [] }, sheet]
    : [
        {
          type: "strip",
          children: [
            ...kids.slice(0, start),
            // Scroll hint: the hero viewport invites the one-gesture roll
            // into the content sheet.
            { type: "mdxJsxFlowElement", name: "ScrollHint", attributes: [], children: [] },
          ],
          data: { hName: "div", hProperties: { className: ["hero-strip"] } },
        },
        sheet,
      ];
}

export default function remarkH2Sections() {
  return transform;
}
