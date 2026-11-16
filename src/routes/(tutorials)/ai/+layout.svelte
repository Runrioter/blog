<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import DocProse from '#lib/components/DocProse.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const aiEntryPath = resolve('ai');
	const isAiEntryRoute = () => page.url.pathname === aiEntryPath;
</script>

{#if isAiEntryRoute()}
	<div class="grow">
		{@render children()}
	</div>
{:else}
	<DocProse>
		{@render children()}
	</DocProse>
{/if}
