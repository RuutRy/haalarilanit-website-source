import type { ReactNode } from "react";

// Accent-tinted inline emphasis for key facts (prices, measurements).
export function Mark({ children }: { children?: ReactNode }) {
  return <span className="font-medium text-primary">{children}</span>;
}
