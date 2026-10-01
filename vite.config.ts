import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import remarkH2Sections from "./src/plugins/remark-h2-sections.ts";
import { themeAssetsPlugin } from "./src/plugins/vite-plugin-theme-assets.ts";

// Short commit hash baked into the bundle (footer legal bar links to
// it). CI provides GITHUB_SHA; locally git is read directly.
const commitHash =
  process.env.GITHUB_SHA?.slice(0, 7) ??
  (() => {
    try {
      return execSync("git rev-parse --short HEAD").toString().trim();
    } catch {
      return "dev";
    }
  })();

export default defineConfig({
  define: {
    "import.meta.env.VITE_COMMIT_HASH": JSON.stringify(commitHash),
  },
  build: {
    // The browser-support bar - THE single source of truth (nothing reads
    // a browserslist field): everything is transpiled down to these
    // targets at build time - anything untranspilable for them fails the
    // build, so non-green syntax cannot ship. Web APIs are not
    // transpiled; keep the API surface to green ones (Biome's
    // useBaseline rule gates authored CSS against the same bar).
    target: ["chrome120", "edge120", "firefox128", "safari16.4"],
  },
  plugins: [
    // Compile .mdx before TanStack Start's router pipeline sees the modules.
    { ...mdx({ remarkPlugins: [remarkH2Sections] }), enforce: "pre" },
    tanstackStart({
      spa: { enabled: false },
      // The language toggle links into the other tree, so the crawler
      // discovers both fi and en from any page. Root "/" is the fi
      // front page (canonical -> /fi).
      prerender: { enabled: true, crawlLinks: true },
      // Prerender the not-found route to /404.html so the static host
      // can serve a real 404 page with a 404 status (see
      // public/staticwebapp.config.json responseOverrides). Link
      // crawling stays off: every link on the page (tree root, header
      // sections) is already covered by the main crawl.
      pages: [
        {
          path: "/not-found",
          prerender: {
            outputPath: "/404.html",
            autoSubfolderIndex: false,
            crawlLinks: false,
          },
        },
        // Per-tree 404 destinations for the head script's pre-paint
        // bounce (see LANG_REDIRECT_SCRIPT): unknown URLs land on the
        // Finnish /404.html via responseOverrides, and every JS visitor
        // is redirected to /fi/404 or /en/404 before anything paints.
        { path: "/fi/404" },
        { path: "/en/404" },
      ],
    }),
    react(),
    tailwindcss(),
    themeAssetsPlugin({
      cssFile: "src/index.css",
      assets: [
        { template: "src/assets/templates/favicon.svg", route: "/assets/favicon.svg" },
        { template: "src/assets/templates/background.svg", route: "/assets/background.svg" },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  environments: {
    ssr: {
      build: {
        // the SSR bundle is a build-time-only artifact the prerender crawler
        // executes, never deployed; keep it out of the static dist/
        outDir: ".tss-server",
      },
    },
  },
});
