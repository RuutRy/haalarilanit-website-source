import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import mdx from "@mdx-js/rollup";
import remarkH2Sections from "./src/plugins/remark-h2-sections.ts";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
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
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  build: {
    // The JS green gate (see .browserslistrc notes): everything is
    // transpiled down to these browsers at build time - anything
    // untranspilable for them fails the build, so non-green syntax
    // cannot ship. Web APIs are not transpiled; keep the API surface to
    // green ones (pnpm scan:css gates the CSS side via doiuse).
    target: ["chrome120", "edge120", "firefox128", "safari16.4"],
  },
  plugins: [
    // Compile .mdx before TanStack Start's router pipeline sees the modules.
    { ...mdx({ remarkPlugins: [remarkH2Sections] }), enforce: "pre" },
    tanstackStart({
      spa: { enabled: false },
      // The language toggle links into the other tree, so the crawler
      // discovers both fi and en from any page. Root "/" redirects by sniff.
      prerender: { enabled: true, crawlLinks: true },
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
