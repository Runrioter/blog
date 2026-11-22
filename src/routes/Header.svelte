<script lang="ts">
	import avatar from '#lib/images/avatar.png';
	import github from '#lib/images/github.svg';
	import Avatar from '#lib/components/Avatar.svelte';
	import RotatableAvatar from '#lib/components/RotatableAvatar.svelte';
	import { getTheme, setTheme, type ThemeChoice } from '#lib/theme.svelte.ts';

	const options: { value: ThemeChoice; label: string }[] = [
		{ value: 'light', label: 'Light theme' },
		{ value: 'dark', label: 'Dark theme' },
		{ value: 'auto', label: 'Auto theme (follows system)' }
	];
</script>

<header>
	<div class="left">
		<RotatableAvatar logo={avatar} alt="Runrioter's Github" />
		<p class="label">Runrioter Blog Terminal</p>
	</div>

	<div class="right">
		<div class="theme-switcher" role="group" aria-label="Color theme">
			{#each options as option (option.value)}
				<button
					class="ts-btn"
					class:active={getTheme() === option.value}
					aria-label={option.label}
					aria-pressed={getTheme() === option.value}
					title={option.label}
					onclick={() => setTheme(option.value)}
				>
					{#if option.value === 'light'}
						<svg viewBox="0 0 16 16" aria-hidden="true">
							<circle cx="8" cy="8" r="3.2" />
							<path
								d="M8 0.8v1.8M8 13.4v1.8M0.8 8h1.8M13.4 8h1.8M2.9 2.9l1.3 1.3M11.8 11.8l1.3 1.3M13.1 2.9l-1.3 1.3M4.2 11.8l-1.3 1.3"
							/>
						</svg>
					{:else if option.value === 'dark'}
						<svg viewBox="0 0 16 16" aria-hidden="true">
							<path
								d="M13.2 9.9A5.6 5.6 0 0 1 6.1 2.8a.6.6 0 0 0-.8-.7 6.4 6.4 0 1 0 8.6 8.6.6.6 0 0 0-.7-.8z"
							/>
						</svg>
					{:else}
						<svg viewBox="0 0 16 16" aria-hidden="true">
							<circle cx="8" cy="8" r="6.2" />
							<path d="M8 1.8v12.4A6.2 6.2 0 0 1 8 1.8z" />
						</svg>
					{/if}
				</button>
			{/each}
		</div>

		<Avatar
			logo={github}
			alt="Runrioter's Blog"
			href="https://github.com/Runrioter/blog"
			invertOnDark
		/>
	</div>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.left,
	.right {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.label {
		margin: 0;
		font-size: 0.8rem;
		font-family: var(--font-mono);
		font-weight: 600;
		color: var(--fg-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.theme-switcher {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 2px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--bg-panel);
	}

	.ts-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.55rem;
		height: 1.55rem;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: transparent;
		cursor: pointer;
		color: var(--fg-faint);
	}

	.ts-btn svg {
		width: 0.85rem;
		height: 0.85rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.ts-btn:hover {
		color: var(--fg);
	}

	.ts-btn.active {
		background: var(--green-soft);
		color: var(--green);
	}

	.ts-btn:focus-visible {
		outline: 2px solid var(--green);
		outline-offset: 1px;
	}
</style>
