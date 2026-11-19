# Release workflow — see .agents/skills/release/SKILL.md.
#
#   make release            # patch bump
#   make release BUMP=minor # minor bump
#   make release BUMP=major # major bump
#   make preflight          # validation gates only

BUMP ?= patch
# Repository name used for the BASE_PATH deploy-shape build (override when the
# GitHub repository is not "blog").
REPO_NAME ?= blog

.PHONY: release preflight

# Tag the release only after package.json (and package-lock.json) carry the new
# version, per npm project convention. `npm version --no-git-tag-version` bumps
# the files without committing or tagging; `git release` commits, tags and
# pushes. A final check guarantees the tag and package.json agree.
release: preflight
	npm version $(BUMP) --no-git-tag-version
	git release --semver $(BUMP)
	@[ "v$$(node -p "require('./package.json').version")" = "$$(git describe --tags --abbrev=0)" ] \
		|| (echo 'ERROR: package.json version and git tag diverged' >&2 && exit 1)
	@echo "✓ released v$$(node -p "require('./package.json').version")"

preflight:
	npm run check
	npm run lint
	npm run test:unit -- --run
	npm run test:e2e
	npm run build
	BASE_PATH=/$(REPO_NAME) npm run build
	node .agents/skills/release/scripts/ci-engine-check.mjs
	@echo '✓ pre-flight passed'
