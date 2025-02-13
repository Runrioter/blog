<script lang="ts">
	import type { PageData } from './$types';
	import { base } from '$app/paths';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>CSS</title>
	<meta name="description" content="About CSS" />
</svelte:head>

<h1 class="w-full text-center text-[2rem] font-normal">CSS</h1>

<div class="flex grow flex-col items-center">
	<ul class="list-disc">
		<li><a href="{base}/css/flex">Flex</a></li>
		<li><a href="{base}/css/position">Position</a></li>
		<li><a href="{base}/css/bfc">Block Formatting Context</a></li>
		<li><a href="{base}/css/contain">Contain</a></li>
	</ul>
</div>
