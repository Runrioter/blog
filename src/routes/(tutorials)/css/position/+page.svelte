<script lang="ts">
	import Square from '$lib/components/Square.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>CSS - Position</title>
	<meta name="description" content="CSS: Position" />
</svelte:head>

<h1 class="w-full text-center text-[2rem] font-normal">CSS: Position</h1>

<p class="mx-10">
	The `absolute` element is removed from the normal document flow, and no space is created for the
	element in the page layout. The element is positioned relative to its closest <b>positioned</b> ancestor
	(if any) or to the initial containing block. Its final position is determined by the values of top,
	right, bottom, and left.
</p>

<blockquote class="m-10 rounded-sm bg-blue-200 p-4 text-sm">
	A <b>positioned</b> element is an element whose computed position value is either relative, absolute,
	fixed, or sticky. (In other words, it's anything except static.)
</blockquote>

<div class="mx-auto my-10">
	<div class="flex flex-col gap-16">
		<div class="mt-2">
			<div class="relative size-fit bg-amber-400">
				<div>Position: relative</div>
				<Square text="L" position="left" />
			</div>
		</div>
		<div class="mt-2">
			<div class="relative size-fit bg-amber-400">
				<div>Position: relative</div>
				<Square text="R" position="right" />
			</div>
		</div>
		<div class="mt-2">
			<div class="relative size-fit bg-amber-400">
				<div>Position: relative</div>
				<Square text="T" position="top" />
			</div>
		</div>
		<div class="mt-2">
			<div class="relative size-fit bg-amber-400">
				<div>Position: relative</div>
				<Square text="B" position="bottom" />
			</div>
		</div>
	</div>
</div>
