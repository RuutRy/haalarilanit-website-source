import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageContentProps = {
  children: ReactNode;
  className?: string;
};

// Vertical stack for a route's content: centered, gap-8. className extends
// (front page uses "gap-10").
export function PageContent({ children, className }: PageContentProps) {
  return <div className={cn("flex flex-col items-center gap-8", className)}>{children}</div>;
}
