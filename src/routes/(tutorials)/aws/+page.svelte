<script lang="ts">
	import type { PageData } from './$types';
	import { base } from '$app/paths';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>AWS</title>
	<meta name="description" content="About AWS" />
</svelte:head>

<h1 class="w-full text-center text-[2rem] font-normal">AWS</h1>

<div class="flex grow flex-col items-center">
	<ul class="list-disc">
		<li><a href="{base}/aws/cloudformation">CloudFormation</a></li>
	</ul>
</div>
