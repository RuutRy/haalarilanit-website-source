import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

// Content column: w-full max-w-3xl, gap-2. twMerge lets className override
// pieces ("gap-4", "max-w-none items-center").
export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("flex w-full max-w-3xl flex-col gap-2", className)}>{children}</section>
  );
}
