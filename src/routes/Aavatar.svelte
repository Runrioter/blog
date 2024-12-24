<script lang="ts">
	let { logo, href, alt = 'avatar' } = $props();

	let flipped = $state(false);

	function flip(event: Event) {
		event.preventDefault();
		flipped = !flipped;
	}
</script>

<div class="h-12 w-12">
	<a
		onclick={flip}
		style="transform-style: preserve-3d;"
		class="flex h-full w-full items-center justify-center"
		{href}
	>
		<img
			class="front absolute h-8 w-8 rounded-full object-contain transition duration-1000"
			style:transform={flipped ? 'rotateY(180deg)' : 'rotateY(0)'}
			src={logo}
			{alt}
		/>
	</a>
</div>

<style>
</style>
