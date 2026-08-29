import type { ImgHTMLAttributes } from "react";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MonoImage } from "./MonoImage";

const linkClass =
  "inline-flex items-center rounded-xl p-2 transition-transform hover:-translate-y-1 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type LogoLinkProps = {
  href: string;
  name: string;
  src: string;
  linkClassName?: string;
  imgClassName?: string;
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
  // Theme-tinted mono logo (mask + background) instead of its own colors.
  tinted?: boolean;
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
  tinted,
}: LogoLinkProps) {
  const { t } = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener"
          aria-label={t("a11y.opens_new_tab", { name })}
          className={linkClassName ?? linkClass}
        >
          {tinted ? (
            <MonoImage
              src={src}
              alt={name}
              className={cn("transition-colors hover:bg-primary", imgClassName)}
            />
          ) : (
            <img
              src={src}
              alt={name}
              loading="lazy"
              decoding="async"
              {...imgProps}
              className={cn(imgProps?.className, imgClassName)}
            />
          )}
        </a>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="border-foreground/15 bg-background px-3 py-1.5 text-sm text-foreground"
      >
        {name}
      </TooltipContent>
    </Tooltip>
  );
}
