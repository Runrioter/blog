/**
 * CJK-friendly heading slug (github-slugger style) used by scripts/sync-content.ts
 * to resolve Obsidian `[[note#heading]]` fragments, and kept in sync with
 * mdsvex 1.x built-in heading_ids (same algorithm), so
 * `[[note#heading]]` links land on the same ids. Headings get a dedup suffix
 * when the text repeats.
 */
export const headingSlug = (/** @type {string} */ text) =>
	text
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\p{L}\p{N}-]/gu, '');
