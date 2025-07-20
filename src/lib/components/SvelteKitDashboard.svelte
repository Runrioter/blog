<script lang="ts">
	import { browser, building, dev, version } from '$app/environment';
</script>

<button
	class="flex items-center space-x-2 rounded-sm bg-slate-400/10 px-3 py-1 text-xs leading-5 font-semibold contain-layout hover:bg-slate-400/20"
>
	SvelteKit Dashboard
	<div class="absolute bottom-full left-0 mb-0.5 hidden rounded-sm bg-slate-400/20 p-3 text-nowrap">
		<p class="text-sm">Svelte Kit Dashboard</p>
		<div>
			<ul>
				<li>Browser: {browser}</li>
				<li>Building: {building}</li>
				<li>Dev: {dev}</li>
				<li>Version: {new Date(parseInt(version)).toISOString()}</li>
			</ul>
		</div>
	</div>
</button>

<style>
	/* button {
		contain: layout;
	} */
	button:hover > div {
		display: block;
	}
</style>
