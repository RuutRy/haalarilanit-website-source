import type { ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// The one tooltip look, shared by every tooltip on the site: dark
// trigger-agnostic bubble, same offset and typography as the organizer
// logos' tooltip (see LogoLink). Wrap anything.
export function Hint({
  label,
  children,
  side = "top",
}: {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        className="border-foreground/15 bg-background px-3 py-1.5 text-sm text-foreground"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
