---
name: release
description: Ship a blog release from an already-committed, clean tree — full pre-flight validation (including the BASE_PATH deploy-shape build and a CI engine check), then `make release` (native `npm version` bump + tag + push) and monitor the GitHub Pages Actions run. Use when cutting a tag, running `make release`, deploying, or investigating a failed Pages deployment. Scope is release only — review/committing feature code belongs to the `review` skill.
---

# Release (GitHub Pages deploy)

Deployment is **tag-only**: the `GitHub Pages` workflow (`.github/workflows/gh-deploy.yml`) runs on `v*.*.*` tags. Pushing `main` alone deploys nothing — config/workflow fixes need a new tag to take effect.

## 1. Release (pre-flight + tag in one Makefile target)

From the repo root:

```sh
make release             # patch bump
make release BUMP=minor  # minor bump (BUMP=major for major)
make preflight           # validation gates only
```

The `release` target (see `Makefile`) runs the full pre-flight, then the **native npm versioning flow**:

1. `npm version <bump> -m "Release v%s"` — bumps `package.json` + `package-lock.json`, commits `Release vX.Y.Z` and tags `vX.Y.Z` in one atomic step (npm only commits the version files and requires a clean working tree — commit/stash any WIP first).
2. `git push --follow-tags` — ships the commit and the tag.

`package.json`'s version is the single source of truth — it must equal the latest tag before bumping (kept in sync by this flow; if it ever drifts, align it manually first: `npm version 0.0.X --no-git-tag-version`, commit, then release).

Pre-flight gates (never skip): `npm run check`, `npm run lint`, `npm run test:unit -- --run`, `npm run test:e2e`, `npm run build`, `BASE_PATH=/<repo> npm run build`, `node .agents/skills/release/scripts/ci-engine-check.mjs`.

- The `BASE_PATH` build is the only local approximation of what production ships. Link/resolve bugs (double base like `/blog/blog/x`, missing base) only surface there — never skip it. The Makefile defaults `REPO_NAME=blog`; override with `make release REPO_NAME=<name>` for other remotes.
- `ci-engine-check` compares the workflow's `node-version` against the `engines` ranges of the packages that run during the build. It is the check that would have caught the v0.0.8 failure (workflow pinned node 20 while `@sveltejs/kit` 3.2 requires `>=22.17`). If it fails, bump `node-version` in the workflow (24 is the current LTS and the local version).
- Failure notes: if `npm version` fails **after** committing (e.g. the new tag already exists), it leaves the commit and the bumped files behind — `git reset --hard HEAD~1` rolls both back. A dirty working tree makes `npm version` refuse to start (by design). A failed `git push` is safe to just retry.

## 3. Post-release

Watch the `GitHub Pages` run for the new tag (Actions tab or `gh run list --workflow "GitHub Pages"`). On failure, diagnose by class:

| Failure class    | Typical symptom                                    | Fix                                                                                                                |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Engine / install | `EBADENGINE`, install crash                        | run `ci-engine-check.mjs`; bump workflow `node-version`                                                            |
| Lock drift       | `npm ci` "out of sync"                             | `npm install` locally to refresh the lock, commit it, re-tag                                                       |
| Prerender link   | `prerender_http_error` / `... was linked from ...` | reproduces in the local `BASE_PATH` build — fix the link source (see the `visual-check` skill for probing), re-tag |
| Action version   | checkout/setup-node/upload failure                 | bump the action major in the workflow, re-tag                                                                      |

## Rules

- Never push a tag before the `BASE_PATH` build passes.
- Never hand-edit `build/` or `.svelte-kit/` — they are regenerated artifacts.
- After a green deploy, spot-check the live site (`/skill:visual-check` against the deployed URL, or a quick browser check of a deep route like `/blog/ai/basics`).
