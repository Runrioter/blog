# AGENTS.md

## Project Overview

This repository is Runrioter's personal blog, built as a static SvelteKit site.

Core stack:

- SvelteKit 2 with Svelte 5
- TypeScript in strict mode
- mdsvex for `.svx` content pages
- Tailwind CSS 4 via Vite and PostCSS
- Static output through `@sveltejs/adapter-static`
- Vitest for unit tests
- Playwright for end-to-end tests
- Prettier and ESLint for formatting and linting

The site is deployed to GitHub Pages from version tags matching `v*.*.*`. Production builds use `BASE_PATH` so generated links work under the repository subpath.

Quick entry for coding agents: see `docs/agent-context.md` before making edits.

## Repository Boundaries

Respect `.gitignore` when reading, searching, editing, or summarizing the project. Do not use ignored generated or local-only directories as project context.

Ignored paths include:

- `node_modules/`
- `.svelte-kit/`
- `build/`
- `test-results/`
- deployment output directories such as `.output/`, `.vercel/`, `.netlify/`, `.wrangler/`
- local environment files such as `.env` and `.env.*`
- notebook/checkpoint folders such as `jupyter/` and `.ipynb_checkpoints/`
- OS files such as `.DS_Store` and `Thumbs.db`

Generated files should be recreated through project commands instead of edited directly.

## Common Commands

Use npm; this project has `package-lock.json`.

- Install dependencies: `npm install`
- Start local development: `npm run dev`
- Type and Svelte check: `npm run check`
- Format all files: `npm run format`
- Lint: `npm run lint`
- Unit tests: `npm run test:unit -- --run`
- End-to-end tests: `npm run test:e2e`
- Full test suite: `npm run test`
- Production build: `npm run build`
- Preview production build: `npm run preview`

Before finishing code changes, run the narrowest relevant validation. For shared route, layout, config, or deployment changes, prefer `npm run check` plus `npm run lint`; add tests or `npm run build` when the change affects rendering, routing, or static output.

## Code Style

- Follow the existing Prettier configuration: tabs, single quotes, no trailing commas, and 100-character print width.
- Keep TypeScript strict and avoid `any` unless there is a clear boundary that cannot be typed better.
- Prefer existing SvelteKit conventions over custom framework abstractions.
- Keep changes small and local to the feature or bug being addressed.
- Do not edit generated `$types` files or files inside ignored output directories.
- Use `$lib` imports for shared components and assets under `src/lib`.
- Use `base` from `$app/paths` for internal links that must work on GitHub Pages.

## Svelte and Routing Guidelines

- This project uses Svelte 5 syntax. Prefer runes-style component props, for example `let { data } = $props();`.
- Routes live under `src/routes`.
- Route groups such as `src/routes/(tutorials)` organize URL structure without adding a path segment.
- Static content can be authored as `.svelte` pages or `.svx` pages where Markdown is a better fit.
- Keep `<svelte:head>` titles and descriptions updated for pages that represent user-visible content.
- The root layout prerenders the app. Preserve static-generation compatibility unless a task explicitly requires server-only behavior.
- Keep public static assets in `static/`; keep imported component assets in `src/lib/images`.

## Current IA and UI Architecture (Important)

The current site shell is intentionally terminal-first and has specific structure constraints.

- There is exactly one global terminal shell in `src/routes/+layout.svelte`.
- The global shell owns:
  - terminal window chrome (status dots + title)
  - main navigation tabs (`Home`, `CSS`, `AWS`, `AI`, `About`)
  - route content container (`{@render children()}`)
- Do not introduce a second terminal frame around page-level content.
- Do not add another top-level nav outside the terminal header unless user explicitly asks.

### Terminal Shell Visual Contract

- Global terminal shell styling in `src/routes/+layout.svelte` should preserve macOS-like window shape:
  - rounded corners (`border-radius`)
  - clipped content (`overflow: hidden`)
  - subtle layered shadow/highlight for window depth
- Avoid changing these shell-level window cues unless the task explicitly asks for visual redesign.

### Single-Terminal Rule

- Avoid nested terminal containers ("terminal inside terminal").
- Page routes should render content into the global terminal content area, not recreate full window chrome.
- The homepage (`src/routes/+page.svelte`) uses `@xterm/xterm`, but should only render the xterm host/content body under the shared shell.

### Tabs and Header Behavior

- Main tabs must remain in the global terminal header.
- Active tab highlighting should continue to follow current route.
- Header path indicator should reflect current pathname and stay lightweight.
- Keep mobile behavior intact:
  - tabs can scroll horizontally
  - non-essential header text can be hidden on small screens

### Route/Link Safety

- This repo enforces `svelte/no-navigation-without-resolve`.
- Internal nav links in Svelte templates should use `resolve(...)` where required.
- For runtime navigation logic that must honor GitHub Pages base path, use `$app/paths` helpers (`base`, `resolve`) as appropriate.

## Content and Tutorial Layout Conventions

- Tutorials are grouped under `src/routes/(tutorials)`.
- AI tutorial pages use a richer layout (TOC + section tracking) in `src/routes/(tutorials)/ai/+layout.svelte` for article pages.
- Terminal entry routes (`/ai`, `/css`, `/aws`) intentionally bypass extra prose/wrapper containers to keep spacing consistent with Home/About.
- CSS/AWS/other tutorial content pages should keep using shared prose/layout wrappers unless a task explicitly changes IA.
- Shared prose styling lives in `src/lib/components/DocProse.svelte`; reuse instead of duplicating typography wrappers.

### Terminal Entry Page Configuration

- Terminal entry pages are configuration-driven from `src/lib/terminal-profiles.ts`.
- `TerminalProfile` is the source of truth and owns at least:
  - `historyKey`
  - `introLines(date)`
  - `hint`
  - `dirs`
  - `files`
  - `internalRoutes`
  - `helpExamples`
- Keep route page files thin; avoid inlining long terminal config blobs in page components.

## Styling Guidelines

- Tailwind CSS is available globally through `src/app.css`.
- Prefer Tailwind utility classes for layout and spacing when that matches nearby code.
- Use component-scoped `<style>` blocks for component-specific behavior or selectors that are clearer in CSS.
- Use `style lang="postcss"` when applying Tailwind utilities inside component CSS with `@apply`.
- Reuse existing CSS custom properties from `src/app.css` for theme colors and shared values where appropriate.
- Current visual direction is terminal-themed documentation UI (dark shell + mono-forward accents). Preserve this direction unless requested otherwise.

## Testing Guidelines

- Unit tests live under `src` and match `src/**/*.{test,spec}.{js,ts}`.
- End-to-end tests live in `e2e`.
- Playwright starts `npm run build && npm run preview` on port `4173`.
- Add or update tests when changing behavior, route output, navigation, or reusable components.
- For content-only changes, `npm run check` and `npm run lint` are usually sufficient unless the content affects routing or build output.

## Deployment Notes

- Static builds output to `build/`.
- GitHub Pages deployment is configured in `.github/workflows/gh-deploy.yml`.
- The deploy workflow sets `BASE_PATH` to `/${{ github.event.repository.name }}`. Avoid hard-coded root-relative internal links; use SvelteKit helpers such as `$app/paths`.
- The adapter is configured with `fallback: '404.html'` and strict static output. Broken prerendered routes should be treated as build failures.

## Agent Workflow

- Start by reading the relevant source and config files that are not ignored by `.gitignore`.
- Use `rg` or `rg --files` for searches so ignored files stay out of scope by default.
- Check `git status --short` before editing and do not revert unrelated user changes.
- Prefer `apply_patch` for manual edits.
- Keep generated artifacts out of commits unless the user explicitly asks for them.
- After edits, report the files changed and the validation commands run. If a command was not run, state why.

## Regression Checklist for Agents

Before finishing UI/layout work, quickly verify all of the following still hold:

- Only one terminal shell exists at app-frame level (`src/routes/+layout.svelte`).
- Tabs remain in terminal header, not as a separate outer/inner duplicated bar.
- Homepage still mounts xterm and does not reintroduce independent terminal chrome.
- Internal navigation still passes lint rules and works with GitHub Pages base path.
- Run `npm run lint` and `npm run check` for layout/navigation/style changes.

### Terminal Regression Checklist (Minimum)

Before merging terminal-related changes, verify these explicit safeguards:

- No nested terminal frame:
  - `src/routes/+layout.svelte` is the only file that defines terminal window chrome.
  - Entry route pages do not add another outer frame/chrome.
- Entry route spacing parity:
  - `/`, `/about`, `/ai`, `/css`, `/aws` entry pages render with consistent shell spacing.
  - Tutorial entry routes (`/ai`, `/css`, `/aws`) still bypass extra prose wrappers intended for article pages.
- Profile-driven config integrity:
  - Terminal entry pages do not inline large command/file maps.
  - `src/lib/terminal-profiles.ts` remains the source of truth for `historyKey`, `introLines(date)`, `hint`, `dirs`, `files`, `internalRoutes`, `helpExamples`.
- macOS shell cues preserved:
  - Shell keeps rounded corners, clipped content, and subtle depth/highlight styling unless redesign is explicitly requested.
