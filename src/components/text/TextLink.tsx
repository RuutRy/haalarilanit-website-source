import type { ComponentProps } from "react";

import { Link as RouterLink } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

type To = ComponentProps<typeof RouterLink>["to"];

const linkCls =
  "text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type TextLinkProps = {
  text: string;
  // Internal route -> router link; external URL -> anchor opening a new tab.
  to?: To;
  href?: string;
  className?: string;
};

// A text link in the accent color. `to` for internal routes, `href` for
// external URLs; className extends (e.g. "bg-inline" for the standalone
// highlight style). External links get the arrow so they read as off-site.
export function TextLink({ text, to, href, className }: TextLinkProps) {
  const cls = cn(linkCls, className);
  if (to) {
    return (
      <RouterLink to={to} className={cls}>
        {text}
      </RouterLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      <ExternalLink
        aria-hidden
        className="mr-[0.15em] inline-block size-[0.85em] align-[-0.05em] opacity-80"
      />
      {text}
    </a>
  );
}
