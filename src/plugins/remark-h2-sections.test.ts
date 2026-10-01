import type { Root, RootContent } from "mdast";

import remarkParse from "remark-parse";
import { unified } from "unified";
import { expect, test } from "vitest";

import remarkH2Sections from "./remark-h2-sections";

const processor = unified().use(remarkParse).use(remarkH2Sections);

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
  expect(sheetChildren(root).map((c) => c.type)).toEqual([
    "mdxJsxFlowElement", // SectionNav, injected
    "heading",
    "paragraph",
    "section",
    "section",
    "mdxJsxFlowElement", // BackToTop, injected
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

test("h1/h2 get slug ids, duplicates get a numeric suffix", () => {
  const root = runMd("# Same\n\n## Same\n\nx");
  const inner = sheetChildren(root);
  expect(id(inner[1])).toBe("same"); // the h1
  const section = inner.find((c) => c.type === "section") as unknown as {
    children: unknown[];
  };
  expect(id(section.children[0])).toBe("same-1"); // the h2 inside the section
});

test("subpage: StripSpace precedes the sheet; a full sheet has no no-anchors", () => {
  const root = runMd("# Title\n\n## One\n\nx\n\n## Two\n\ny");
  expect(root.children[0].type).toBe("mdxJsxFlowElement");
  expect((root.children[0] as { name?: string }).name).toBe("StripSpace");
  expect(sheetClass(root)).toContain("content-sheet");
  expect(sheetClass(root)).not.toContain("no-anchors");
});

test("a sheet with fewer than two sections gets no-anchors", () => {
  const root = runMd("# Title\n\n## Only\n\nx");
  expect(sheetClass(root)).toContain("no-anchors");
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
  expect(sheetChildren(tree)[0]?.name).toBe("SectionNav");
  expect(sheetClass(tree)).not.toContain("no-anchors");
});
