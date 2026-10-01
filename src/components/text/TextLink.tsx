import type { ComponentProps, ReactNode } from "react";

import { Link as RouterLink } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

type To = ComponentProps<typeof RouterLink>["to"];
export type { To };

const linkCls =
  "text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type TextLinkProps = {
  // Label text, or children for rich/MDX link content.
  text?: string;
  children?: ReactNode;
  // Internal route -> router link; external URL -> anchor opening a new tab.
  to?: To;
  // Route params for dynamic paths (e.g. /$lang/guide). Loosely typed
  // since `to` is a plain string here.
  params?: Record<string, string | number | boolean>;
  href?: string;
  className?: string;
};

// A text link in the accent color. `to` for internal routes, `href` for
// external URLs; className extends for one-off styling. External links
// get the arrow so they read as off-site.
export function TextLink({ text, children, to, params, href, className }: TextLinkProps) {
  const cls = cn(linkCls, className);
  const label = text ?? children;
  if (to) {
    return (
      <RouterLink to={to} params={params as never} className={cls}>
        {label}
      </RouterLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      <ExternalLink
        aria-hidden
        className="mr-[0.15em] inline-block size-[0.85em] align-[-0.05em] opacity-80"
      />
      {label}
    </a>
  );
}
