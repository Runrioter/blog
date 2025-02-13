<script lang="ts">
	import Square from '$lib/components/Square.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>CSS - Contain</title>
	<meta name="description" content="CSS: Contain" />
</svelte:head>

<h1 class="w-full text-center text-[2rem] font-normal">Contain</h1>

<p>
	`contain: layout`: The internal layout of the element is isolated from the rest of the page. This
	means nothing outside the element affects its internal layout, and vice versa.
</p>

<blockquote class="rounded-sm bg-blue-200 p-4 text-sm">
	Using `layout`, `paint`, `strict` or `content` values for this property creates: A new containing
	block (for the descendants whose position property is absolute or fixed).
</blockquote>

<div class="mx-auto my-10">
	<div class="border-2 border-dotted border-amber-800">
		<div>With `contain: layout`, L overlaps the text of the second element</div>
		<div class="mt-2">
			<div class="h-6 bg-amber-400 contain-layout">
				<div>Some element</div>
				<Square text="L" float="left" />
			</div>
		</div>
		<div class="mt-2">
			<div class="bg-amber-400">
				<div>Some element</div>
			</div>
		</div>
	</div>

	<div class="mt-10 border-2 border-dotted border-amber-800">
		<div>Without `contain: layout`, L <b>doesn't</b> overlap the text of the second element</div>
		<div class="mt-2">
			<div class="h-6 bg-amber-400">
				<div>Some element</div>
				<Square text="L" float="left" />
			</div>
		</div>
		<div class="mt-2">
			<div class="bg-amber-400">
				<div>Some element</div>
			</div>
		</div>
	</div>
</div>

<style></style>
