import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import { SITE_URL } from "./src/lib/data.ts";
import remarkArticleStructure from "./src/plugins/remark-article-structure.ts";
import { rasterAssetsPlugin } from "./src/plugins/vite-raster-assets.ts";
import { themeAssetsPlugin } from "./src/plugins/vite-theme-assets.ts";

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
    // The browser-support bar: syntax transpiles down to these targets at
    // build time (untranspilable syntax fails the build); keep Web API
    // usage within them too.
    target: ["chrome120", "edge120", "firefox128", "safari16.4"],
  },
  plugins: [
    // Devtools overlay in dev; stripped from builds (removeDevtoolsOnBuild).
    devtools(),
    // Compile .mdx before TanStack Start's router pipeline sees the modules.
    // Frontmatter becomes a `frontmatter` export (per-route meta, read by
    // src/lib/content-meta.ts); structure runs after it and hoists the
    // export out of the sheet.
    {
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkArticleStructure],
      }),
      enforce: "pre",
    },
    tanstackStart({
      spa: { enabled: false },
      // The language toggle links into the other tree, so the crawler
      // discovers both fi and en from any page. Root "/" is the fi
      // front page (canonical -> /fi).
      prerender: { enabled: true, crawlLinks: true },
      // Built-in sitemap generation: after the crawl, dist/client/sitemap.xml
      // is written from the prerendered page list (plus a pages.json manifest
      // of the same list). locs derive from route paths, so they match the
      // canonical URL format.
      sitemap: { host: SITE_URL },
      // The static host's 404 override serves /fi/404 for every unknown URL
      // (see public/staticwebapp.config.json); every JS visitor whose tree
      // differs is redirected to /fi/404 or /en/404 before anything paints
      // (see LANG_REDIRECT_SCRIPT).
      // These page entries pin sitemap exclusions (prerendering itself still
      // runs for them): "/" duplicates /fi, the 404 fallbacks aren't pages.
      pages: [
        { path: "/", sitemap: { exclude: true } },
        { path: "/fi/404", sitemap: { exclude: true } },
        { path: "/en/404", sitemap: { exclude: true } },
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
    rasterAssetsPlugin({
      cssFile: "src/index.css",
      faviconTemplate: "src/assets/templates/favicon.svg",
      logotype: "public/assets/content/logotext.svg",
      background: "#09002e",
      themeColor: "#e38717",
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
