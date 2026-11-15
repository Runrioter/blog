import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export const headingSlug = (/** @type {string} */ text) =>
	text
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\p{L}\p{N}-]/gu, '');

// mdsvex (installed version) applies no heading ids by default; prerendered
// pages need them for in-page anchors. Zero-dependency rehype plugin.
export function rehypeHeadingIds() {
	// rehype plugin factory
	/** @type {any} */ let visit;
	const seen = new Map();
	return (/** @type {any} */ tree) => {
		visit = (/** @type {any} */ node) => {
			if (node.type === 'element' && /^h[1-6]$/.test(node.tagName ?? '')) {
				const id = headingSlug(
					node.children?.map((/** @type {any} */ c) => c.value ?? '').join('') ?? ''
				);
				const count = seen.get(id) ?? 0;
				seen.set(id, count + 1);
				node.properties = node.properties ?? {};
				node.properties.id = count === 0 ? id : `${id}-${count}`;
			}
			for (const child of node.children ?? []) visit(child);
		};
		visit(tree);
	};
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex({ rehypePlugins: [rehypeHeadingIds] })],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		},
		prerender: {
			handleHttpError: ({ message }) => {
				throw new Error(message);
			}
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
