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

A note with `publish: false` in its frontmatter is **kept in the vault but never published**: the sync
script skips it (no route, no TOC entry, logged as `○ skipped … (publish: false)`). Use it for
agent/project journal notes that should live in the vault without becoming a page.

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

## Vault access from agents (MCP)

The vault is also reachable by agents through the `obsidian` MCP server, configured in
`.pi/mcp.json`:

```json
{
	"mcpServers": {
		"obsidian": {
			"command": "sh",
			"args": ["-c", "exec npx -y obsidian-mcp@2 serve --vault blog=\"$PWD/content\""]
		}
	}
}
```

`obsidian-mcp` talks to the markdown files directly — the Obsidian app does **not** have to run. The
vault id is `blog`; tool paths are vault-relative (`ai/basics.md`, no leading slash). Check the
connection with `pi mcp list` (project servers load after `/reload`).

Tools: `obsidian_read_note` (returns a SHA-256 `etag` — pass it back as `if_match` to
`obsidian_edit_note`/`move`/`delete` for conflict-safe edits), `obsidian_create_note`,
`obsidian_edit_note` (append/prepend/replace), `obsidian_delete_note` (trash by default),
`obsidian_move_note`, `obsidian_create_directory`, `obsidian_search_vault` (content/filename/tag),
and the tag tools. See the `notes` skill (`.agents/skills/notes/SKILL.md`).

## Out of scope

Interactive pages (e.g. the `css/*` tutorials with live Svelte demos) stay hand-written in
`src/routes/` — they cannot be represented as Markdown.

## Validation

Sync fails (writing nothing) if a wikilink/embed cannot be resolved, so broken links never reach
the build. As usual, run `npm run check` and `npm run lint` after syncing, and `npm run build`
before deploying (the strict static adapter also fails the build on any 404).
