import { LogoSoup } from "@sanity-labs/logo-soup/react";
import { useEffect, useState } from "react";

import { sponsors } from "../../lib/data";
import type { SponsorBackground } from "../../lib/types.ts";
import { LogoLink } from "./LogoLink";

// Chip behind a logo per its background preference; undefined renders as-is.
const SPONSOR_CHIP: Record<SponsorBackground, string | undefined> = {
  none: undefined,
  light: "bg-foreground hover:bg-foreground",
  black: "bg-black hover:bg-black",
};

// Logo Soup's baseSize is a JS prop, so sizing steps live here instead of CSS.
// Prerender-safe initial; re-measured after mount.
const INITIAL_SPONSOR_SIZE = sponsorSizeFor(1200);

function useSponsorBaseSize() {
  const [size, setSize] = useState(INITIAL_SPONSOR_SIZE);
  useEffect(() => {
    const onResize = () => {
      const next = sponsorSizeFor(window.innerWidth);
      setSize((prev) => (prev === next ? prev : next));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function sponsorSizeFor(width: number): number {
  const min = 56;
  const max = 96;
  const start = 400;
  const step = 2;
  const per = 60;
  const scaled = min + Math.floor((width - start) / per) * step;
  return Math.min(max, Math.max(min, scaled));
}

export function SponsorWall() {
  const baseSize = useSponsorBaseSize();
  if (sponsors.length === 0) return null;

  return (
    <div className="rounded-2xl p-8">
      <LogoSoup
        logos={sponsors.map((s) => ({ src: s.logo, alt: s.name }))}
        baseSize={baseSize}
        scaleFactor={1}
        gap={28}
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
