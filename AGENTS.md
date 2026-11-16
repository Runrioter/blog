# AGENTS.md

## Project Overview

This repository is Runrioter's personal blog, built as a static SvelteKit site.

Core stack:

- SvelteKit 3 with Svelte 5
- TypeScript in strict mode
- mdsvex for `.svx` content pages
- Tailwind CSS 4 via Vite and PostCSS
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
- Use `#lib` imports (with explicit file extensions) for shared components and assets under `src/lib`.
- Use `resolve` from `$app/paths` for internal links that must work on GitHub Pages (`base` was removed in SvelteKit 3; note route paths no longer carry a leading slash).

## Svelte and Routing Guidelines

- This project uses Svelte 5 syntax. Prefer runes-style component props, for example `let { data } = $props();`.
- Routes live under `src/routes`.
- Route groups such as `src/routes/(tutorials)` organize URL structure without adding a path segment.
- Static content can be authored as `.svelte` pages or `.svx` pages where Markdown is a better fit.
- Keep `<svelte:head>` titles and descriptions updated for pages that represent user-visible content.
- The root layout prerenders the app. Preserve static-generation compatibility unless a task explicitly requires server-only behavior.
- Keep public static assets in `static/`; keep imported component assets in `src/lib/images`.

## Current IA and UI Architecture (Important)

The site shell is a code-agent style TUI inside a macOS-like terminal window.

```
.terminal-shell (one window: dots + title + path indicator)
├── left pane  .agent-terminal  — the ONLY xterm terminal (persistent)
└── right pane .agent-docs      — current route rendered as a document
```

### Two-Pane Agent Shell Rules

- `src/routes/+layout.svelte` is the only file that defines terminal window chrome (macOS dots, title, rounded corners, clipped content, layered shadow). Preserve these cues; do not add a second window frame.
- The xterm terminal is rendered exactly once, in the global layout left pane. Page routes must never render `InteractiveTerminal` or any other terminal/xterm of their own.
- The left terminal is persistent across routes: do NOT wrap it in `{#key page.url.pathname}` or route it through per-page components. Navigation must not reset or remount the terminal session.
- The right pane renders `{@render children()}` (the current route) inside `.agent-docs`; the macOS window is the only outer frame.
- Keep the xterm pane clipped (`.agent-terminal { overflow: hidden }` — xterm's renderer can overflow its container and intercept clicks meant for the document pane).
- On mobile (<820px) the panes stack vertically (terminal on top, ~45vh).
- The global footer (SvelteKit dashboard + avatars) stays below the window.

### Navigation Contract

- No top-level tab bar exists. Navigation happens by (a) clicking links in the document pane, or (b) terminal commands (`open <route>`, `cd`).
- Terminal navigation uses SvelteKit `goto()` (soft navigation — real URL changes, prerender-compatible). Never `window.location.href`.
- Document-pane link clicks echo a pseudo command line into the terminal (the layout watches `page.url.pathname` and calls the terminal's `echoCommand` API); terminal-initiated navigation and back/forward are intentionally not echoed. Do not remove this sync behavior without a reason.
- Route/URL structure is unchanged and is the source of truth for the right pane: `/` = welcome + table of contents, `/about` = about doc, `/ai`/`/css`/`/aws` = section TOC docs (landing pages), articles render their generated/handwritten content.

### Route/Link Safety

- This repo enforces `svelte/no-navigation-without-resolve`.
- Internal links in Svelte templates should use `resolve(...)`; external anchors need `rel="noopener external"`.
- The terminal profile (`#lib/terminal-profiles.ts` → `shellTerminalProfile`) is the source of truth for the xterm session: `historyKey`, `introLines(date)`, `hint`, `dirs`, `files`, `internalRoutes`, `helpExamples`. Its `dirs`/`files`/`internalRoutes` mirror the real route tree — keep them in sync when routes are added or renamed.
- Keep route page files thin (title/meta + content), not terminal config blobs.

## Content and Tutorial Layout Conventions

- Tutorials are grouped under `src/routes/(tutorials)` (route group — no URL segment).
- Prose content for `ai`/`aws` is **generated** from the Obsidian vault in `content/` (git-ignored) via `npm run content:sync` — edit the source notes there, never the generated `+page.svx`/`toc.ts`. See `docs/content-workflow.md`.
- Section landing pages (`/ai`, `/css`, `/aws`) are table-of-contents documents built with `#lib/components/SectionToc.svelte`; the AI/AWS lists come from the generated `toc.ts`, the CSS list is handwritten (CSS tutorials are interactive, not vault-generated).
- Article pages reuse `#lib/components/DocProse.svelte` for prose styling; do not duplicate typography wrappers.
- There are no per-section route layouts; both panes come from the global layout.

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
- The deploy workflow sets `BASE_PATH` to `/${{ github.event.repository.name }}` (consumed in `vite.config.ts`). Avoid hard-coded root-relative internal links; use SvelteKit helpers such as `$app/paths` `resolve`.
- The adapter is configured with `fallback: '404.html'` and strict static output. Broken prerendered routes should be treated as build failures.

## Agent Workflow

- Start by reading the relevant source and config files that are not ignored by `.gitignore`.
- Use `rg` or `rg --files` for searches so ignored files stay out of scope by default.
- Check `git status --short` before editing and do not revert unrelated user changes.
- Prefer `apply_patch` for manual edits.
- Keep generated artifacts out of commits unless the user explicitly asks for them.
- After edits, report the files changed and the validation commands run. If a command was not run, state why.

## Regression Checklist for Agents

Before finishing UI/layout work, verify all of the following still hold:

- Exactly one terminal window at app-frame level (`src/routes/+layout.svelte`): dots + title + path indicator, rounded corners, clipped content, subtle depth cues.
- The xterm terminal mounts exactly once (global layout left pane) and persists across routes; no page renders a terminal of its own.
- The right document pane renders the current route; home shows the welcome + TOC.
- Navigation works both ways: doc links (with terminal echo) and terminal `open` (no echo, `goto()`).
- `.agent-terminal` keeps `overflow: hidden` (xterm overflow intercepts clicks on the doc pane — covered by the e2e TOC-click test).
- Internal navigation still passes lint rules and works with the GitHub Pages base path.
- Run `npm run lint`, `npm run check`, and `npm run test:e2e` for layout/navigation changes.
