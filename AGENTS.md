# e6hancer — AGENTS.md

Browser extension for e621.net. Built with WXT v0.20 + React 19 + TypeScript 5.9 + Tailwind v4 + Vite 8.

## Commands

| Command                                                   | Action                                                               |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `pnpm dev` / `pnpm dev:firefox`                           | Dev server (Chrome / Firefox Developer Edition)                      |
| `pnpm build` / `pnpm build:firefox` / `pnpm build:safari` | Production build                                                     |
| `pnpm zip` / `pnpm zip:firefox` / `pnpm zip:safari`       | Build + zip to `.output/`                                            |
| `pnpm compile`                                            | `tsc --noEmit` (typecheck)                                           |
| `pnpm lint` / `pnpm lint:fix`                             | `oxlint src/` (type-aware via `oxlint.config.ts`)                    |
| `pnpm lint:css` / `pnpm lint:css:fix`                     | `stylelint "src/**/*.css"` (cached via `stylelint.config.ts`)        |
| `pnpm fmt`                                                | `oxfmt` (add `--check` for read-only, as CI does)                    |
| `pnpm deps`                                               | `depcruise --config .dependency-cruiser.js src`                      |
| `pnpm generate:icon`                                      | Generate PNG icons from `/icon.svg`                                  |
| `pnpm release`                                            | `changelogen --release --push` (requires `.env` with `GITHUB_TOKEN`) |

## CI (`.github/workflows/`)

- **`ci.yml`**: Jobs `typecheck`, `format`, `lint`, `deps` run in parallel. `build` depends on all four.
- **`submit.yml`**: Manual trigger (`workflow_dispatch`). Validates, bumps version via `changelogen`, builds, tags, creates GitHub release, and submits to Chrome/Firefox/Edge stores via `wxt submit`. Secrets: `CHROME_*`, `FIREFOX_*`, `EDGE_*` in GitHub Actions secrets.

## Pre-commit

Husky runs `pnpm exec lint-staged` (config in `lint-staged.config.mjs`):

- `oxlint src/` + `depcruise --config .dependency-cruiser.js src` run **once** (not per-file, via function wrapper) when any `*.{ts,tsx,js,jsx}` file is staged
- `oxfmt` on `*.{ts,tsx,js,jsx,json,html,md}`
- `stylelint --fix` then `oxfmt` on `*.css`

## Project structure

```
src/
  entrypoints/
    popup/       # React SPA (popup UI)
    content/     # Content script on *://e621.net/posts/*
    background/  # Persistent background service worker (MV3)
  components/    # layout/ (Navbar, Page), ui/ (Bar, Brand, Toggle, Slider, Select, Setting, SegmentedControl, Tooltip…)
  views/         # SettingsView/ (PostSection)
  hooks/         # useTheme, useSettings, useScroll, useOnClick
  utils/         # Shared logic (store, messaging, settings, storage, types, multi, marker…)
  assets/
    global.css   # Tailwind via @import "tailwindcss"
```

## Key conventions

- `@/` → `src/`, `@@/` → package root, `~`/`~~` → same as `@`/`@@` (WXT defaults)
- CSS Modules for components (`Page.module.css`); global styles in `global.css`
- CSS Module classes via dot notation (`style.class`); use index notation for kebab-case (`style["kebab-class"]`)
- CSS selectors shall be nested with ampersand whenever possible
- Never use `px` in CSS — convert at `16px = 1em`
- Dev-only logging guarded by `if (import.meta.env.DEV)`
- Popup wraps `<React.StrictMode>` only in dev (`main.tsx:16`)
- Content script injects styles via `style.css?inline` into `<head>`
- SVG imports via `?react` suffix using `vite-plugin-svgr` (types in `src/env.d.ts`)
- React-scan vite plugin (`@react-scan/vite-plugin-react-scan`) runs in dev only — tree-shaken from prod automatically

## Settings flow

1. Background owns source-of-truth for settings (Zustand store with `subscribeWithSelector`).
2. Popup & content scripts call `sendMessage("settings.get")` on mount via `fetchSettingsStore()`.
3. Background broadcasts updates via `sendMessage("settings.update", data)` where `data` is `PartialSettings` (`DeepPartial<Settings>`).
4. Store applies updates via `deepMerge()` (not shallow spread) to avoid wiping sibling nested fields.
5. Content script apply pipeline (`apply.ts`): `createApplyFunctions()` returns `{ applyConstraint, applyAlignment, applyLiveUpdate, applyHideTopAd }`. Each `createApply*` returns a single-arg function. `applySettings()` calls all four on initial load.
6. Subscriptions (`subscriptions.ts`) watch specific nested paths with `useContentSettings.subscribe` — fires the corresponding apply function on change.
7. `withPrev<T>` wrapper in `apply.ts` tracks previous value for toggle/undo logic (used by `createApplyHideTopAd`).

## Settings type shape

- `HideTopAd: boolean` — toggles moving `#ad-leaderboard-top` into `.adscape`
- `align: "left" | "center" | "right"` — horizontal image position
- `verticalConstraint: { type: "off"|"full"|"margined", margin: Pixels, liveUpdate: { enabled: boolean, debounce: Milliseconds } }`

## Utils

- `multi.ts` — `traverse(obj, key)` / `traverseSet(obj, key, value, {parents})` for nested key path access (dot-separated), `getKeys(ctor)`, `mapMulti(ctor, fn)`. Keys use `MultiKey<T>` type.
- `store.ts` — `deepMerge(a, b)` for nested object merging. `createSettingsStore()` / `fetchSettingsStore()` for Zustand store lifecycle.
- `storage.ts` — `SettingsStorage` wraps `wxt/storage` with typed `get`/`set`/`watch` for individual setting keys using the same dot-path pattern.

## Infrastructure quirks

- `tsconfig.json` **extends `.wxt/tsconfig.json`** (generated by `wxt prepare`, run in `postinstall`). If types are missing, re-run `pnpm install`.
- Firefox dev uses binary `firefoxdeveloperedition` (set in `wxt.config.ts`). Regular Firefox will not work.
- Chromium dev profile persisted at `.wxt/chrome-data` (`keepProfileChanges: true`).
- WXT auto-imports disabled (`imports: false` in `wxt.config.ts`).
- Version string: `git describe --tags --always --dirty` (dev) or `GITHUB_REF_NAME` (CI), available as `__VERSION__`.
- Custom Vite plugin `icong()` in `scripts/vitePlugins/icong.ts` generates PNGs from `/icon.svg` on build start and watches for changes in dev.
- Vite rolldown uses `experimental: { lazyBarrel: true }`.
- `.nvmrc` specifies Node v24.
- Stylelint caches results (`stylelint.config.ts`).
- `.gitattributes` enforces LF line endings.
- `reference/` directory contains old vanilla-js extension code for migration reference — not part of the build.
