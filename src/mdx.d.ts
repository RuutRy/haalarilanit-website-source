declare module "*.mdx" {
  import type { ComponentType } from "react";

  import type { MDXComponents } from "@/lib/mdx";

  const MDXComponent: ComponentType<{ components?: MDXComponents }>;
  export default MDXComponent;
  /** Per-article meta (yaml frontmatter), consumed by src/lib/content-meta.ts. */
  export const frontmatter: { title?: string; description?: string };
}
