import { execSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import type { Config } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { rehypeHeadingIds } from './scripts/heading-slug.js';
import tailwindcss from '@tailwindcss/vite';
import pkg from './package.json';

/**
 * The shipped release version = the latest `v*` git tag (the deployment is
 * tag-driven; package.json's version stays at the npm initial value). Falls
 * back to package.json when there is no tag (fresh clone) or no git.
 */
function appVersion(): string {
	try {
		const tag = execSync('git describe --tags --abbrev=0 --match "v*"', {
			stdio: ['ignore', 'pipe', 'ignore']
		})
			.toString()
			.trim()
			.replace(/^v/, '');
		return tag || pkg.version;
	} catch {
		return pkg.version;
	}
}

/**
 * SvelteKit 3 reads configuration from the `sveltekit(...)` plugin —
 * `svelte.config.js` is no longer used.
 */
const kitConfig: Config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex({ rehypePlugins: [rehypeHeadingIds] })],
	// SvelteKit 3: `adapter`/`paths`/`prerender` are top-level, no `kit` namespace.
	adapter: adapter({
		pages: 'build',
		assets: 'build',
		fallback: '404.html',
		precompress: false,
		strict: true
	}),
	paths: {
		// BASE_PATH is set to `/<repo-name>` by the GitHub Pages deployment workflow.
		base: process.argv.includes('dev')
			? ''
			: ((process.env.BASE_PATH as '' | `/${string}` | undefined) ?? '')
	},
	prerender: {
		handleHttpError: ({ message }) => {
			throw new Error(message);
		}
	},
	extensions: ['.svelte', '.svx']
};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(kitConfig)],

	define: {
		// Injected at compile time, like __SVELTEKIT_PATHS_BASE__; declared in
		// src/app.d.ts and known to eslint (see eslint.config.js).
		__APP_VERSION__: JSON.stringify(appVersion())
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
