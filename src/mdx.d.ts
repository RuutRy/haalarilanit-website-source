declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType<{
    components?: Record<string, React.ComponentType | keyof React.JSX.IntrinsicElements>;
  }>;
  export default MDXComponent;
}
