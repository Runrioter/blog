---
name: review
description: Review completed feature work before anything is committed — diff audit against the request and repo conventions, run the validation gates, then present the COMMIT / RELEASE / HOLD three-way decision to the user. Use at the end of every implementation task, whenever work is done and about to be committed. Never commit without this gate.
---

# Review & commit decision

**The project never commits automatically.** Every implementation task ends here: review the work, validate it, and let the user pick what happens next.

## 1. Inventory the change

```sh
git status --short        # what is new/modified
git diff --stat           # scope of the work
git diff -- src/          # source changes (templates, routes, lib)
```

- Confirm the working-tree changes match the request — nothing unrelated, no stray files, no debug leftovers.
- If the change touches multiple concerns, list them so the release decision is informed.

## 2. Audit against the conventions

Check the diff against AGENTS.md's standing rules, especially:

- pre-commit gate: `npm run lint` and `npm run check` must pass before a commit (never commit over a red gate).
- SvelteKit 3 / Svelte 5 gotchas (`resolve()` in every href/goto, no module `$effect`, no exported reassigned `$state`/`$derived`, `:global()` single selector, …).
- Routing/nav: internal links via `resolve`, single terminal mount, terminal profile mirrors the route tree.
- Content: never hand-edit generated `.svx`/`toc.ts`; `publish: false` for vault-only notes.
- Styling: theme tokens from `src/app.css` instead of hard-coded hexes.

While auditing you may fix trivially blocked issues (formatting, a missed rule) — that is still part of the implementation. Substantive problems: stop, report, and wait; do not silently expand the change.

## 3. Run the validation gates

Scale to the change (same rules as AGENTS.md):

- Anything: `npm run lint` + `npm run check` (mandatory).
- Routes/UI/layout/terminal: add `npm run test:e2e`; rendering/build-affecting: `npm run build` (and `BASE_PATH=… npm run build` for deploy shape).
- Dependencies changed: `make preflight` and the `dependabot` skill's analysis instead.

Report results as a table; a red gate means the review does NOT pass and the commit decision is blocked.

## 4. Present the decision (three choices)

After a passing review, summarize (files changed, gates green, risks/notes) and ask the user to pick **exactly one**:

1. **仅 commit** — stage the reviewed files precisely, commit with a conventional message, stop. (Never push, never publish.)
2. **提交并发布** — commit first, then hand over to the `release` skill (`make release [BUMP=…]`), which handles preflight + `npm version` + tag + push + Actions monitoring. Release assumes the reviewed commit is on `main` and the tree is clean; it does not re-review or commit feature code.
3. **暂不处理** — leave the working tree exactly as-is (no staging, no commit); optionally record a vault journal note (`notes` skill) with what was done and why it is held.

## Rules

- No commit happens in step 1–3 of this skill; the commit (if chosen) is executed only after the explicit user choice.
- "仅 commit" never pushes or tags; "提交并发布" paths through the `release` skill rather than committing ad hoc.
- If the user asks for changes mid-review, switch back to implementation, then re-run this skill.
- Never merge the three options, never pick for the user, never fall through to auto-commit.
