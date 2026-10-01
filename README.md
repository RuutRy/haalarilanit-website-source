# Haalarilanit

Source code for [haalarilan.it](https://haalarilan.it). Built with TanStack
Start - pages are prerendered to static HTML at build time and rehydrated on
the client when needed.

## Editing site content

- Event info, contacts, sponsors, organizers and every link/URI live in [`src/lib/data.ts`](src/lib/data.ts).
- Text and translations live in `src/locales/` (Finnish + English, i18next-powered).
- Page copy is MDX in `src/content/<lang>/*.mdx` - `src/content/fi/` for
  Finnish, `src/content/en/` for English.
- When changing content, also update the metadata: page descriptions are the
  `meta.*` keys in `src/locales/`, and the site title/description live in
  [`src/lib/metadata.ts`](src/lib/metadata.ts).

## Generated assets

The favicon and background are generated at build time from the svg templates
in `src/assets/templates/` - edit those, not the files in `public/assets/`.
The build renders the templates with the site's css custom properties and
rasterizes the favicons and `og-image.png` into `public/assets/`. Committed
copies act as a fallback; delete one and rebuild to force regeneration.

## Getting started

First install [pnpm](https://pnpm.io/installation), then:

```sh
pnpm install
pnpm dev
```

## Checks

```sh
pnpm lint       # biome check (format, import order, lint)
pnpm lint:fix   # biome check --write (fixes formatting + safe issues)
pnpm typecheck
pnpm test       # vitest
pnpm build      # typecheck + prerender into dist/
```

## Git hooks (optional)

```sh
pnpm exec lefthook install
```

Runs Biome (`lint:fix`) on every commit, and typecheck + tests on push.

