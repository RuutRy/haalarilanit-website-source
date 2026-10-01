import type { ComponentType, JSX } from "react";

// MDX hands elements arbitrary props (ids, event handlers, unknown data),
// so component values accept any props; string values remap to intrinsic
// elements. Mirrors mdx's own MDXComponents shape without the dependency.
export type MDXComponents = Record<string, ComponentType<any> | keyof JSX.IntrinsicElements>;
