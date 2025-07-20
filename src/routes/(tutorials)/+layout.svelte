<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="mx-2 grow border-y border-slate-200">
	<div class="mx-auto max-w-3xl">
		{@render children()}
	</div>
</div>
