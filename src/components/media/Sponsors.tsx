import { LogoSoup } from "@sanity-labs/logo-soup/react";
import { useEffect, useState } from "react";

import { sponsors } from "../../lib/data";
import type { SponsorBackground } from "../../lib/types.ts";
import { cn } from "../../lib/utils";
import { LogoLink } from "./LogoLink";

// Chip behind a logo per its background preference; undefined renders as-is.
const SPONSOR_CHIP: Record<SponsorBackground, string | undefined> = {
  none: undefined,
  light: "bg-foreground hover:bg-foreground",
  black: "bg-black hover:bg-black",
};

// Logo Soup's baseSize is a JS prop, so sizing lives here instead of CSS.
// Size grows from min toward max as the viewport widens.
type SizeRange = {
  /** Base size at the small end (default 56). */
  min?: number;
  /** Base size ceiling (default 96). */
  max?: number;
};

const DEFAULT_MIN = 56;
const DEFAULT_MAX = 96;

function sponsorSizeFor(width: number, min: number, max: number): number {
  const start = 400;
  const step = 2;
  const per = 60;
  const scaled = min + Math.floor((width - start) / per) * step;
  return Math.min(max, Math.max(min, scaled));
}

// Prerender-safe initial from a notional 1200px viewport; re-measured after mount.
function useSponsorBaseSize({ min = DEFAULT_MIN, max = DEFAULT_MAX }: SizeRange = {}) {
  const [size, setSize] = useState(() => sponsorSizeFor(1200, min, max));
  useEffect(() => {
    const onResize = () => {
      const next = sponsorSizeFor(window.innerWidth, min, max);
      setSize((prev) => (prev === next ? prev : next));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [min, max]);
  return size;
}

type SponsorsProps = {
  size?: SizeRange;
  className?: string;
  gap?: number;
};

export function Sponsors({ size, className, gap = 28 }: SponsorsProps) {
  const baseSize = useSponsorBaseSize(size);
  if (sponsors.length === 0) return null;

  return (
    <div className={cn("rounded-2xl p-8", className)}>
      <LogoSoup
        logos={sponsors.map((s) => ({ src: s.logo, alt: s.name }))}
        baseSize={baseSize}
        scaleFactor={1}
        gap={gap}
        alignBy="visual-center-y"
        cropToContent
        renderImage={({ src, alt, ...rest }) => {
          const sponsor = sponsors.find((s) => s.name === alt);
          if (!sponsor) {
            return <img src={src} alt={alt} {...rest} />;
          }
          const linkClassName = SPONSOR_CHIP[sponsor.background ?? "none"];
          return (
            <LogoLink
              href={sponsor.url}
              name={sponsor.name}
              src={src}
              imgProps={rest}
              imgClassName=""
              linkClassName={linkClassName}
            />
          );
        }}
      />
    </div>
  );
}
