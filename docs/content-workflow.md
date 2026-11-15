# Content Workflow (Obsidian)

All prose tutorial content (`ai/*`, `aws/*`, and any future sections) is **authored in a local
Obsidian vault at `content/`** (git-ignored) and **generated into `src/routes/(tutorials)/`**
by `scripts/sync-content.ts`.

## The loop

1. Open `content/` as an Obsidian vault (Open folder as vault). Write notes as plain Markdown.
2. Run `npm run content:sync` (or `npm run content:watch` while writing).
3. Commit the **generated** files — `+page.svx` and `toc.ts` — like any other source. The vault
   itself never goes into git; new machines clone the repo and create their own `content/`.

Never edit generated `+page.svx` files directly — they carry a `GENERATED` marker and will be
overwritten. If a note is deleted from the vault, the sync script deletes its stale generated
page (only files with the marker are ever deleted; hand-written pages are safe).

## Vault conventions

```
content/
├── ai/
│   ├── basics.md          →  route /ai/basics/   (src/routes/(tutorials)/ai/basics/+page.svx)
│   └── attachments/       →  images copied to static/uploads/ai/
└── aws/
    └── cloudformation.md  →  route /aws/cloudformation/
```

- Folder = route section, note basename = route segment. Vault root level notes map to
  `/<name>/`.
- Frontmatter (simple `key: value` YAML only):
  - `title` — page `<title>`, TOC label, wikilink label (defaults to the filename)
  - `description` — meta description
  - `order` — TOC sort order (default 1000; use 1, 2, 3… for editorial ordering)
- `[[wikilinks]]` resolve by note **basename** (same as Obsidian) and become relative links, so
  they work under the GitHub Pages subpath without `base` handling.
- `![[image.png]]` (or `![](relative/path)`) is copied to `static/uploads/<section>/` and
  rewritten to a relative path — no base-path handling needed.
- Callouts (`> [!note] …`) degrade to plain blockquotes.
- Keep Obsidian to **core features only**: inline `#tags`, `++highlight++`, math, and
  community-plugin syntax are not transformed and will render literally.

## Generated output

- `src/routes/(tutorials)/<section>/<name>/+page.svx` — mdsvex page: marker comment, empty
  `<script lang="ts">` header, optional `<svelte:head>` (title/description), transformed body.
- `src/routes/(tutorials)/<section>/toc.ts` — `tocItems` consumed by section layouts (e.g.
  `ai/+layout.svelte`). Add a new note and the TOC updates automatically.

## Out of scope

Interactive pages (e.g. the `css/*` tutorials with live Svelte demos) stay hand-written in
`src/routes/` — they cannot be represented as Markdown.

## Validation

Sync fails (writing nothing) if a wikilink/embed cannot be resolved, so broken links never reach
the build. As usual, run `npm run check` and `npm run lint` after syncing, and `npm run build`
before deploying (the strict static adapter also fails the build on any 404).
