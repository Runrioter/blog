<script lang="ts">
	import '../app.css';
	import Avatar from '$lib/components/Avatar.svelte';
	import Header from './Header.svelte';
	import svelte from '$lib/images/svelte-logo.svg';
	import SvelteKitDashboard from '$lib/components/SvelteKitDashboard.svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	const tabs = [
		{ label: 'Home', path: '/' },
		{ label: 'CSS', path: '/css' },
		{ label: 'AWS', path: '/aws' },
		{ label: 'AI', path: '/ai' },
		{ label: 'About', path: '/about' }
	] as const;

	type TabPath = (typeof tabs)[number]['path'];

	const isActive = (path: TabPath) => {
		const href = resolve(path);
		if (href === '/') return page.url.pathname === href;
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	};

	const pathnameLabel = (pathname: string) => {
		if (pathname === '/') return '/';
		return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
	};
</script>

<div class="app">
	<Header />

	<section class="terminal-shell">
		<div class="terminal-header">
			<div class="lights" aria-hidden="true">
				<span class="dot red"></span>
				<span class="dot yellow"></span>
				<span class="dot green"></span>
			</div>
			<p class="terminal-title">runrioter@blog: ~</p>
			{#key page.url.pathname}
				<p class="path-indicator" transition:fade={{ duration: 140 }}>
					{pathnameLabel(page.url.pathname)}
				</p>
			{/key}
			<nav class="terminal-tabs" aria-label="Main tabs">
				{#each tabs as tab (tab.path)}
					<a
						href={resolve(tab.path)}
						aria-current={isActive(tab.path) ? 'page' : undefined}
						class="tab"
					>
						{tab.label}
					</a>
				{/each}
			</nav>
		</div>

		<div class="terminal-content">
			{#key page.url.pathname}
				<div class="terminal-pane">
					{@render children()}
				</div>
			{/key}
		</div>
	</section>

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
		gap: 0.5rem;
	}

	.terminal-shell {
		margin: 0 0.5rem;
		border: 1px solid #30363d;
		background: #161b22;
		border-radius: 14px;
		overflow: hidden;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.06),
			0 12px 30px rgba(0, 0, 0, 0.35),
			0 2px 8px rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.terminal-header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.36rem 0.58rem;
		border-bottom: 1px solid #30363d;
		background: #1f242c;
	}

	.lights {
		display: flex;
		gap: 0.35rem;
	}

	.dot {
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 999px;
	}

	.red {
		background: #f85149;
	}

	.yellow {
		background: #d29922;
	}

	.green {
		background: #3fb950;
	}

	.terminal-title {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: #8b949e;
		white-space: nowrap;
		letter-spacing: 0.02em;
	}

	.path-indicator {
		margin: 0;
		padding: 0.1rem 0.35rem;
		border: 1px solid #30363d;
		background: #161b22;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		line-height: 1.2;
		color: #7d8590;
		white-space: nowrap;
	}

	.terminal-tabs {
		display: flex;
		gap: 0.14rem;
		margin-left: auto;
		overflow-x: auto;
		scrollbar-width: thin;
		scrollbar-color: #3d444d #161b22;
		-webkit-overflow-scrolling: touch;
		padding-block: 0.04rem;
	}

	.tab {
		display: inline-flex;
		align-items: center;
		padding: 0.22rem 0.56rem;
		border: 1px solid #30363d;
		background: #161b22;
		color: #8b949e;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		text-decoration: none;
		white-space: nowrap;
		line-height: 1.2;
		border-radius: 0;
		transition:
			color 120ms ease,
			background-color 120ms ease,
			border-color 120ms ease;
		animation: tabIn 220ms ease-out both;
	}

	.tab:nth-child(2) {
		animation-delay: 20ms;
	}

	.tab:nth-child(3) {
		animation-delay: 40ms;
	}

	.tab:nth-child(4) {
		animation-delay: 60ms;
	}

	.tab:nth-child(5) {
		animation-delay: 80ms;
	}

	.tab:hover {
		text-decoration: none;
		color: #c9d1d9;
		border-color: #4a535d;
	}

	.tab[aria-current='page'] {
		background: #0d1117;
		color: #c9d1d9;
		border-color: #3d444d;
		box-shadow: inset 0 2px 0 #58a6ff;
	}

	.tab:focus-visible {
		outline: 2px solid #58a6ff;
		outline-offset: 1px;
	}

	@media (max-width: 820px) {
		.terminal-header {
			padding: 0.34rem 0.45rem;
			gap: 0.4rem;
		}

		.terminal-title {
			display: none;
		}

		.path-indicator {
			display: none;
		}

		.terminal-tabs {
			margin-left: 0;
			flex: 1;
		}

		.tab {
			padding: 0.24rem 0.5rem;
		}
	}

	.terminal-content {
		flex: 1;
		min-height: 0;
		background: #0d1117;
	}

	.terminal-pane {
		min-height: 100%;
	}

	@keyframes tabIn {
		from {
			opacity: 0;
			transform: translateY(2px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tab {
			animation: none;
		}
	}
</style>
