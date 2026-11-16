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
	class={`doc-prose prose prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:text-slate-100 prose-p:text-slate-300 prose-li:text-slate-300 prose-a:text-[#58a6ff] prose-a:underline prose-a:decoration-[#58a6ff]/40 prose-a:underline-offset-2 prose-a:hover:text-[#79b8ff] prose-strong:text-slate-100 prose-code:text-slate-100 prose-pre:rounded-sm prose-pre:border prose-pre:border-[#30363d] prose-pre:bg-[#161b22] max-w-none pt-3 pb-6 ${className}`}
>
	{@render children()}
</section>

<style>
	.doc-prose :global(h1),
	.doc-prose :global(h2),
	.doc-prose :global(h3) {
		font-family: var(--font-mono);
	}

	:global(.doc-prose :target) {
		scroll-margin-top: 6rem;
		background: color-mix(in oklab, rgb(51 65 85) 55%, transparent);
		border-radius: 0.25rem;
	}
</style>
