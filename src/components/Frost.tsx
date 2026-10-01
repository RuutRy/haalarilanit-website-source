import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

const STRENGTHS = { sm: 8, md: 12, lg: 16 } as const;

type FrostProps = {
  children?: ReactNode;
  className?: string;
  /** Backdrop blur strength in px. */
  strength?: keyof typeof STRENGTHS;
};

// Frosted panel (the .frost recipe in index.css): the tint + blur live on a
// masked ::before, so content stays crisp while the frost ramps up gradually
// from the edges. Strength rides the --frost-blur custom property.
export function Frost({ children, className, strength = "lg" }: FrostProps) {
  return (
    <div
      className={cn("frost rounded-3xl", className)}
      style={{ "--frost-blur": `${STRENGTHS[strength]}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
