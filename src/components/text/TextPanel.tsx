import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Groups a block of mdx content on one flat surface (frost is opt-in per element).
export function TextPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2 text-justify", className)}>{children}</div>;
}
