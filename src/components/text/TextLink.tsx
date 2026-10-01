import { Link as RouterLink } from "@tanstack/react-router";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type To = ComponentProps<typeof RouterLink>["to"];

export type { To };

const linkCls =
  "text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

// Leading icon on every text link - what separates clickables from <Mark> spans.
export const LINK_ICON_CLS = "mr-[0.15em] inline-block size-[0.85em] align-[-0.05em] opacity-80";

type TextLinkProps = {
  text?: string;
  children?: ReactNode;
  // Internal route -> router link; external URL -> anchor opening a new tab.
  to?: To;
  href?: string;
  className?: string;
};

// `to` for internal routes, `href` for external URLs (arrow + new tab).
export function TextLink({ text, children, to, href, className }: TextLinkProps) {
  const cls = cn(linkCls, className);
  const label = text ?? children;
  if (to) {
    return (
      <RouterLink to={to} className={cls}>
        <LinkIcon aria-hidden className={LINK_ICON_CLS} />
        {label}
      </RouterLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      <ExternalLink aria-hidden className={LINK_ICON_CLS} />
      {label}
    </a>
  );
}
