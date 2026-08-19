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
pnpm lint
pnpm format
pnpm typecheck
pnpm build
```

## Git hooks (optional)

```sh
pnpm exec lefthook install
```

Runs formatting + lint on every commit, and typecheck on push.
