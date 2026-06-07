# Agent Context (Quick Read)

Purpose: this file is a compact, high-signal summary for coding agents before making changes.

## 1) Non-Negotiable Architecture Rules

- Keep exactly one global terminal shell at app-frame level in src/routes/+layout.svelte.
- Main tabs (Home/CSS/AWS/AI/About) must stay in the global terminal header.
- Do not create terminal-inside-terminal layouts.
- The homepage uses xterm content in src/routes/+page.svelte, but must not recreate a full terminal chrome.
- Preserve shell window cues in src/routes/+layout.svelte: rounded corners + overflow clipping + subtle depth/highlight.

## 2) Routing and Navigation Safety

- Internal template links should satisfy svelte/no-navigation-without-resolve.
- Use $app/paths helpers (resolve/base) for route-safe and GitHub Pages-safe navigation.
- Do not hardcode root-relative paths that can break under BASE_PATH deployment.

## 3) Content and Layout Conventions

- Tutorials are grouped under src/routes/(tutorials).
- AI tutorial has a richer layout in src/routes/(tutorials)/ai/+layout.svelte (TOC + section tracking) for article pages.
- Terminal entry routes (/ai, /css, /aws) intentionally bypass extra prose wrappers to keep parity with Home/About spacing.
- Reuse shared prose wrapper in src/lib/components/DocProse.svelte.
- Preserve the terminal-themed visual direction unless explicitly asked to redesign.

## 4) Terminal Profile Contract

- Terminal entry pages are profile-driven from src/lib/terminal-profiles.ts.
- TerminalProfile owns: historyKey, introLines(date), hint, dirs, files, internalRoutes, helpExamples.
- Avoid duplicating terminal config in route pages; route pages should mostly wire profile props into InteractiveTerminal.

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

- Global shell and tabs: src/routes/+layout.svelte
- Homepage xterm content: src/routes/+page.svelte
- Shared terminal profile configs: src/lib/terminal-profiles.ts
- Header brand area: src/routes/Header.svelte
- Tutorial group wrapper: src/routes/(tutorials)/+layout.svelte
- AI tutorial layout: src/routes/(tutorials)/ai/+layout.svelte
- Shared prose styles: src/lib/components/DocProse.svelte
- Agent operating guide: AGENTS.md

## 8) Preferred Workflow for Agents

1. Read this file first.
2. Read AGENTS.md for full rules.
3. Inspect only relevant source files.
4. Implement minimal focused edits.
5. Run validation commands.
6. Report changed files and validation results.

## 9) Terminal Anti-Regression Checks

- One shell rule: terminal chrome exists only in src/routes/+layout.svelte.
- Entry parity rule: /, /about, /ai, /css, /aws keep consistent shell spacing.
- Tutorial entry wrapper rule: /ai, /css, /aws still bypass prose wrappers meant for nested article pages.
- Profile source-of-truth rule: terminal config remains centralized in src/lib/terminal-profiles.ts.
- Visual contract rule: rounded corners + overflow clipping + depth/highlight cues remain intact unless redesign is requested.
