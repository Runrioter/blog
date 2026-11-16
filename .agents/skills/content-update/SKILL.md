---
name: content-update
description: Update blog prose tutorials that are generated from the local Obsidian vault — edit content/ notes, run content:sync, review the generated diff, run the right validation gates, commit generated files. Use when adding or changing AI/AWS tutorial articles (the CSS tutorials are hand-written and skip the sync step).
---

# Content update (Obsidian vault → generated pages)

Full reference: `docs/content-workflow.md`. This is the operational sequence.

## 1. Edit the source notes

Edit in `content/` (the git-ignored Obsidian vault) — the source of truth for AI/AWS prose. Never edit the generated files to fix content.

## 2. Sync

```sh
npm run content:sync
```

Regenerates `src/routes/(tutorials)/{ai,aws}/…/+page.svx` and `toc.ts` from the vault.

## 3. Review the diff

```sh
git status --short
git diff --stat
```

Expect **only** `.svx` and `toc.ts` changes. Anything else in the diff means something went sideways — stop and investigate (a stray manual edit, a rename that broke links, a heading-slug change).

## 4. Validate (scale the gates to the change)

- Prose-only edit → `npm run check` + `npm run lint`.
- Added/renamed/removed a note (route or Toc structure changes) → also `npm run build` (prerendering fails the build on any dead generated link), and verify the terminal profile's `dirs`/`files`/`internalRoutes` in `#lib/terminal-profiles.ts` still mirror the route tree.

## 5. Commit

Commit the generated `.svx`/`toc.ts` (and any terminal-profile updates). Never commit anything from `content/`.

## Hard rules

- Generated files are rebuild artifacts: fix the note, re-sync; don't hand-patch a `+page.svx`.
- `content/` stays git-ignored on purpose.
- Heading slugs come from `scripts/heading-slug.js` — renaming a heading changes its anchor; links (in-vault links, ToC) are rewritten by the sync, but check the diff for surprises.
- CSS tutorials (`(tutorials)/css/…`) are hand-written Svelte components, not vault-generated — edit them directly; no sync step.
