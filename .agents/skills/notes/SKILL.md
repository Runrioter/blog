---
name: notes
description: Record and search project knowledge in the local Obsidian vault through the obsidian MCP server — write project/journal notes, decisions, and research without publishing them to the site. Use when the user asks to note/remember/record something in Obsidian, or when a session produced knowledge worth persisting (architecture decisions, gotchas, release notes).
---

# Notes (Obsidian vault via MCP)

The vault is `content/` (git-ignored). It is wired to the `obsidian` MCP server (project config `.pi/mcp.json`, vault id **`blog`**).

Check the connection first if a tool call fails: `pi mcp list` (the server spawns `npx -y obsidian-mcp@2 serve --vault blog=$PWD/content`; it needs `content/.obsidian/` to exist — it does).

## Where to write

| Kind                                   | Path                             | Frontmatter                                           | Published?                                                                                           |
| -------------------------------------- | -------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Project journal / decisions / research | `journal/<yyyy-mm-dd>-<slug>.md` | `title`, `publish: false`                             | **No** — `publish: false` keeps it in the vault but `content:sync` skips it (no route, no TOC entry) |
| Blog prose                             | `ai/<name>.md`, `aws/<name>.md`  | `title` (required), `description`, `order` (TOC sort) | Yes — becomes `/{section}/{name}`                                                                    |

Rules:

- `publish: false` is the only safe way to keep a note out of the site. A note in `journal/` **without** it would be published as a live route.
- Never write to `.obsidian/` (reserved by the server) and never write outside the vault.
- Paths are vault-relative with forward slashes, no leading slash (`ai/basics.md`).
- Prefer the MCP tools over plain file writes for vault notes: `obsidian_create_note` / `obsidian_edit_note` (append/prepend/replace) keep the vault Obsidian-consistent and journal every mutation (recoverable via `obsidian-mcp recovery list/restore`). Plain `write`/`edit` tools also work for plain markdown, but skip the etag/conflict guard.
- `obsidian_edit_note` takes an optional `if_match` (etag from `obsidian_read_note`) — pass it when editing a note you just read, so a concurrent Obsidian edit is not clobbered.

## After writing

- Publishing a note (no `publish: false`) → run `npm run content:sync` and commit the regenerated `.svx`/`toc.ts` (see the `content-update` skill).
- a journal note → nothing to build; it never reaches the site.
- Never hand-edit generated `.svx`/`toc.ts` — edit the vault note and re-sync.
