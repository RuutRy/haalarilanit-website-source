import type { ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
