import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ParagraphProps = {
  text?: string;
  children?: ReactNode;
  className?: string;
};

// Body paragraph on a panel, justified. className for one-offs
// ("w-fit text-center"); children for rich content and overrides text.
export function Paragraph({ text, children, className }: ParagraphProps) {
  return <p className={cn("bg-panel text-justify", className)}>{children ?? text}</p>;
}
