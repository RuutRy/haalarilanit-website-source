// Rasterizes the brand assets crawlers expect into public/assets/:
// og-image 1200x630, apple-touch-icon 180x180 (flattened - iOS paints
// transparent corners black), favicon-32x32 + favicon.ico, site.webmanifest.
// sharp comes from pnpm; the committed copies stay as a fallback.

import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
import type { Logger, Plugin } from "vite";
import { renderThemeAsset } from "./vite-theme-assets.ts";

export interface RasterAssetsOptions {
  /** Css file the favicon template's colors resolve against. */
  cssFile: string;
  /** The themed favicon svg template (512x512 tile with the mark). */
  faviconTemplate: string;
  /** Wide logotype for the og image. */
  logotype: string;
  /** Site background color: og canvas + touch-icon corner flatten. */
  background: string;
  themeColor: string;
}

const OG_SIZE = { width: 1200, height: 630 } as const;

const webManifest = (themeColor: string, background: string): string =>
  `${JSON.stringify(
    {
      name: "Haalarilanit",
      short_name: "Haalarilanit",
      start_url: "/",
      display: "standalone",
      background_color: background,
      theme_color: themeColor,
      icons: [
        { src: "/assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { src: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
    },
    null,
    2,
  )}\n`;

// ICO container with embedded png payloads; sharp has no ico writer.
function pngsToIco(entries: { png: Buffer; size: number }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + 16 * entries.length;
  const directories = entries.map(({ png, size }) => {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(size, 0); // width (0 means 256)
    dir.writeUInt8(size, 1);
    dir.writeUInt16LE(1, 4); // planes
    dir.writeUInt16LE(32, 6); // bpp
    dir.writeUInt32LE(png.length, 8);
    dir.writeUInt32LE(offset, 12);
    offset += png.length;
    return dir;
  });

  return Buffer.concat([header, ...directories, ...entries.map((e) => e.png)]);
}

/**
 * Raster outputs keyed by their public/assets/ path.
 */
async function rasterize(root: string, options: RasterAssetsOptions): Promise<Map<string, Buffer>> {
  // The themed favicon tile: rendered with the css custom properties.
  const faviconSvg = Buffer.from(renderThemeAsset(root, options.cssFile, options.faviconTemplate));

  // og-image.png: logotext.svg is dark marks on transparency - negate rgb
  // (alpha untouched) to turn them light, then center on the background.
  const logo = await sharp(resolve(root, options.logotype))
    .negate({ alpha: false })
    .resize({ height: 460 })
    .png()
    .toBuffer();
  const ogImage = await sharp({
    create: {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      channels: 4,
      background: options.background,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();

  // Icons from the themed tile. The touch icon must be fully opaque (iOS
  // paints transparent corners black), so it flattens onto the background;
  // the 32px favicon keeps the tile's rounded transparency.
  const appleTouchIcon = await sharp(faviconSvg)
    .flatten({ background: options.background })
    .resize(180, 180)
    .png()
    .toBuffer();
  const favicon32 = await sharp(faviconSvg).resize(32, 32).png().toBuffer();
  const favicon16 = await sharp(faviconSvg).resize(16, 16).png().toBuffer();
  const faviconIco = pngsToIco([
    { png: favicon16, size: 16 },
    { png: favicon32, size: 32 },
  ]);

  const out = new Map<string, Buffer>();
  out.set("og-image.png", ogImage);
  out.set("apple-touch-icon.png", appleTouchIcon);
  out.set("favicon-32x32.png", favicon32);
  out.set("favicon.ico", faviconIco);
  return out;
}

export function rasterAssetsPlugin(options: RasterAssetsOptions): Plugin {
  let root = "";
  let logger: Logger | undefined;

  const sync = async (): Promise<void> => {
    if (!root || !logger) return;
    const log = logger.info.bind(logger);
    const assetsDir = resolve(root, "public/assets");
    try {
      const rastered = await rasterize(root, options);
      for (const [name, buffer] of rastered) {
        const target = join(assetsDir, name);
        const sources =
          name === "og-image.png"
            ? [resolve(root, options.logotype)]
            : [resolve(root, options.faviconTemplate), resolve(root, options.cssFile)];
        const out = statSafe(target);
        const stale = !out || sources.some((s) => (statSafe(s) ?? 0) > out);
        if (stale) {
          writeFileSync(target, buffer);
          log(`raster-assets: regenerated public/assets/${name}`);
        }
      }

      const manifest = join(resolve(root, "public"), "site.webmanifest");
      const content = webManifest(options.themeColor, options.background);
      if (!existsSync(manifest) || readFileSync(manifest, "utf8") !== content) {
        writeFileSync(manifest, content);
        log("raster-assets: wrote public/site.webmanifest");
      }
    } catch (error) {
      logger.warn(
        `raster-assets: generation failed; committed assets in public/assets/ stay in use: ${error}`,
      );
    }
  };

  return {
    name: "raster-assets",

    configResolved(config) {
      root = config.root;
      logger = config.logger;
    },

    buildStart() {
      return sync();
    },

    configureServer(server) {
      void sync();
      const watched = [options.cssFile, options.faviconTemplate, options.logotype].map((f) =>
        resolve(server.config.root, f),
      );
      server.watcher.add(watched);
      server.watcher.on("change", (file) => {
        if (!watched.includes(file)) return;
        void sync();
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}

function statSafe(path: string): number | undefined {
  try {
    return statSync(path).mtimeMs;
  } catch {
    return undefined;
  }
}
