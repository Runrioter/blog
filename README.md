# Runrioter's blog

[![GitHub Pages](https://github.com/Runrioter/blog/actions/workflows/gh-deploy.yml/badge.svg)](https://github.com/Runrioter/blog/actions/workflows/gh-deploy.yml)

Built with Svelte & ❤️

## Current UI Architecture

- The app uses a single global terminal shell in `src/routes/+layout.svelte`.
- Main navigation tabs (`Home`, `CSS`, `AWS`, `AI`, `About`) live in the terminal header.
- Route pages render inside the shared terminal content area.
- Homepage (`src/routes/+page.svelte`) uses `@xterm/xterm` for interactive terminal content, but does not own a separate outer terminal frame.
- The global terminal shell uses macOS-like window cues (rounded corners + clipped content + subtle depth shadow/highlight).
- Terminal entry pages (`/`, `/about`, `/ai`, `/css`, `/aws`) are profile-driven via `src/lib/terminal-profiles.ts`.

### Contributor Notes

- Keep the single-terminal architecture (avoid terminal-inside-terminal regressions).
- For internal links/navigation in Svelte templates, prefer route-safe helpers from `$app/paths` (for lint and base-path compatibility).
- Keep terminal entry route components thin and declarative; terminal behavior/content config belongs in `src/lib/terminal-profiles.ts`.
- For a compact AI-agent briefing, read `docs/agent-context.md` first.
- When changing shared layout, navigation, or route wrappers, run:
  - `npm run lint`
  - `npm run check`

### Quick Regression Checks

- Keep one terminal chrome only: it must stay in `src/routes/+layout.svelte`.
- Keep tutorial entry route spacing parity: `/ai`, `/css`, `/aws` should not regain extra prose wrapper margins.
- Keep entry pages profile-driven: avoid moving terminal config blobs out of `src/lib/terminal-profiles.ts` back into route pages.

## Refs

- [sv](https://github.com/sveltejs/cli) · [Svelte](https://svelte.dev/docs/svelte/overview) · [SvelteKit](https://svelte.dev/docs/kit/introduction)
- [mdsvex](https://mdsvex.pngwn.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/sveltekit)
- [sveltelab](https://www.sveltelab.dev/)
- [Iconify](https://iconify.design/docs/icon-components/svelte/)
