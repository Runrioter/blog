# Agent Context (Quick Read)

Purpose: this file is a compact, high-signal summary for coding agents before making changes.

## 1) Non-Negotiable Architecture Rules

- Two-pane code-agent TUI: the macOS-style terminal window (`src/routes/+layout.svelte`) hosts a persistent xterm on the left (`.agent-terminal`) and the current route as a document on the right (`.agent-docs`).
- Exactly one xterm, in the global layout. Page routes never render their own terminal and never recreate window chrome (dots/title/rounded corners stay in `+layout.svelte`).
- The terminal persists across route changes; do not key or remount it on `page.url.pathname`.
- There is no top-level tab bar. Navigation = document-pane links (which echo a command into the terminal) or terminal commands (`open`/`cd`, via `goto()`).
- The terminal pane must keep `overflow: hidden` (xterm can overflow and eat clicks meant for the document pane).
- On mobile the panes stack (terminal on top, ~45vh).
- Preserve the macOS window cues (rounded corners, clipped content, subtle depth) and the global footer under the window.

## 2) Routing and Navigation Safety

- Internal template links should satisfy svelte/no-navigation-without-resolve.
- Use `resolve` from `$app/paths` for route-safe and GitHub Pages-safe navigation (`base` was removed in SvelteKit 3).
- Do not hardcode root-relative paths that can break under BASE_PATH deployment.

## 3) Content and Layout Conventions

- Tutorials are grouped under src/routes/(tutorials).
- AI/AWS article prose is generated from the Obsidian vault (see docs/content-workflow.md); section landings are TOC docs via `#lib/components/SectionToc.svelte` (AI/AWS from generated `toc.ts`, CSS handwritten).
- Articles reuse shared prose styling in src/lib/components/DocProse.svelte.
- Preserve the terminal-themed visual direction (dark window, mono-forward accents) unless explicitly asked to redesign.

## 4) Terminal Profile Contract

- The single shell terminal is driven by `shellTerminalProfile` in src/lib/terminal-profiles.ts (mounted in +layout.svelte).
- It owns: historyKey, introLines(date), hint, dirs, files, internalRoutes, helpExamples. The virtual filesystem mirrors the real route tree — keep it in sync when routes change.
- Route pages stay thin (title/meta + content); never inline terminal config.

## 5) Edit Boundaries

- Never edit generated outputs (build/, .svelte-kit/ or generated type artifacts).
- Keep changes local and avoid unrelated refactors.
- Respect .gitignore-scoped boundaries in analysis and edits.

## 6) Validation Minimum

For shared layout/navigation/style changes, always run:

- npm run lint
- npm run check

Add npm run build when changes can affect static output or route generation.

## 7) Fast File Map

- Two-pane frame, window chrome, terminal mount, doc pane: src/routes/+layout.svelte
- Interactive terminal (xterm engine, echoCommand API): src/lib/components/InteractiveTerminal.svelte
- Shell profile (single source of truth): src/lib/terminal-profiles.ts
- Welcome + site TOC: src/routes/+page.svelte
- Section TOC docs: src/routes/(tutorials)/{ai,css,aws}/+page.svelte + #lib/components/SectionToc.svelte
- Header brand area: src/routes/Header.svelte
- Shared prose styles: src/lib/components/DocProse.svelte
- Agent operating guide: AGENTS.md

## 8) Preferred Workflow for Agents

1. Read this file first.
2. Read AGENTS.md for full rules.
3. Inspect only relevant source files.
4. Implement minimal focused edits.
5. Run validation commands.
6. Report changed files and validation results.

## 9) Agent TUI Anti-Regression Checks

- One window rule: window chrome exists only in src/routes/+layout.svelte.
- One terminal rule: xterm mounts only in the global left pane; persists across routes; no page renders a terminal.
- Panes rule: left = terminal, right = current route document; home shows welcome + TOC; no top-level tab bar.
- Sync rule: doc link clicks echo into the terminal; terminal `open` uses `goto()` and does not echo.
- Clipping rule: `.agent-terminal` keeps `overflow: hidden` (e2e TOC-click test covers this).
- Visual contract: macOS dots/title/rounded/clipped/depth cues and the global footer remain intact unless redesign is requested.
