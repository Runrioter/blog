<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Block formatting context</title>
	<meta name="description" content="Block formatting context" />
</svelte:head>

<h1>Block Formatting Context</h1>

<div class="mx-auto my-10">
	<div class="box">
		<div class="float mb-2">float: left</div>
		<div class="text-center">No Block Formatting Context</div>
	</div>
	<div class="box clear-left flex">
		<div class="float">float: left</div>
		<div class="mx-2 flex items-center">
			use&nbsp;<code>flex</code>&nbsp;to create Block formatting context
		</div>
	</div>
</div>

<style lang="postcss">
	.box {
		@apply mt-2 border border-red-600;
	}
	.float {
		@apply float-left flex h-[100px] w-[100px] flex-col items-center justify-center text-nowrap bg-amber-200;
	}
</style>
