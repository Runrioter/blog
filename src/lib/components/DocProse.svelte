<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = '',
		onElement
	}: {
		children: Snippet;
		class?: string;
		onElement?: (element: HTMLElement | undefined) => void;
	} = $props();

	let element: HTMLElement | undefined;

	$effect(() => {
		onElement?.(element);
	});
</script>

<section
	bind:this={element}
	class={`doc-prose prose prose-headings:scroll-mt-24 prose-headings:font-semibold max-w-none pt-3 pb-6 ${className}`}
>
	{@render children()}
</section>

<style>
	/* Map the typography plugin's palette to the theme tokens (the plugin
	 * reads --tw-prose-* on the .prose element). No prose-invert needed: the
	 * tokens already flip with light/dark. */
	.doc-prose {
		--tw-prose-body: var(--fg-muted);
		--tw-prose-headings: var(--fg);
		--tw-prose-lead: var(--fg-muted);
		--tw-prose-links: var(--link);
		--tw-prose-bold: var(--fg);
		--tw-prose-counters: var(--fg-faint);
		--tw-prose-bullets: var(--fg-faint);
		--tw-prose-hr: var(--border);
		--tw-prose-quotes: var(--fg-muted);
		--tw-prose-quote-borders: var(--border);
		--tw-prose-captions: var(--fg-faint);
		--tw-prose-code: var(--fg);
		--tw-prose-pre-code: var(--fg);
		--tw-prose-pre-bg: var(--bg-panel);
		--tw-prose-th-borders: var(--border);
		--tw-prose-td-borders: var(--border-soft);
	}

	.doc-prose :global(h1),
	.doc-prose :global(h2),
	.doc-prose :global(h3) {
		font-family: var(--font-mono);
	}

	.doc-prose :global(a) {
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: color-mix(in srgb, var(--link) 40%, transparent);
	}

	.doc-prose :global(a:hover) {
		color: var(--link-hover);
	}

	.doc-prose :global(pre) {
		border: 1px solid var(--border);
		border-radius: 0.25rem;
	}

	:global(.doc-prose :target) {
		scroll-margin-top: 6rem;
		background: color-mix(in oklab, var(--link) 18%, transparent);
		border-radius: 0.25rem;
	}
</style>
