import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ParagraphProps = {
  text?: string;
  children?: ReactNode;
  className?: string;
};

// Body paragraph, justified. className for one-offs, children for rich
// content and overrides text.
export function Paragraph({ text, children, className }: ParagraphProps) {
  return <p className={cn("text-justify", className)}>{children ?? text}</p>;
}
