# Haalarilanit

Source code for [haalarilan.it](https://haalarilan.it).

The site is mostly data-driven:

- Event info, contacts, sponsors, organizers and every link/URI live in [`src/lib/data.ts`](src/lib/data.ts).
- Text and translations live in `src/locales/` (Finnish + English, i18next-powered).

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
pnpm build
```

## Git hooks (optional)

```sh
pnpm exec lefthook install
```

Runs Biome (`lint:fix`) on every commit, and typecheck + tests on push.
