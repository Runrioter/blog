<script lang="ts">
	import '../app.css';
	import Avatar from '$lib/components/Avatar.svelte';
	import Header from './Header.svelte';
	import svelte from '$lib/images/svelte-logo.svg';
	import SvelteKitDashboard from '$lib/components/SvelteKitDashboard.svelte';

	let { children } = $props();
</script>

<div class="app">
	<Header />

	{@render children()}

	<footer class="flex w-full items-center justify-center">
		<SvelteKitDashboard />
		<Avatar logo={svelte} alt="SvelteKit" href="https://github.com/sveltejs/kit" />
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
