declare module "*.mdx" {
  import type { ComponentType } from "react";

  import type { MDXComponents } from "@/lib/mdx";

  const MDXComponent: ComponentType<{ components?: MDXComponents }>;
  export default MDXComponent;
}
