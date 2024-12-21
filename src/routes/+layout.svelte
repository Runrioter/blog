<script lang="ts">
	import '../app.css';
	import Aavatar from './Aavatar.svelte';
	import Header from './Header.svelte';
	import github from '$lib/images/github.svg';

	let { children } = $props();
</script>

<div class="app">
	<Header></Header>

	{@render children()}

	<footer class="w-full flex justify-center items-center absolute bottom-0">
		<Aavatar logo={github} alt="Runrioter's Github" href="https://github.com/Runrioter" />
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
