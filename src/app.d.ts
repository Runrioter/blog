// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// kit 3's vite plugin injects the configured base path as this compile-time
	// constant (it is what $app/paths' `base` falls back to). Unlike `base`
	// itself, it keeps the configured value in every context — including
	// prerendering, where the page payload's base is a relative URL.
	const __SVELTEKIT_PATHS_BASE__: string;

	// Injected by vite.config.ts (define): the released version — the latest
	// `v*` git tag, falling back to package.json's version without one.
	const __APP_VERSION__: string;
}

export {};
