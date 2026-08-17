import type { ImgHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const linkClass =
  "inline-flex items-center rounded-xl p-2 transition-transform hover:-translate-y-1 hover:bg-milk/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const imgClass =
  "transition-[filter] duration-200 [filter:var(--white-filter)] hover:[filter:var(--accent-filter)]";

type LogoLinkProps = {
  href: string;
  name: string;
  src: string;
  linkClassName?: string;
  imgClassName?: string;
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
};

// Shared clickable logo with the name tooltip - used identically in the
// footer and on the sponsor wall, so both behave exactly the same.
export function LogoLink({
  href,
  name,
  src,
  linkClassName,
  imgClassName,
  imgProps,
}: LogoLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener"
          aria-label={`${name} - avautuu uuteen välilehteen`}
          className={linkClassName ?? linkClass}
        >
          <img
            src={src}
            alt={name}
            loading="lazy"
            decoding="async"
            {...imgProps}
            className={cn(imgProps?.className, imgClassName ?? imgClass)}
          />
        </a>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="border-milk/15 bg-ink px-3 py-1.5 text-sm text-milk"
      >
        {name}
      </TooltipContent>
    </Tooltip>
  );
}
