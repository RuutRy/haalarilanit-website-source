// vite-plugin-favicon.ts
//
// Generates /assets/favicon.svg from the :root tokens in src/index.css, so
// the icon rethemes from the same source of truth as the site. Dev: a
// middleware serves it. Build: emitted as a real file.

import type { Plugin } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROUTE = "/assets/favicon.svg";
const CSS_FILE = "src/index.css";
const CORNER_RADIUS = 56;

const TOKENS = {
  logoFill: "foreground", // the logo itself, and its outer glow color
  fill: "theme-bg",     // solid base color sitting behind the gradient
  gradStart: "theme-dot",   // gradient overlay, top-left stop
  gradEnd: "theme-bg", // gradient overlay, bottom-right stop
} as const;

const GRADIENT_OVERLAY_OPACITY = 0.43;

const GLOW_OPACITY = 0.6;
const GLOW_BLUR_STD_DEV = 32;

// Resolves one level of var()
function token(css: string, name: string): string {
  const raw = css.match(new RegExp(`--${name}:\\s*([^;]+)`))?.[1].trim();
  if (!raw) throw new Error(`favicon plugin: --${name} not found in ${CSS_FILE}`);
  const ref = raw.match(/^var\(--([\w-]+)\)$/);
  return ref ? token(css, ref[1]) : raw;
}

function faviconSvg(css: string): string {
  const logoFill = token(css, TOKENS.logoFill);
  const fill = token(css, TOKENS.fill);
  const gradStart = token(css, TOKENS.gradStart);
  const gradEnd = token(css, TOKENS.gradEnd);

  return `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradStart}"/>
      <stop offset="100%" stop-color="${gradEnd}"/>
    </linearGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${GLOW_BLUR_STD_DEV}" result="blur"/>
      <feFlood flood-color="${logoFill}" flood-opacity="${GLOW_OPACITY}" result="glowColor"/>
      <feComposite in="glowColor" in2="blur" operator="in" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Rectangle: solid base fill -->
  <rect x="0" y="0" width="512" height="512" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="${fill}"/>

  <!-- Gradient Fill: clipped to the same shape, Normal blend-->
  <rect x="0" y="0" width="512" height="512" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="url(#bgGrad)" opacity="${GRADIENT_OVERLAY_OPACITY}"/>

  <!-- Logo itself -->
  <g transform="translate(107,20)" filter="url(#glow)">
    <g transform="translate(-1,472) scale(0.1,-0.1)" fill="${logoFill}" stroke="none">
<path d="M1147 4702 c-10 -10 -17 -23 -17 -28 0 -4 28 -37 62 -71 54 -55 61
-66 50 -81 -28 -39 -25 -44 76 -145 l100 -102 -16 -33 c-16 -32 -16 -35 3 -48
18 -13 25 -9 87 53 37 37 68 72 68 78 0 10 -381 395 -391 395 -3 0 -13 -8 -22
-18z"/>
<path d="M1080 4634 c-11 -13 -5 -23 41 -70 54 -55 85 -67 96 -38 4 10 -12 34
-48 70 -57 58 -69 63 -89 38z"/>
<path d="M1020 4574 c-11 -13 -5 -23 41 -70 54 -55 85 -67 96 -38 4 10 -12 34
-48 70 -57 58 -69 63 -89 38z"/>
<path d="M960 4514 c-11 -13 -5 -24 45 -74 48 -49 62 -57 77 -49 28 15 22 31
-35 87 -57 56 -68 60 -87 36z"/>
<path d="M900 4454 c-11 -13 -5 -24 45 -74 48 -49 62 -57 77 -49 28 15 22 31
-35 87 -57 56 -68 60 -87 36z"/>
<path d="M1107 4382 c-42 -42 -77 -82 -77 -87 0 -6 40 -50 89 -99 l89 -88 36
13 36 13 83 -82 c80 -79 83 -82 105 -67 12 9 27 25 33 37 10 18 2 30 -72 104
l-83 84 18 31 18 31 -93 94 c-52 52 -96 94 -99 94 -3 0 -40 -35 -83 -78z"/>
<path d="M842 4398 c-20 -20 -14 -33 43 -87 47 -45 58 -50 75 -41 11 6 20 15
20 21 0 14 -101 119 -114 119 -7 0 -17 -5 -24 -12z"/>
<path d="M780 4335 l-24 -25 194 -195 c107 -107 199 -195 205 -195 6 0 42 31
80 70 67 68 68 70 51 89 -18 20 -20 20 -47 4 l-29 -17 -105 104 -105 103 -25
-23 -25 -23 -69 66 c-38 37 -71 67 -73 67 -3 0 -15 -11 -28 -25z"/>
<path d="M1537 4252 c-45 -45 -77 -86 -77 -98 0 -11 20 -40 45 -64 25 -24 45
-49 45 -56 0 -11 -94 -104 -105 -104 -3 0 -30 23 -60 51 -44 41 -57 49 -72 41
-24 -14 -163 -157 -163 -170 0 -22 44 -62 123 -110 46 -29 88 -52 92 -52 5 0
41 32 82 71 40 39 78 69 85 67 31 -11 18 -43 -43 -104 -53 -54 -62 -67 -53
-82 21 -33 47 -25 109 38 61 62 81 72 92 44 4 -10 -13 -35 -51 -73 -59 -60
-65 -84 -24 -97 15 -5 32 6 72 45 28 28 59 51 69 51 29 0 19 -34 -23 -75 -45
-43 -50 -69 -19 -85 18 -10 27 -5 69 34 52 49 67 55 76 31 4 -9 -8 -31 -30
-55 -41 -45 -42 -52 -20 -74 21 -22 28 -20 69 15 30 27 35 28 35 12 0 -29
-350 -373 -380 -373 -18 0 -105 81 -355 329 -243 243 -342 335 -375 350 -39
18 -66 21 -201 21 -147 0 -158 -1 -207 -26 -65 -32 -118 -93 -137 -158 -18
-61 -195 -1529 -195 -1620 0 -114 77 -219 184 -251 31 -9 92 -15 161 -15 78 0
117 -4 130 -14 16 -11 31 -113 116 -758 104 -800 102 -790 170 -857 69 -69 95
-76 289 -76 201 0 222 6 297 88 75 81 73 59 73 867 0 682 1 718 18 733 24 22
55 22 75 -1 12 -13 39 -196 111 -751 102 -774 105 -792 164 -854 15 -16 47
-41 72 -55 43 -26 53 -27 202 -30 192 -4 234 6 307 77 85 83 81 43 81 868 0
710 0 723 20 743 18 18 33 20 133 20 136 0 197 16 254 65 23 20 54 61 70 93
l28 57 0 708 c0 817 12 737 -108 737 -119 0 -107 82 -107 -714 0 -647 -1 -694
-17 -708 -14 -12 -50 -17 -148 -20 -86 -3 -142 -10 -166 -21 -55 -23 -119 -86
-145 -142 l-24 -50 0 -726 c0 -857 14 -772 -130 -778 -116 -4 -158 4 -171 32
-5 12 -52 350 -104 752 -85 652 -98 736 -121 782 -99 203 -391 193 -488 -16
-21 -45 -21 -58 -26 -786 l-5 -739 -25 -14 c-37 -19 -234 -13 -255 9 -13 13
-38 180 -111 745 -53 411 -102 748 -111 773 -21 58 -82 124 -141 152 -38 18
-69 23 -167 26 -144 5 -161 8 -169 29 -5 14 165 1490 179 1561 10 46 29 53
143 53 l106 0 331 -328 c365 -363 380 -374 488 -374 112 0 139 18 370 250 196
198 206 210 222 267 22 72 11 142 -29 202 l-26 37 30 31 c32 33 37 54 18 73
-19 19 -35 14 -78 -24 -68 -62 -85 -16 -19 52 31 31 39 47 35 62 -12 37 -35
34 -86 -14 -31 -29 -55 -44 -65 -40 -26 9 -17 30 35 81 53 52 60 79 28 99 -15
9 -27 2 -71 -42 -29 -28 -60 -52 -69 -52 -37 0 -28 25 32 85 54 54 62 67 56
89 -10 40 -33 32 -103 -35 -63 -61 -86 -69 -91 -33 -2 12 20 41 63 84 36 35
65 71 65 78 0 21 -100 181 -124 198 -11 8 -27 14 -36 14 -8 0 -50 -35 -93 -78z"/>
    </g>
  </g>
</svg>`;
}

export function faviconPlugin(): Plugin {
  let svg = "";

  return {
    name: "favicon-route",

    configResolved(config) {
      svg = faviconSvg(readFileSync(resolve(config.root, CSS_FILE), "utf8"));
    },

    configureServer(server) {
      server.middlewares.use(ROUTE, (_req, res) => {
        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", "no-cache");
        res.end(svg);
      });
    },

    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: ROUTE.slice(1), // assets/favicon.svg
        source: svg,
      });
    },
  };
}
