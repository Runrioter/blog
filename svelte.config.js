import { mdsvex } from "mdsvex";
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: [vitePreprocess(), mdsvex()],

    kit: {
		adapter: adapter({
            pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
        }),
        paths: {
            base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
        },
        prerender: {
            handleHttpError: ({ path, referrer, message}) => {
                if (path === '/sverdle') {
                    return;
                }
                throw new Error(message);
            }
        }
	},

    extensions: [".svelte", ".svx"]
};

export default config;
