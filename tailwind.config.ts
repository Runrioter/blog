import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			transform: {
				'rotate-y-0': 'rotateY(0deg)',
				'rotate-y-180': 'rotateY(180deg)'
			}
		}
	},
} satisfies Config;
