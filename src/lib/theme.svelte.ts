/**
 * Theme state: light / dark / auto (follows the system).
 *
 * - `theme` is the user's explicit choice, persisted to localStorage.
 * - `resolvedTheme()` is the effective scheme ('light' | 'dark') after
 *   resolving auto against `prefers-color-scheme`; call it in components to
 *   subscribe reactively.
 * - The `.dark` class is toggled on <html> so CSS custom properties and
 *   Tailwind's `dark:` variant react. First paint is protected by the
 *   inline script in app.html (no FOUC).
 *
 * No module-level `$effect` here — Svelte's compile/runtime rejects effects
 * created outside component init (effect_orphan). State mutations and DOM
 * sync happen explicitly in `applyTheme`/`setTheme` and the media-query
 * listener; component reads stay reactive through the getters.
 */
import { browser } from '$app/env';

export type ThemeChoice = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'theme';
const DARK_MQ = '(prefers-color-scheme: dark)';
/** Broadcast on every effective-scheme change (setTheme and system changes). */
export const THEME_CHANGE_EVENT = 'blog:theme-change';

function readStored(): ThemeChoice {
	if (!browser) return 'auto';
	const value = localStorage.getItem(STORAGE_KEY);
	return value === 'light' || value === 'dark' || value === 'auto' ? value : 'auto';
}

const mq = browser ? window.matchMedia(DARK_MQ) : null;

// Module-level state that gets reassigned cannot be exported directly ([svelte
// 5 runes]); expose it through getters — reads in templates/deriveds stay
// reactive.
let systemDark = $state(browser && mq ? mq.matches : false);
let theme = $state<ThemeChoice>(readStored());

export function getTheme(): ThemeChoice {
	return theme;
}

const resolved = $derived(theme === 'auto' ? (systemDark ? 'dark' : 'light') : theme);

/** Effective scheme after resolving auto — call in components for reactivity. */
export function resolvedTheme(): 'light' | 'dark' {
	return resolved;
}

function applyTheme() {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, theme);
	document.documentElement.classList.toggle('dark', resolvedTheme() === 'dark');
	document.documentElement.dataset.theme = theme;
	// Non-Svelte consumers (xterm palette) listen for this instead of relying
	// on runes reactivity across modules.
	window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: resolvedTheme() }));
}

// Follow system-scheme changes while in auto mode.
if (mq) {
	mq.addEventListener('change', () => {
		systemDark = mq.matches;
		applyTheme();
	});
}

export function setTheme(choice: ThemeChoice) {
	theme = choice;
	applyTheme();
}

/** xterm palette per resolved scheme (kept in sync by InteractiveTerminal). */
export type XtermPalette = {
	background: string;
	foreground: string;
	cursor: string;
	black: string;
	green: string;
	blue: string;
	red: string;
	yellow: string;
	brightBlack: string;
};

export const xtermPalettes: Record<'light' | 'dark', XtermPalette> = {
	dark: {
		background: '#0d1117',
		foreground: '#c9d1d9',
		cursor: '#3fb950',
		black: '#0d1117',
		green: '#3fb950',
		blue: '#58a6ff',
		red: '#f85149',
		yellow: '#d29922',
		brightBlack: '#6e7681'
	},
	light: {
		background: '#ffffff',
		foreground: '#1f2328',
		cursor: '#1a7f37',
		black: '#24292f',
		green: '#1a7f37',
		blue: '#0969da',
		red: '#cf222e',
		yellow: '#9a6700',
		brightBlack: '#6e7781'
	}
};
