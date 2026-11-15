/**
 * CJK-friendly heading slug (github-slugger style) shared by the mdsvex rehype
 * plugin (vite.config.ts) and scripts/sync-content.ts, so Obsidian
 * `[[note#heading]]` links land on the same ids. Headings get a dedup suffix
 * when the text repeats.
 */
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
