<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { AppTypes } from '$app/types';

	/**
	 * Breadcrumb shown in the terminal title bar (the path-indicator's place).
	 * Each segment is a real link — the root (~) and every ancestor directory —
	 * so the current location is also a navigation control.
	 */
	let { onNavigate = () => {} }: { onNavigate?: () => void } = $props();

	// kit 3: page.url.pathname keeps the base prefix ('/blog/ai' on Pages). The
	// vite-injected __SVELTEKIT_PATHS_BASE__ constant holds the configured base
	// in every context ('' in dev, '/blog' on Pages) — unlike the $app/paths
	// `base` binding, which is a relative URL during prerendering. Strip it
	// before splitting into breadcrumb segments.
	function routeSegments(pathname: string): string[] {
		const b = __SVELTEKIT_PATHS_BASE__ ?? '';
		const rel = pathname.startsWith(b) ? pathname.slice(b.length) : pathname;
		return rel.replace(/^\//, '').split('/').filter(Boolean);
	}

	const segments = $derived(routeSegments(page.url.pathname));

	// kit 3's strict generic resolve() doesn't accept a runtime-joined string;
	// the cast is the helper — `resolve` stays at every call site (the lint
	// rule requires the imported resolve, not a wrapper, in href/goto).
	function asRoute(...parts: string[]): ReturnType<AppTypes['Path']> {
		return parts.filter(Boolean).join('/') as ReturnType<AppTypes['Path']>;
	}

	// Terminal-side navigation: the doc-pane echo must not fire again.
	// Resolves exactly once here — the rule requires a literal resolve() in
	// every goto, so callers pass unresolved path segments, never hrefs.
	function navigate(...parts: string[]) {
		onNavigate();
		void goto(resolve(asRoute(...parts)));
	}
</script>

<nav class="breadcrumb" aria-label="You are here">
	<a class="crumb" href={resolve('')} onclick={() => navigate()}> ~ </a>
	{#each segments as segment, i (segment + i)}
		<span class="sep" aria-hidden="true">/</span>
		<a
			class="crumb"
			href={resolve(asRoute(...segments.slice(0, i + 1)))}
			onclick={() => navigate(...segments.slice(0, i + 1))}
		>
			{segment}
		</a>
	{/each}
</nav>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		min-width: 0;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		line-height: 1.2;
		color: var(--color-muted, #8b949e);
		white-space: nowrap;
		overflow: hidden;
	}

	.crumb {
		color: inherit;
		text-decoration: none;
		padding: 0.05rem 0;
	}

	/* Green on hover/focus = "clickable, navigates there" */
	.crumb:hover,
	.crumb:focus-visible {
		color: var(--color-accent, #3fb950);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.crumb:focus-visible {
		outline: none;
	}

	.sep {
		color: color-mix(in srgb, var(--color-muted, #8b949e) 55%, transparent);
		user-select: none;
	}
</style>
