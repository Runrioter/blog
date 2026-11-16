#!/usr/bin/env node
/**
 * Cross-check the GitHub Pages workflow's node-version against the engines
 * ranges of the packages that actually execute during `npm run build`
 * (as locked in package-lock.json). Catches workflow/dependency version
 * skew before it costs a failed deploy (e.g. the v0.0.8 node-20 failure,
 * where @sveltejs/kit 3.2 requires node >=22.17).
 *
 * The satisfaction check is deliberately approximate: for `>=A.B.C` ranges it
 * accepts major == A (assuming the newest patch of that major satisfies it).
 * That is the right direction for this use — the workflow installs the
 * newest patch of the pinned major.
 *
 * Usage: node ci-engine-check.mjs [workflow-file]   (default: .github/workflows/gh-deploy.yml)
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// .agents/skills/release/scripts → repo root is four levels up.
const root = resolve(here, '..', '..', '..', '..');
const wfPath = resolve(process.argv[2] ?? join(root, '.github/workflows/gh-deploy.yml'));

if (!existsSync(wfPath)) {
	console.log(`no workflow at ${wfPath} — nothing to check`);
	process.exit(0);
}

const text = readFileSync(wfPath, 'utf8');
const match = text.match(/node-version:\s*["']?(\d+)/);
if (!match) {
	console.log('no numeric node-version found in workflow — nothing to check');
	process.exit(0);
}
const wfMajor = Number(match[1]);

const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));

// Packages that execute during the build (or whose tooling the user runs).
const relevant = [
	'@sveltejs/kit',
	'vite',
	'@sveltejs/adapter-static',
	'@sveltejs/vite-plugin-svelte',
	'svelte',
	'typescript',
	'eslint',
	'vitest'
];

/** Does any term in an engines range cover the pinned major? */
function coversMajor(range, major) {
	return String(range)
		.split('||')
		.map((t) => t.trim())
		.filter(Boolean)
		.some((term) => {
			const m = term.match(/^(>=|>|\^|~)?\s*(\d+)/);
			if (!m) return true; // unparseable — don't false-alarm
			const [, op, a] = m;
			const aMajor = Number(a);
			if (op === '^' || op === '~' || op === undefined) return major === aMajor;
			if (op === '>') return major > aMajor;
			return major >= aMajor; // ">=", approximate as documented above
		});
}

let failed = 0;
let minMajor = wfMajor;

for (const name of relevant) {
	const entry = lock.packages?.[`node_modules/${name}`];
	const version = entry?.version;
	const engines = entry?.engines?.node;
	if (!version || !engines) {
		console.log(`  ${name}: no engines constraint — ok`);
		continue;
	}
	const ok = coversMajor(engines, wfMajor);
	console.log(`${ok ? '  ok' : 'FAIL'}  ${name}@${version}  needs node ${engines}`);
	if (!ok) {
		failed += 1;
		minMajor = Math.max(
			minMajor,
			...String(engines)
				.matchAll(/(\d+)/g)
				.map(([, a]) => Number(a))
		);
	}
}

console.log(`\nworkflow node-version: ${wfMajor}`);
if (failed > 0) {
	console.error(`\n${failed} package(s) need a newer Node. Suggest: node-version: ${minMajor}`);
	process.exit(1);
}
console.log('all build-time dependencies run on the pinned Node.');
