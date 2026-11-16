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
	import { browser } from '$app/env';

	let { children } = $props();

	const now = new Date().toISOString().slice(0, 10);

	type NavSource = 'terminal' | 'history' | null;

	// Where the last navigation came from, so the terminal only echoes
	// document-pane link clicks (never its own commands or back/forward).
	let navSource: NavSource = $state(null);
	let prevPath = $state(page.url.pathname);
	let api: { echoCommand: (line: string) => void } | null = $state(null);

	// Terminal pane width, in percent of the content row. Draggable via the
	// divider between the panes; the xterm re-fits as it resizes.
	let terminalPct = $state(42);
	let dragging = $state(false);
	let body: HTMLElement;

	const clampPct = (v: number) => Math.min(70, Math.max(25, v));

	function startDrag(e: PointerEvent) {
		if (!browser || !body) return;
		e.preventDefault();
		dragging = true;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function moveDrag(e: PointerEvent) {
		if (!dragging || !body) return;
		const rect = body.getBoundingClientRect();
		if (rect.width <= 0) return;
		terminalPct = clampPct(((e.clientX - rect.left) / rect.width) * 100);
	}

	function endDrag() {
		dragging = false;
	}

	function nudgeDrag(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			e.preventDefault();
			terminalPct = clampPct(terminalPct + (e.key === 'ArrowLeft' ? -2 : 2));
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
			<span class="agent-badge" aria-hidden="true">agent</span>
		</div>

		<div class="agent-body" class:dragging bind:this={body}>
			<aside class="agent-terminal" aria-label="Command terminal" style:width={`${terminalPct}%`}>
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
			</aside>
			<button
				class="pane-divider"
				aria-label="Resize terminal and document panes"
				onpointerdown={startDrag}
				onpointermove={moveDrag}
				onpointerup={endDrag}
				onkeydown={nudgeDrag}
			>
				<span class="divider-grip" aria-hidden="true"></span>
			</button>

			<div class="agent-docs">
				{#key page.url.pathname}
					<article class="doc-scroll" transition:fade={{ duration: 140 }}>
						{@render children()}
					</article>
				{/key}
			</div>
		</div>
	</section>

	<footer class="flex w-full items-center justify-center">
		<SvelteKitDashboard />
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

	.agent-badge {
		margin-left: auto;
		padding: 0.1rem 0.42rem;
		border: 1px solid #238636;
		border-radius: 999px;
		background: rgba(63, 185, 80, 0.12);
		color: #3fb950;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.agent-body {
		display: flex;
		flex: 1;
		min-height: 0;
		background: #0d1117;
	}

	.agent-body.dragging {
		cursor: col-resize;
		user-select: none;
	}

	.agent-body.dragging * {
		user-select: none !important;
	}

	.agent-terminal {
		width: 42%;
		min-width: 220px;
		min-height: 0;
		overflow: hidden;
		border-right: 1px solid #30363d;
		display: flex;
	}

	.pane-divider {
		width: 6px;
		flex-shrink: 0;
		min-height: 0;
		margin: 0;
		padding: 0;
		border: 0;
		border-radius: 3px;
		cursor: col-resize;
		background: transparent;
		position: relative;
		touch-action: none;
	}

	.pane-divider .divider-grip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 3px;
		height: 2.25rem;
		border-radius: 2px;
		background: #3d444d;
	}

	.pane-divider:hover .divider-grip,
	.pane-divider:focus-visible .divider-grip,
	.agent-body.dragging .pane-divider .divider-grip {
		background: #3fb950;
		height: 3.5rem;
	}

	.pane-divider:focus-visible {
		outline: none;
	}

	.agent-docs {
		flex: 1;
		min-width: 0;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: #3d444d #0d1117;
		background: #0d1117;
	}

	.agent-docs :global(:is(p, li, h1, h2, h3, h4, td, th)) {
		overflow-wrap: anywhere;
	}

	.doc-scroll {
		max-width: 52rem;
		margin: 0 auto;
		padding: 1.4rem 1.8rem 3rem;
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

		.agent-badge {
			margin-left: auto;
		}

		.agent-body {
			flex-direction: column;
		}

		.agent-terminal {
			width: 100% !important;
			min-width: 0;
			height: 45vh;
			min-height: 200px;
			overflow: hidden;
			border-right: none;
			border-bottom: 1px solid #30363d;
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
