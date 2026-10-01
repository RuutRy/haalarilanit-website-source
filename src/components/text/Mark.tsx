import type { ReactNode } from "react";

// Accent-tinted inline emphasis for key facts (prices, measurements):
// the same primary color links and headings use, medium weight.
export function Mark({ children }: { children?: ReactNode }) {
  return <span className="font-medium text-primary">{children}</span>;
}
