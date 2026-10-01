// vite-plugin-theme-assets.ts
//
// Renders src/assets/templates/*.svg into real assets by replacing
// {{var:name}} placeholders with values resolved from the custom properties
// of src/index.css. Dev: middleware serves each route, watcher re-renders on
// change. Build: emitted as real files.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type TokenOrValue, transform } from "lightningcss";
import type { Plugin } from "vite";

interface ThemeAsset {
  template: string;
  route: string;
}

interface ThemeAssetsOptions {
  cssFile: string;
  assets: ThemeAsset[];
}

const PLACEHOLDER = /\{\{var:([\w-]+)\}\}/g;

function customProperties(css: string, file: string): Map<string, TokenOrValue[]> {
  const props = new Map<string, TokenOrValue[]>();
  transform({
    filename: file,
    code: Buffer.from(css),
    visitor: {
      Declaration(decl) {
        if (decl.property === "custom") props.set(decl.value.name, decl.value.value);
      },
    },
  });
  return props;
}

// var() chains are followed until a value with no var() left. Only rgb colors
// and bare tokens survive SVG output - anything else is a config error.
function tokenString(
  name: string,
  props: Map<string, TokenOrValue[]>,
  file: string,
  stack: string[],
): string {
  if (!name.startsWith("--")) name = `--${name}`;
  const value = props.get(name);
  if (!value) throw new Error(`theme-assets: --${name} not found in ${file}`);
  if (stack.includes(name)) throw new Error(`theme-assets: circular var() reference at --${name}`);
  stack.push(name);

  const parts = value.flatMap((node): string[] => {
    if (node.type === "var") return [tokenString(node.value.name.ident, props, file, stack)];
    if (node.type === "color" && typeof node.value === "object" && node.value.type === "rgb") {
      const { r, g, b, alpha } = node.value;
      const rgb = `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`;
      return [alpha === 1 ? `rgb(${rgb})` : `rgba(${rgb}, ${alpha})`];
    }
    if (node.type === "token") {
      const t = node.value;
      if (t.type === "ident" || t.type === "delim") return [t.value];
      if (t.type === "number") return [`${t.value}`];
      if (t.type === "percentage") return [`${t.value * 100}%`];
      if (t.type === "dimension") return [`${t.value}${t.unit}`];
      if (t.type === "white-space") return [" "];
    }
    throw new Error(`theme-assets: unsupported value at --${name}: ${node.type}`);
  });
  stack.pop();
  return parts.join("");
}

function render(root: string, options: ThemeAssetsOptions): Map<string, string> {
  const css = readFileSync(resolve(root, options.cssFile), "utf8");
  const props = customProperties(css, options.cssFile);
  const out = new Map<string, string>();
  for (const asset of options.assets) {
    const template = readFileSync(resolve(root, asset.template), "utf8");
    const svg = template.replace(PLACEHOLDER, (_, name: string) =>
      tokenString(name, props, options.cssFile, []),
    );
    if (PLACEHOLDER.test(svg)) {
      throw new Error(`theme-assets: unresolved placeholders in ${asset.template}`);
    }
    out.set(asset.route, svg);
  }
  return out;
}

export function themeAssetsPlugin(options: ThemeAssetsOptions): Plugin {
  let rendered = new Map<string, string>();

  return {
    name: "theme-assets",

    configResolved(config) {
      rendered = render(config.root, options);
    },

    configureServer(server) {
      const root = server.config.root;

      for (const route of rendered.keys()) {
        server.middlewares.use(route, (_req, res) => {
          res.setHeader("Content-Type", "image/svg+xml");
          res.setHeader("Cache-Control", "no-cache");
          res.end(rendered.get(route));
        });
      }

      const watched = [options.cssFile, ...options.assets.map((a) => a.template)].map((f) =>
        resolve(root, f),
      );
      server.watcher.add(watched);
      server.watcher.on("change", (file) => {
        if (!watched.includes(file)) return;
        try {
          rendered = render(root, options);
          server.ws.send({ type: "full-reload" });
        } catch (error) {
          server.config.logger.error(String(error));
        }
      });
    },

    generateBundle() {
      for (const [route, svg] of rendered) {
        this.emitFile({ type: "asset", fileName: route.slice(1), source: svg });
      }
    },
  };
}
