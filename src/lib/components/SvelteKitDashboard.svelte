<script lang="ts">
	import { browser, building, dev, version } from '$app/environment';
</script>

<button
	class="dashboard dark:highlight-white/5 relative flex items-center space-x-2 rounded-sm bg-slate-400/10 px-3 py-1 text-xs leading-5 font-semibold hover:bg-slate-400/20"
>
	SvelteKit Dashboard
	<div
		class="absolute bottom-full left-0 mb-0.5 hidden rounded-sm bg-slate-50/90 p-3 whitespace-nowrap"
	>
		<h1 class="text-sm">Svelte Kit Dashboard</h1>
		<div>
			<ul>
				<li>Browser: {browser}</li>
				<li>Building: {building}</li>
				<li>Dev: {dev}</li>
				<li>Version: {version}</li>
			</ul>
		</div>
	</div>
</button>

<style>
	.dashboard:hover > div {
		display: block;
	}
</style>
