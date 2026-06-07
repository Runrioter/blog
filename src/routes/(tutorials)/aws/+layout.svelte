<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import DocProse from '$lib/components/DocProse.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const awsEntryPath = resolve('/aws');
	const isAwsEntryRoute = () => page.url.pathname === awsEntryPath;
</script>

{#if isAwsEntryRoute()}
	<div class="grow">
		{@render children()}
	</div>
{:else}
	<DocProse>
		{@render children()}
	</DocProse>
{/if}
