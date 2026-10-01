import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import remarkArticleStructure from "./src/plugins/remark-article-structure.ts";
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
    // Compile .mdx before TanStack Start's router pipeline sees the modules.
    { ...mdx({ remarkPlugins: [remarkArticleStructure] }), enforce: "pre" },
    tanstackStart({
      spa: { enabled: false },
      // The language toggle links into the other tree, so the crawler
      // discovers both fi and en from any page. Root "/" is the fi
      // front page (canonical -> /fi).
      prerender: { enabled: true, crawlLinks: true },
      // The static host's 404 override serves /fi/404 for every unknown URL
      // (see public/staticwebapp.config.json); every JS visitor whose tree
      // differs is redirected to /fi/404 or /en/404 before anything paints
      // (see LANG_REDIRECT_SCRIPT).
      pages: [{ path: "/fi/404" }, { path: "/en/404" }],
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
