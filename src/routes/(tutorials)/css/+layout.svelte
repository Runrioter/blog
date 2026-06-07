<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import DocProse from '$lib/components/DocProse.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const cssEntryPath = resolve('/css');
	const isCssEntryRoute = () => page.url.pathname === cssEntryPath;
</script>

{#if isCssEntryRoute()}
	<div class="grow">
		{@render children()}
	</div>
{:else}
	<DocProse>
		{@render children()}
	</DocProse>
{/if}
