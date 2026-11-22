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
- Release (pre-flight + version bump + tag + push): `make release [BUMP=patch|minor|major]` — see `Makefile` and the `release` skill

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
└── .agent-body (stacked vertically)
    ├── .agent-docs   — current route rendered as a document (full width when the terminal is hidden)
    ├── .pane-divider — horizontal divider (hidden with the terminal)
    └── .agent-terminal — the ONLY xterm terminal (persistent, bottom block)
        └── .term-statusbar — env info (Browser/Building/Dev/Kit) + ✕ close button
```

### Agent Shell Rules

- `src/routes/+layout.svelte` is the only file that defines terminal window chrome (macOS dots, title, rounded corners, clipped content, layered shadow). Preserve these cues; do not add a second window frame.
- The xterm terminal is rendered exactly once, in the global layout, as a **bottom block** (document on top, terminal below). Page routes must never render `InteractiveTerminal` or any other terminal/xterm of their own.
- **Hidden by default**: `terminalVisible` in `+layout.svelte` gates the terminal; the footer `SvelteKitDashboard` button (`aria-pressed`) toggles it, and the status bar ✕ closes it. No localStorage — every load starts hidden.
- While hidden the terminal stays **mounted** (`.agent-terminal.collapsed { display: none }`) — never conditionally destroy it, the xterm session (buffer/history) must survive toggles. The fit/resize machinery already handles the display:none → visible refit.
- The terminal is persistent across routes: do NOT wrap it in `{#key page.url.pathname}` or route it through per-page components. Navigation must not reset or remount the terminal session.
- The docs container renders `{@render children()}` (the current route) inside `.agent-docs`; the macOS window is the only outer frame.
- The horizontal `pane-divider` drags the terminal height (`terminalPct`, clamp 25–70%). Keep the xterm pane clipped (`.agent-terminal { overflow: hidden }` — xterm's renderer can overflow its container and intercept clicks meant for the document pane).
- On mobile (<820px) an open terminal covers the whole viewport (`position: fixed; inset: 0; z-index: 40`); the status bar ✕ is the only way out. The divider is hidden on mobile.
- The global footer (SvelteKit dashboard toggle + avatars) stays below the window.

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
- The vault is wired as the `obsidian` MCP server (project config `.pi/mcp.json`, vault id `blog`; `obsidian-mcp` reads/writes the markdown files directly — the Obsidian app need not run). Use `mcp__obsidian__*` tools to read/write/search vault notes. Notes with `publish: false` frontmatter stay in the vault but are **skipped** by `content:sync` (no route) — correct for journal/agent notes.
- Section landing pages (`/ai`, `/css`, `/aws`) are table-of-contents documents built with `#lib/components/SectionToc.svelte`; the AI/AWS lists come from the generated `toc.ts`, the CSS list is handwritten (CSS tutorials are interactive, not vault-generated).
- Article pages reuse `#lib/components/DocProse.svelte` for prose styling; reuse instead of duplicating typography wrappers. Section route layouts (`ai`/`css`/`aws`) wrap articles in `DocProse` but pass the section landing (TOC) through unwrapped — keep that split.

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
- **No auto-commit.** This project never commits by itself: after an implementation is finished, run the `review` skill (diff audit + validation gates) and let the user pick one of `COMMIT` / `RELEASE` / `HOLD`. Commit, push or release only after that explicit choice.
- **Pre-commit gate (mandatory):** `npm run lint` AND `npm run check` must both pass before any commit; add `npm run test:e2e` for UI/terminal/routing changes. If Prettier flags files, run `npm run format` first, then re-check. Never commit over a red gate — a lint-red `Breadcrumb.svelte` already slipped into history once (the new `svelte/no-navigation-without-resolve` requires a literal `resolve()` in every `href`/`goto`, and `no-undef` ignores `app.d.ts` globals in `.svelte` files).
- Prefer targeted edits over whole-file rewrites.
- Keep generated artifacts out of commits unless the user explicitly asks for them.
- After edits, report the files changed and the validation commands run. If a command was not run, state why.

## Regression Checklist for Agents

Before finishing UI/layout work, verify all of the following still hold:

- Exactly one terminal window at app-frame level (`src/routes/+layout.svelte`): dots + title + path indicator, rounded corners, clipped content, subtle depth cues.
- The xterm terminal mounts exactly once (global layout bottom block) and persists across routes and hide/show toggles; no page renders a terminal of its own.
- The terminal starts hidden (`collapsed`); `aria-pressed` on the footer toggle reflects state; status bar shows env info + ✕ close.
- The document pane renders the current route (full width when the terminal is hidden); home shows the welcome + TOC.
- Navigation works both ways: doc links (with terminal echo) and terminal `open` (no echo, `goto()`).
- `.agent-terminal` keeps `overflow: hidden` (xterm overflow intercepts clicks on the doc pane — covered by the e2e TOC-click test).
- Internal navigation still passes lint rules and works with the GitHub Pages base path.
- Run `npm run lint`, `npm run check`, and `npm run test:e2e` for layout/navigation changes.

## Repo Agent Skills

Reusable workflows live in `.agents/skills/` (pi discovers them automatically; force with `/skill:<name>`):

- `review` — end-of-implementation gate: diff audit, validation gates, then the three-way decision (commit only / commit + release / hold). No auto-commit anywhere else.
- `release` — publishes from an already-committed, clean tree: `make release [BUMP=…]` (pre-flight incl. the `BASE_PATH` deploy-shape build + engine check, native `npm version` bump + tag + push), Actions monitoring and failure triage. It never reviews or commits feature code.
- `visual-check` — build → preview → Playwright probe (`.agents/skills/visual-check/scripts/shot.mjs`) → screenshot → cleanup loop, plus the known visual failure classes to assert.
- `content-update` — Obsidian vault edit → `npm run content:sync` → diff review → scaled validation → commit.
- `notes` — record/search project knowledge in the vault through the `obsidian` MCP server (journal/decisions/research notes with `publish: false`).
- `dependabot` — audit/merge dependabot dep-update PRs: staleness + conflict checks, changelog/breaking analysis, full-gate verification, adaptation refactors, and vault reports for severe incompatibilities.

## SvelteKit 3 / Svelte 5 Gotchas (learned the hard way)

- `resolve()` is strictly generic in kit 3.2: runtime-built path strings need `as ReturnType<AppTypes['Path']>` — the generated `AppTypes.Path` is a _callable_, so use `ReturnType<…>` (not the alias directly) for the string union.
- `$app/paths` `base` is not in the public types, and at runtime it is a **relative URL during prerendering** (`./`, `../`). The stable base in every context is the `__SVELTEKIT_PATHS_BASE__` compile constant (declared in `src/app.d.ts`). Remember the payload `base` is also relative, while `page.url.pathname` **keeps** the base prefix — strip it with `__SVELTEKIT_PATHS_BASE__` when comparing paths.
- Kit 3 ignores `svelte.config.js` — svelte/adapter/mdsvex config lives in the `sveltekit(...)` plugin in `vite.config.ts`. `#lib` is wired through the `imports` field in `package.json` (explicit file extensions required).
- Svelte 5 compiler/lint rules that bite: `:global()` accepts exactly one selector (use `:is(...)` for alternatives); `transition:` on a _component_ is an error (wrap the element or drop the transition); `$derived` rejects block-function form (use a helper + expression); use `onxxx={}` event attributes (`on:xxx` is deprecated); a non-interactive `role` on `<button>` is a lint violation (use `<div role=…>` for non-interactive widgets).
- JSDoc `@type` casts don't work in `.ts` files (module syntax); use explicit `satisfies`/`as`.
- Runes modules (`*.svelte.ts`): module-level `$state` that gets _reassigned_ cannot be `export`ed, and `$derived` cannot be exported either (build error) — expose both through getter functions (reads stay reactive). Module-level `$effect` is rejected at runtime (`effect_orphan`) — do side effects explicitly (a function called from the setter + an event listener).
- The theme module (`src/lib/theme.svelte.ts`) owns `light`/`dark`/`auto`: `.dark` class on `<html>` (inline script in `app.html` prevents FOUC), tokens in `src/app.css` (`:root` = light, `.dark` overrides), Tailwind `dark:` variant via `@custom-variant dark (&:where(.dark, .dark *))`.
- xterm re-paint on theme switch: xterm 6's DOM renderer bakes colors into a `<style>` element at init, so it never reacts to `options.theme` changes by itself — the terminal listens for `blog:theme-change` (dispatched by the theme module) and calls `term.options.theme = …` + `term.refresh(0, term.rows - 1)` to rebuild every row. Don't `export let theme = $state(...)` — the docs' universal-reactivity pattern trips on build/SSR.

## xterm Invariants (`InteractiveTerminal.svelte`)

- Cell size is measured from a text span's width **divided by its character-run length** (xterm packs a whole same-style run into one span — a span is a run, not a cell), with `.xterm-char-measure-element` as the fallback source.
- Input is rendered with append + erase/DCH primitives (shell-`read` style). Never rewrite the whole input line per keystroke — on wrapped lines it corrupts the buffer and balloons history. Input is capped at one display row.
- The cursor cell renders as a _space_ in DOM `textContent` — don't treat it as phantom content.
- The grid must re-fit on host resize: `ResizeObserver` plus a settle loop after `document.fonts.ready` (async fonts change cell size without changing the host box). Keep the terminal host `overflow: hidden`.

## E2E Locator Patterns

- `getByRole('link', { name })` matches _substring_ names and can match several nodes — disambiguate with `.first()` or `filter({ hasText })`.
- A keyed `fade` (140ms) leaves the outgoing route in the DOM after navigation — filter, don't assume single-match.
- Wait for the terminal content (`.terminal-host .xterm-rows > div`) before any terminal interaction; type speed ~10ms.
- Hover/focus affordances: assert with `toHaveCSS` / computed style, not screenshots.
- Test timeout is 20s (`playwright.config.ts`).
