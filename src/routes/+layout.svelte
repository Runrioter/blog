<script lang="ts">
	import '../app.css';
	import Avatar from '#lib/components/Avatar.svelte';
	import Header from './Header.svelte';
	import Breadcrumb from './Breadcrumb.svelte';
	import InteractiveTerminal from '#lib/components/InteractiveTerminal.svelte';
	import { shellTerminalProfile } from '#lib/terminal-profiles.ts';
	import svelte from '#lib/images/svelte-logo.svg';
	import SvelteKitDashboard from '#lib/components/SvelteKitDashboard.svelte';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { browser, building, dev, version } from '$app/env';

	let { children } = $props();

	const now = new Date().toISOString().slice(0, 10);

	type NavSource = 'terminal' | 'history' | null;

	// Where the last navigation came from, so the terminal only echoes
	// document-pane link clicks (never its own commands or back/forward).
	let navSource: NavSource = $state(null);
	let prevPath = $state(page.url.pathname);
	let api: { echoCommand: (line: string) => void } | null = $state(null);

	// The terminal is hidden by default; the Dashboard button in the footer
	// toggles it (see SvelteKitDashboard). The pane stays mounted while hidden
	// (only display-hidden), so the xterm session survives the toggle.
	let terminalVisible = $state(false);

	// Terminal block height, in percent of the shell body. Draggable via the
	// horizontal divider below the document pane; the xterm re-fits as it
	// resizes.
	let terminalPct = $state(42);
	let dragging = $state(false);
	let body: HTMLElement;

	const clampPct = (v: number) => Math.min(70, Math.max(25, v));

	function toggleTerminal() {
		terminalVisible = !terminalVisible;
	}

	function startDrag(e: PointerEvent) {
		if (!browser || !body) return;
		e.preventDefault();
		dragging = true;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function moveDrag(e: PointerEvent) {
		if (!dragging || !body) return;
		const rect = body.getBoundingClientRect();
		if (rect.height <= 0) return;
		// Height grows upward from the bottom edge of the shell body.
		terminalPct = clampPct(((rect.bottom - e.clientY) / rect.height) * 100);
	}

	function endDrag() {
		dragging = false;
	}

	function nudgeDrag(e: KeyboardEvent) {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			e.preventDefault();
			terminalPct = clampPct(terminalPct + (e.key === 'ArrowUp' ? 2 : -2));
		}
	}

	// The vite-injected base constant is stable in every context; the $app/paths
	// `resolve('')` it used to rely on is a relative URL during prerendering.
	function routePath(pathname: string): string {
		const b = __SVELTEKIT_PATHS_BASE__ ?? '';
		const rel = pathname.startsWith(b) ? pathname.slice(b.length) : pathname;
		return rel.replace(/^\//, '');
	}

	$effect(() => {
		const onPop = () => {
			navSource = 'history';
		};
		if (browser) addEventListener('popstate', onPop);
		return () => browser && removeEventListener('popstate', onPop);
	});

	$effect(() => {
		const current = page.url.pathname;
		if (current === prevPath) return;
		prevPath = current;
		if (navSource !== null) {
			// Terminal or breadcrumb navigation — the terminal already showed it.
			navSource = null;
			return;
		}
		const target = routePath(current);
		api?.echoCommand(`open ${target === '' ? 'home' : target}`);
	});
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
			<p class="terminal-title">runrioter@blog:</p>
			<Breadcrumb onNavigate={() => (navSource = 'terminal')} />
		</div>

		<div class="agent-body" class:dragging bind:this={body}>
			<div class="agent-docs">
				{#key page.url.pathname}
					<article class="doc-scroll" transition:fade={{ duration: 140 }}>
						{@render children()}
					</article>
				{/key}
			</div>

			<button
				class="pane-divider"
				class:hidden={!terminalVisible}
				aria-label="Resize terminal height"
				onpointerdown={startDrag}
				onpointermove={moveDrag}
				onpointerup={endDrag}
				onkeydown={nudgeDrag}
			>
				<span class="divider-grip" aria-hidden="true"></span>
			</button>

			<aside
				class="agent-terminal"
				class:collapsed={!terminalVisible}
				aria-label="Command terminal"
				style:height={`${terminalPct}%`}
			>
				<InteractiveTerminal
					historyKey={shellTerminalProfile.historyKey}
					introLines={shellTerminalProfile.introLines(now)}
					hint={shellTerminalProfile.hint}
					dirs={shellTerminalProfile.dirs}
					files={shellTerminalProfile.files}
					internalRoutes={shellTerminalProfile.internalRoutes}
					helpExamples={shellTerminalProfile.helpExamples}
					registerApi={(a) => (api = a)}
					onSelfNavigate={() => (navSource = 'terminal')}
				/>
				<div class="term-statusbar" aria-label="Terminal status">
					<span>Browser: {browser ? 'yes' : 'no'}</span>
					<span>Building: {building ? 'yes' : 'no'}</span>
					<span>Dev: {dev ? 'yes' : 'no'}</span>
					<span>Kit: {new Date(parseInt(version)).toISOString().slice(0, 10)}</span>
				</div>
			</aside>
		</div>
	</section>

	<footer class="flex w-full items-center justify-center">
		<SvelteKitDashboard active={terminalVisible} onclick={toggleTerminal} />
		<Avatar logo={svelte} alt="SvelteKit" href="https://sveltejs.dev" />
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
		min-height: 100vh;
		gap: 0.5rem;
	}

	.terminal-shell {
		margin: 0 0.5rem;
		border: 1px solid var(--border);
		background: var(--bg-panel);
		border-radius: 14px;
		overflow: hidden;
		box-shadow: var(--inset), var(--shadow);
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
		border-bottom: 1px solid var(--border);
		background: var(--bg-header);
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
		color: var(--color-muted);
		white-space: nowrap;
		letter-spacing: 0.02em;
	}

	/* Document on top, terminal block at the bottom of the shell body. */
	.agent-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		background: var(--bg-deep);
	}

	.agent-body.dragging {
		cursor: row-resize;
		user-select: none;
	}

	.agent-body.dragging * {
		user-select: none !important;
	}

	.agent-docs {
		flex: 1;
		min-width: 0;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--scroll-thumb) var(--scroll-track);
		background: var(--bg-deep);
	}

	.agent-docs :global(:is(p, li, h1, h2, h3, h4, td, th)) {
		overflow-wrap: anywhere;
	}

	.doc-scroll {
		max-width: 52rem;
		margin: 0 auto;
		padding: 1.4rem 1.8rem 3rem;
	}

	.pane-divider {
		height: 6px;
		flex-shrink: 0;
		margin: 0;
		padding: 0;
		border: 0;
		border-radius: 3px;
		cursor: row-resize;
		background: transparent;
		position: relative;
		touch-action: none;
	}

	.pane-divider.hidden {
		display: none;
	}

	.pane-divider .divider-grip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 2.25rem;
		height: 3px;
		border-radius: 2px;
		background: var(--border-soft);
	}

	.pane-divider:hover .divider-grip,
	.pane-divider:focus-visible .divider-grip,
	.agent-body.dragging .pane-divider .divider-grip {
		background: var(--green);
		width: 3.5rem;
	}

	.pane-divider:focus-visible {
		outline: none;
	}

	.agent-terminal {
		height: 42%;
		flex-shrink: 0;
		min-height: 0;
		overflow: hidden;
		border-top: 1px solid var(--border);
		display: flex;
		flex-direction: column;
	}

	.agent-terminal.collapsed {
		display: none;
	}

	.term-statusbar {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		flex-shrink: 0;
		padding: 0.14rem 0.6rem;
		border-top: 1px solid var(--border);
		background: var(--bg-header);
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--color-muted);
		letter-spacing: 0.03em;
	}

	footer {
		padding-bottom: 0.35rem;
	}

	@media (max-width: 820px) {
		.app {
			height: auto;
		}

		.terminal-shell {
			margin: 0 0.35rem;
		}

		.terminal-title {
			display: none;
		}

		/* On mobile the open terminal overlays the shell body (the document area)
		 * — not the whole page, so the footer toggle stays reachable and is the
		 * only way to close it. */
		.agent-body {
			position: relative;
		}

		.agent-terminal:not(.collapsed) {
			position: absolute;
			inset: 0;
			height: 100% !important;
			z-index: 30;
			border-top: none;
		}

		.pane-divider {
			display: none;
		}

		.agent-docs {
			overflow-y: visible;
		}

		.doc-scroll {
			padding: 1rem 1rem 2rem;
		}
	}
</style>
