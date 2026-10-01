import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Frost amounts, per instance.
const BLUR = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
} as const;

// Frosted backdrop wrapper: translucent tint + backdrop blur, so the
// parallax wallpaper glows through softly. Opt-in per element (hero
// content) — text content, mono images etc. never apply it directly.
// `blur` picks the frost strength (default sm).
export function Blur({
  children,
  className,
  blur = "sm",
}: {
  children: ReactNode;
  className?: string;
  blur?: keyof typeof BLUR;
}) {
  return (
    <div className={cn("rounded-2xl bg-[var(--panel-tint)]", BLUR[blur], className)}>
      {children}
    </div>
  );
}
