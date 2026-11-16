---
name: release
description: Ship a blog release — full pre-flight validation (including the BASE_PATH deploy-shape build and a CI engine check), then `git release` and monitor the GitHub Pages Actions run. Use when cutting a tag, running `git release`, deploying, or investigating a failed Pages deployment.
---

# Release (GitHub Pages deploy)

Deployment is **tag-only**: the `GitHub Pages` workflow (`.github/workflows/gh-deploy.yml`) runs on `v*.*.*` tags. Pushing `main` alone deploys nothing — config/workflow fixes need a new tag to take effect.

## 1. Pre-flight (all must pass, from repo root)

```sh
npm run check                                             # svelte-check: 0 errors
npm run lint                                              # prettier + eslint: 0 errors
npm run test:unit -- --run
npm run test:e2e
npm run build                                             # dev shape (base '')
BASE_PATH="/${GITHUB_REPO_NAME:-blog}" npm run build      # deploy shape
node .agents/skills/release/scripts/ci-engine-check.mjs   # workflow node-version vs lockfile engines
```

- The `BASE_PATH` build is the only local approximation of what production ships. Link/resolve bugs (double base like `/blog/blog/x`, missing base) only surface there — never skip it. Use the real repository name for `BASE_PATH` when known.
- `ci-engine-check` compares the workflow's `node-version` against the `engines` ranges of the packages that run during the build. It is the check that would have caught the v0.0.8 failure (workflow pinned node 20 while `@sveltejs/kit` 3.2 requires `>=22.17`). If it fails, bump `node-version` in the workflow (24 is the current LTS and the local version).

## 2. Release

```sh
git release --semver patch   # or minor/major — commits "Release vX.Y.Z", tags, pushes
```

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
