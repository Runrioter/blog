---
name: dependabot
description: Review and merge GitHub dependabot dependency-update PRs — check staleness and conflicts, read the changelog, classify each update (safe / needs adaptation / incompatible), run the full validation gates, refactor for breaking changes when feasible, and file a report in the vault for severe breakage. Use when dependabot opens a PR or when asked to audit, review, or merge dependency updates.
---

# Dependabot PR review & merge

Dependabot opens daily `dependencies`-labelled PRs (`.github/dependabot.yml`, npm ecosystem). Nothing is merged without the full validation gates and a classification decision.

## 1. Discover

```sh
gh pr list --state open --label dependencies
```

## 2. Audit each PR (decision pipeline)

```sh
gh pr view <n> --json title,body,mergeable,mergeStateStatus,headRefName
gh pr diff <n> --name-only        # must be only package.json + package-lock.json
```

Decide, in order:

1. **Scope** — PR must touch only `package.json`/`package-lock.json`. Anything else: require the human, do not merge.
2. **Staleness** — compare the PR's target version against the version already resolved in `main`'s lockfile (`node -p "require('./package-lock.json').packages['node_modules/<pkg>'].version"`). If the target is **≤ the installed version**, the PR is stale (the baseline moved past it — common after major upgrades like the kit 2→3 jump). **Close with a comment**; do not rebase.
3. **Conflict** — `mergeable=CONFLICTING` on a _fresh_ PR: ask for a rebase (`gh pr comment <n> --body "@dependabot rebase"`), poll `mergeable` until `CLEAN` (or ~5 min timeout); if it stays dirty, close with a comment.
4. **Breaking analysis** — read the release notes from the PR body (dependabot embeds them) or `gh release view <pkg> --repo <owner>/<repo>`. A **major** bump, an `engines` change, or any note touching APIs we use ⇒ breaking candidate. Cross-check the pinned constraints in AGENTS.md (e.g. typescript `~6.0.3` — TS 7 breaks svelte-check; xterm 6 removed `wordWrap`; node ≥22.17 for kit 3).
5. **Classify**:
   - **safe** — patch/minor with no breaking notes → verify + merge.
   - **adapt** — breaking but our codebase can be refactored (or config can absorb it) → refactor on the PR branch, verify, merge. Update AGENTS.md gotchas if the change teaches a durable constraint.
   - **report** — severe incompatibility / would require changes we should not make unilaterally → leave the PR open, summarize it in a comment, and file a report (below).

## 3. Verify + merge

```sh
gh pr checkout <n>          # or: git fetch origin pull/<n>/head && git checkout -b dp-<n> FETCH_HEAD
npm ci
make preflight              # check, lint, unit, e2e, build, BASE_PATH build, ci-engine-check
gh pr merge <n> --squash --delete-branch
```

- Always `make preflight` (the BASE_PATH deploy-shape build and e2e are the deploy guard). If preflight fails on the unmodified PR branch, **stop** and triage: the change is not safe.
- After each merge: `git switch main && git pull && npm ci` so the next PR diffs against the fresh baseline.
- Merge **one PR at a time**, lowest-risk first; watch for lockfile cascade conflicts (later PRs may need a dependabot rebase after an earlier merge).
- Never force-push, never merge with failing checks, never use admin-merge to bypass CI.

## 4. Severe-incompatibility report

When a dependency cannot be adopted without unacceptable disruption:

1. Write the report as a vault note via the `obsidian` MCP server (never reaches the site):
   `journal/<yyyy-mm-dd>-dependabot-<pkg>-report.md`, frontmatter per the `notes` skill contract (`title`, `draft: true`, `created`, `updated`).
2. Report contents: PR number, package, version span, breaking summary (release-note excerpts), impact on this repo (files/components affected), options (pin, wait for a compatible release, swap dependency), and a recommendation.
3. Leave the PR open with a comment summarizing the blocker; mention the report path.

## 5. Batch conventions

- Process oldest PRs first; close stale ones before rebasing fresh ones so dependabot's rebases land on a settled baseline.
- Purge decision ownership: you may close **stale** PRs and merge **safe** ones autonomously; anything requiring **adapt** or **report** is surfaced to the user (report in chat + vault), even if you proceed with the trivial version of it.
