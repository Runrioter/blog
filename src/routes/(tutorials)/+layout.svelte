<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const terminalEntryRoutes = [resolve('/ai'), resolve('/css'), resolve('/aws')];
	const isTerminalEntryRoute = () => terminalEntryRoutes.includes(page.url.pathname);
</script>

{#if isTerminalEntryRoute()}
	<div class="grow">
		{@render children()}
	</div>
{:else}
	<div class="mx-2 grow border-y border-slate-700 bg-slate-950/40">
		<div class="mx-auto max-w-3xl">
			{@render children()}
		</div>
	</div>
{/if}
