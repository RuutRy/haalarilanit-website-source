import type { Root, RootContent } from "mdast";

import remarkParse from "remark-parse";
import { unified } from "unified";
import { expect, test } from "vitest";

import remarkArticleStructure from "./remark-article-structure";

const processor = unified().use(remarkParse).use(remarkArticleStructure);

function runMd(md: string): Root {
  const tree = processor.parse(md) as Root;
  processor.runSync(tree);
  return tree;
}

function jsx(name: string): RootContent {
  return { type: "mdxJsxFlowElement", name, attributes: [], children: [] } as never;
}

function sheetChildren(root: Root): { type: string; name?: string }[] {
  const sheet = root.children.find((c) => (c.type as string) === "sheet") as unknown as {
    children: { type: string; name?: string }[];
  };
  expect(sheet).toBeDefined();
  return sheet.children;
}

function sheetClass(root: Root): string[] {
  const sheet = root.children.find((c) => (c.type as string) === "sheet") as unknown as {
    data?: { hProperties?: { className?: string[] } };
  };
  return sheet?.data?.hProperties?.className ?? [];
}

function id(node: unknown): string | undefined {
  return (node as { data?: { hProperties?: { id?: string } } }).data?.hProperties?.id;
}

test("h2 wraps following blocks into sections; h1 and leading prose stay outside", () => {
  const root = runMd("# Title\n\nintro\n\n## One\n\ntext a\n\n## Two\n\ntext b");
  expect(sheetChildren(root).map((c) => c.name ?? c.type)).toEqual([
    "heading",
    "paragraph",
    "section",
    "section",
    "SectionNav", // injected at the sheet end
    "BackToTop", // injected last
  ]);
});

test("sections contain their own h2 and body only", () => {
  const root = runMd("## One\n\ntext a");
  const section = sheetChildren(root).find((c) => c.type === "section") as unknown as {
    children: { type: string }[];
  };
  expect(section.children.map((c) => c.type)).toEqual(["heading", "paragraph"]);
});

test("an embedded component ends a section", () => {
  const tree = processor.parse("## One\n\ntext a\n\ntext b") as Root;
  tree.children.splice(2, 0, jsx("Sponsors"));
  processor.runSync(tree);
  const section = sheetChildren(tree).find((c) => c.type === "section") as unknown as {
    children: { type: string }[];
  };
  expect(section.children.map((c) => c.type)).toEqual(["heading", "paragraph"]);
});

test("an mdx export ends a section", () => {
  const tree = processor.parse("## One\n\ntext a") as Root;
  tree.children.push({ type: "export", value: "export const x = 1" } as never);
  processor.runSync(tree);
  const section = sheetChildren(tree).find((c) => c.type === "section") as unknown as {
    children: { type: string }[];
  };
  expect(section.children.map((c) => c.type)).toEqual(["heading", "paragraph"]);
});

test("a soft block (Img/Center) stays inside its section with its prose", () => {
  for (const name of ["Img", "Center"]) {
    const tree = processor.parse("## One\n\ntext a\n\ntext b") as Root;
    tree.children.splice(2, 0, jsx(name));
    processor.runSync(tree);
    const section = sheetChildren(tree).find((c) => c.type === "section") as unknown as {
      children: { type: string }[];
    };
    expect(section.children.map((c) => c.type)).toEqual([
      "heading",
      "paragraph",
      "mdxJsxFlowElement",
      "paragraph",
    ]);
  }
});

test("prose after a soft block raises no orphan warning; prose after other components still does", () => {
  // The transform is a plain (tree, file) function - drive it directly with
  // a message-collecting file stub, no VFile needed.
  const transform = remarkArticleStructure() as unknown as (
    tree: Root,
    file: { message: (msg: string, node?: RootContent) => void },
  ) => void;
  const messagesOf = (name: string) => {
    const tree = processor.parse("## One\n\ntext a\n\ntext b") as Root;
    tree.children.splice(2, 0, jsx(name));
    const messages: string[] = [];
    transform(tree, { message: (msg) => messages.push(msg) });
    return messages;
  };
  expect(messagesOf("Img")).toHaveLength(0);
  expect(messagesOf("Center")).toHaveLength(0);
  expect(messagesOf("Sponsors")[0]).toContain("paragraph directly after a component");
});

test("h1/h2/h3 get slug ids, duplicates get a numeric suffix", () => {
  const root = runMd("# Same\n\n## Same\n\n### Same\n\nx");
  const inner = sheetChildren(root);
  expect(id(inner.find((c) => c.type === "heading"))).toBe("same"); // the h1
  const section = inner.find((c) => c.type === "section") as unknown as {
    children: unknown[];
  };
  expect(id(section.children[0])).toBe("same-1"); // the h2 inside the section
  expect(id(section.children[1])).toBe("same-2"); // the h3 stays inside the section
});

test("subpage: the sheet starts at the h1; a full sheet has no no-anchors", () => {
  const root = runMd("# Title\n\n## One\n\nx\n\n## Two\n\ny");
  expect(root.children[0].type).toBe("sheet");
  expect(sheetClass(root)).toContain("content-sheet");
  expect(sheetClass(root)).not.toContain("no-anchors");
});

test("a sheet with fewer than two sections gets no-anchors", () => {
  const root = runMd("# Title\n\n## Only\n\nx");
  expect(sheetClass(root)).toContain("no-anchors");
});

test("a page with no headings gets no sheet (bare content, no injected chrome)", () => {
  // No h1 and no ##: not a subpage, no sections - nothing to wrap.
  const tree = processor.parse("hello\n\nworld") as Root;
  processor.runSync(tree);
  expect(tree.children.some((c) => (c.type as string) === "sheet")).toBe(false);
  expect(tree.children.map((c) => c.type)).toEqual(["paragraph", "paragraph"]);
});

test("a subpage with no ## gets no sheet (bare content, per-card frost)", () => {
  // The contact page's shape: h1 + a component, no ## anywhere.
  const tree = processor.parse("# Contacts") as Root;
  tree.children.push(jsx("ContactCards"));
  processor.runSync(tree);
  expect(tree.children.some((c) => (c.type as string) === "sheet")).toBe(false);
  expect(tree.children.map((c) => (c as { type: string }).type)).toEqual([
    "heading",
    "mdxJsxFlowElement",
  ]);
});

test("front page: leading components become the hero strip; hint and nav injected", () => {
  const tree: Root = {
    type: "root",
    children: [
      jsx("Hero"),
      { type: "heading", depth: 2, children: [{ type: "text", value: "One" }] } as never,
      { type: "paragraph", children: [{ type: "text", value: "x" }] } as never,
      { type: "heading", depth: 2, children: [{ type: "text", value: "Two" }] } as never,
      { type: "paragraph", children: [{ type: "text", value: "y" }] } as never,
    ],
  };
  processor.runSync(tree);
  const strip = tree.children[0] as unknown as {
    type: string;
    children: { type: string; name?: string }[];
  };
  expect(strip.type).toBe("strip");
  expect(strip.children.at(-1)?.name).toBe("ScrollHint");
  expect(sheetChildren(tree).at(-2)?.name).toBe("SectionNav");
  expect(sheetClass(tree)).not.toContain("no-anchors");
});

// remark-mdx-frontmatter leaves the frontmatter export at the top; it renders
// nothing and must not break the subpage/hero detection or enter the sheet.
test("leading frontmatter export stays outside the sheet; subpage still detected", () => {
  const tree: Root = {
    type: "root",
    children: [
      { type: "mdxjsEsm", value: "export const frontmatter = {}" } as never,
      { type: "heading", depth: 1, children: [{ type: "text", value: "Rules" }] } as never,
      { type: "heading", depth: 2, children: [{ type: "text", value: "One" }] } as never,
      { type: "paragraph", children: [{ type: "text", value: "x" }] } as never,
    ],
  };
  processor.runSync(tree);
  expect(tree.children[0].type).toBe("mdxjsEsm");
  expect(tree.children[1].type).toBe("sheet");
  expect(sheetClass(tree)).toContain("content-sheet");
});

test("leading frontmatter export: front page strip still forms after it", () => {
  const tree: Root = {
    type: "root",
    children: [
      { type: "mdxjsEsm", value: "export const frontmatter = {}" } as never,
      jsx("Hero"),
      { type: "heading", depth: 2, children: [{ type: "text", value: "One" }] } as never,
      { type: "paragraph", children: [{ type: "text", value: "x" }] } as never,
    ],
  };
  processor.runSync(tree);
  expect(tree.children[0].type).toBe("mdxjsEsm");
  expect(tree.children[1].type).toBe("strip");
});
