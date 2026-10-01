import { LogoSoup } from "@sanity-labs/logo-soup/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { sponsors } from "../lib/data";
import { LogoLink } from "./media/LogoLink";

// Logos step 56–96px by 2; each step re-runs Logo Soup's canvas normalization.
// baseSize is a JS prop driving Logo Soup's canvas, so CSS clamp can't own it.
// Prerender-safe initial size; the real size is measured after mount.
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
  const start = 400; // viewport width where scaling begins
  const step = 2;
  const per = 60; // px of viewport per step
  const scaled = min + Math.floor((width - start) / per) * step;
  return Math.min(max, Math.max(min, scaled));
}

// Sponsor logo wall via Logo Soup; empty array = nothing renders.
export function Sponsors() {
  const { t } = useTranslation();
  const baseSize = useSponsorBaseSize();
  if (sponsors.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-h1-fluid">{t("sponsors")}</h1>
      {/* One shared panel behind the whole wall. */}
      <div className="rounded-2xl p-8">
        <LogoSoup
          logos={sponsors.map((s) => ({ src: s.logo, alt: s.name }))}
          baseSize={baseSize}
          gap={28}
          alignBy="visual-center-y"
          renderImage={({ src, alt, ...rest }) => {
            const sponsor = sponsors.find((s) => s.logo === src);
            if (!sponsor) {
              return <img src={src} alt={alt} {...rest} />;
            }
            // No filters - sponsor logos render exactly as provided.
            // The hover feedback lives on the link itself.
            return (
              <LogoLink
                href={sponsor.url}
                name={sponsor.name}
                src={src}
                imgProps={rest}
                imgClassName=""
                linkClassName="inline-flex items-center rounded-xl p-2 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            );
          }}
        />
      </div>
    </div>
  );
}
