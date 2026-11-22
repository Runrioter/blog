---
name: notes
description: Record and search project knowledge in the local Obsidian vault through the obsidian MCP server — write project/journal notes, decisions, and research without publishing them to the site. Use when the user asks to note/remember/record something in Obsidian, or when a session produced knowledge worth persisting (architecture decisions, gotchas, release notes).
---

# Notes (Obsidian vault via MCP)

The vault is `content/` (git-ignored). It is wired to the `obsidian` MCP server (project config `.pi/mcp.json`, vault id **`blog`**).

Check the connection first if a tool call fails: `pi mcp list` (the server spawns `npx -y obsidian-mcp@2 serve --vault blog=$PWD/content`; it needs `content/.obsidian/` to exist — it does).

## Note naming

Descriptive kebab-case slug, **no date in the filename** — time lives in frontmatter, not in the name (rename-friendly, duplicate-free, sort stable across days):

```
journal/obsidian-mcp.md          ✓  (kebab-case slug)
journal/2026-11-18-obsidian-mcp.md  ✗  (date in filename)
```

Blog prose follows the same rule: `ai/<slug>.md`, `aws/<slug>.md` (the note basename becomes the route segment).

## Frontmatter contract (MANDATORY for every note)

| Field         | Required     | Format                                       | Notes                                                                                                                                                    |
| ------------- | ------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | ✅           | single-line string                           | Human title; journal → short phrase, prose → page `<title>` + TOC label                                                                                  |
| `draft`       | ✅ (journal) | `true` for journal/agent notes               | `true` = stays in vault, `content:sync` skips it. **A journal note without it becomes a live route**. Prose notes: omit or `false` (default = published) |
| `created`     | ✅           | `YYYY-MM-DD` (ISO date; may append `THH:mm`) | Creation date — set once when the note is created                                                                                                        |
| `updated`     | ✅           | `YYYY-MM-DD` (ISO date; may append `THH:mm`) | **Must be refreshed to today on every content edit**                                                                                                     |
|               |              |                                              | _Applies to prose notes too — the sync ignores these extra keys_                                                                                         |
| `description` | optional     | single-line string                           | Prose notes: meta description (synced to the page)                                                                                                       |
| `order`       | optional     | integer                                      | Prose notes: TOC sort order (default 1000)                                                                                                               |
| `tags`        | optional     | array (inline `[a, b]` or block `- a`)       | Prose notes: rendered as pill badges on the article page (display-only). Journal notes: metadata for Obsidian search, never rendered                     |

Template for a new journal/agent note:

```markdown
---
title: <short phrase>
draft: true
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <title>

## YYYY-MM-DD

- <what was decided / learned / done> …
```

- `created` is set to the current date at creation and never changes afterwards.
- Every time the note is edited (content changed), set `updated` to the current date **in the same edit**.
- Arrays **are** supported in frontmatter — both inline (`tags: [ai, "deep learning"]`) and block (`tags:\n  - ai\n  - aws`) forms; elements may be quoted strings, numbers, or booleans. Use them for `tags` on journal notes. Keep everything else to simple `key: value` scalars.

## Where to write

| Kind                                   | Path                            | Published?                                                           |
| -------------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| Project journal / decisions / research | `journal/<slug>.md`             | **No** — `draft: true` keeps it in the vault; no route, no TOC entry |
| Blog prose                             | `ai/<slug>.md`, `aws/<slug>.md` | Yes — becomes `/{section}/{slug}`                                    |

## Rules

- Never write to `.obsidian/` (reserved by the server) and never write outside the vault.
- Paths are vault-relative with forward slashes, no leading slash (`ai/basics.md`).
- Prefer the MCP tools over plain file writes for vault notes: `obsidian_create_note` / `obsidian_edit_note` (append/prepend/replace) keep the vault Obsidian-consistent and journal every mutation (recoverable via `obsidian-mcp recovery list/restore`). Plain `write`/`edit` tools also work for plain markdown, but skip the etag/conflict guard.
- `obsidian_edit_note` takes an optional `if_match` (etag from `obsidian_read_note`) — pass it when editing a note you just read, so a concurrent Obsidian edit is not clobbered.
- Renaming a note: `obsidian_move_note` (updates backlinks transactionally). Prefer renaming over duplicating content.

## After writing

- Publishing a note (no `draft: true`) → run `npm run content:sync` and commit the regenerated `.svx`/`toc.ts` (see the `content-update` skill). Prose `tags` render as pill badges at the top of the generated page.
- A journal note → nothing to build; it never reaches the site.
- Never hand-edit generated `.svx`/`toc.ts` — edit the vault note and re-sync.
