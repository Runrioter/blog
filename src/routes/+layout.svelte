<script lang="ts">
	import '../app.css';
	import Avatar from './Avatar.svelte';
	import Header from './Header.svelte';
	import github from '$lib/images/github.svg';

	let { children } = $props();
</script>

<div class="app">
	<Header></Header>

	{@render children()}

	<footer class="flex w-full items-center justify-center">
		<Avatar logo={github} alt="Runrioter's Github" href="https://github.com/Runrioter" />
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
