# Release workflow — see .agents/skills/release/SKILL.md.
#
#   make release            # patch bump (also: BUMP=minor, BUMP=major)
#   make preflight          # validation gates only

BUMP ?= patch
# Repository name used for the BASE_PATH deploy-shape build (override when the
# GitHub repository is not "blog").
REPO_NAME ?= blog

.PHONY: release preflight

# Release: pre-flight, then the native npm versioning flow —
#   npm version <bump> -m "Release v%s"
# bumps package.json + package-lock.json, commits "Release vX.Y.Z" and tags
# vX.Y.Z in one atomic step (singleton source of truth), then `git push
# --follow-tags` ships the commit and the tag. npm version refuses to run on
# a dirty working tree, so commit/stash any WIP first.
release: preflight
	npm version $(BUMP) -m "Release v%s"
	git push --follow-tags
	@echo "✓ released v$$(node -p 'require(\"./package.json\").version')"

preflight:
	npm run check
	npm run lint
	npm run test:unit -- --run
	npm run test:e2e
	npm run build
	BASE_PATH=/$(REPO_NAME) npm run build
	node .agents/skills/release/scripts/ci-engine-check.mjs
	@echo '✓ pre-flight passed'
