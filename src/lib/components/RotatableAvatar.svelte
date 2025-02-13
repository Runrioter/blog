<script lang="ts">
	import Rotatable from './Rotatable.svelte';

	let { logo, alt = 'avatar' } = $props();
</script>

<Rotatable>
	<div class="flex h-12 w-12 items-center justify-center">
		<img class="h-8 w-8 rounded-full object-contain" src={logo} {alt} />
	</div>
</Rotatable>
