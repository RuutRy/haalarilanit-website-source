import type { ComponentType, JSX } from "react";

// MDX hands elements arbitrary props (ids, event handlers, unknown data), so
// values accept any props. Mirrors mdx's own MDXComponents shape.
export type MDXComponents = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: MDX passes unknown extra props to every mapped component
  ComponentType<any> | keyof JSX.IntrinsicElements
>;
