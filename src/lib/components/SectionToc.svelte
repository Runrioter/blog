<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Path } from '$app/types';

	let {
		title,
		description,
		items
	}: {
		title: string;
		description: string;
		items: { path: Path; label: string }[];
	} = $props();
</script>

<div>
	<h1>{title}</h1>
	<p class="desc">{description}</p>
	<ul>
		{#each items as item (item.path)}
			<li>
				<a href={resolve(item.path)}>{item.label}</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	h1 {
		font-family: var(--font-mono);
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 0.6rem;
		color: var(--fg);
	}

	.desc {
		color: var(--fg-muted);
		font-size: 0.92rem;
		line-height: 1.6;
		max-width: 42rem;
		margin: 0 0 1rem;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	li a {
		color: var(--link);
		font-family: var(--font-mono);
		font-size: 0.95rem;
		text-decoration: none;
	}

	li a::before {
		content: '▸ ';
		color: var(--bullet);
	}

	li a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
