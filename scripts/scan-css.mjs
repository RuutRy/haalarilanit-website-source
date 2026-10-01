// CSS compatibility gate: flags features the browserslist bar (package.json)
// doesn't support. Runs against the BUILT css - plain css doiuse can parse.
// Features deliberately wrapped in @supports guards are on the ignore list
// (each justified by caniuse at the browserslist bar). Known blind spot:
// doiuse does not track scroll-driven animations (animation-timeline) at
// all — the @supports guards in src/index.css are the only protection for
// those; check by hand when touching them.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import doiuse from "doiuse";
import postcss from "postcss";

const BROWSERS = [
  "chrome >= 120",
  "edge >= 120",
  "firefox >= 128",
  "safari >= 16.4",
  "ios_saf >= 16.4",
];
// Used inside @supports guards or green at the browserslist bar
// (package.json) — verified 2026-09 against caniuse:
const GATED = [
  "text-decoration", // thickness/offset/skip-ink: chrome 87+, ff 70+, safari 12.1+/15.4+
  "extended-system-fonts", // system-ui: chrome 56+, ff 128, safari 11+
  "css-text-indent", // detector noise on preflight's text-indent:0 (fancy values unused)
  "css-resize", // resize keywords: ancient support; ff green
  "css-clip-path", // basic shapes unprefixed: ff 55+, safari 9.1+
  "css-display-contents", // chrome 65+, ff 62+, safari 11.1+
  "intrinsic-width", // fit-content()/min/max-content: ff 94+ at our bar
  "css3-cursors-newer", // zoom-in/grab: chrome 37+, ff 24+, safari 9+
];

const dir = "dist/client/assets";
const files = readdirSync(dir).filter((f) => f.endsWith(".css"));
if (files.length === 0) {
  console.error("no css in dist/client/assets - run pnpm build first");
  process.exit(1);
}

const hits = [];
await Promise.all(
  files.map(async (file) => {
    const path = join(dir, file);
    await postcss([
      doiuse({
        browsers: BROWSERS,
        ignore: GATED,
        onFeatureUsage: (info) => hits.push(`${path}: ${info.message}`),
      }),
    ]).process(readFileSync(path, "utf8"), { from: path });
  }),
);

if (hits.length > 0) {
  for (const hit of hits) console.error(hit);
  console.error(`\n${hits.length} unsupported css feature(s)`);
  process.exit(1);
}
console.log("css scan clean");
