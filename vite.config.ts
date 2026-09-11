import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { themeAssetsPlugin } from "./vite-plugin-theme-assets.ts";

export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
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
});
