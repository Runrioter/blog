import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import type { Config } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { rehypeHeadingIds } from './scripts/heading-slug.js';
import tailwindcss from '@tailwindcss/vite';

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

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
