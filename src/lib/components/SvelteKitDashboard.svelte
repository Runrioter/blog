<script lang="ts">
	/**
	 * Footer toggle for the embedded terminal. The SvelteKit env info it used
	 * to show in a hover panel now lives in the terminal's status bar
	 * (`+layout.svelte` → .term-statusbar).
	 */
	let {
		active = false,
		onclick = () => {}
	}: {
		active?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<button class="term-toggle" class:active aria-pressed={active} {onclick}>
	<span class="dot-indicator" aria-hidden="true"></span>
	Terminal
</button>

<style>
	.term-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.28rem 0.7rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--bg-panel);
		color: var(--fg-muted);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		cursor: pointer;
	}

	.term-toggle:hover {
		border-color: var(--border-soft);
		color: var(--fg);
	}

	.term-toggle.active {
		border-color: color-mix(in oklab, var(--accent) 55%, transparent);
		background: var(--accent-soft);
		color: var(--accent);
	}

	.term-toggle:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.dot-indicator {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--fg-faint);
	}

	.term-toggle.active .dot-indicator {
		background: var(--accent);
		box-shadow: 0 0 6px color-mix(in oklab, var(--accent) 70%, transparent);
	}
</style>
