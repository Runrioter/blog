<script lang="ts">
	let { children } = $props();

	let flipped = $state(false);

	function flip(event: Event) {
		event.preventDefault();
		flipped = !flipped;
	}
</script>

<div
	role="none"
	onclick={flip}
	class={['transition duration-1000 transform-flat', flipped ? 'rotate-y-180' : 'rotate-y-0']}
>
	{#if children}
		{@render children()}
	{:else}
		<p>fallback content</p>
	{/if}
</div>
