#!/usr/bin/env node
/**
 * Reusable Playwright probe for the blog preview server.
 *
 * The site must already be served: `npm run preview -- --port 4173`
 * (run `npm run build` first — preview refuses to start without a build).
 *
 * Usage:
 *   node shot.mjs --url /ai/basics --screenshot /tmp/shot.png \
 *     --wait ".terminal-host .xterm-rows > div" \
 *     --hover ".breadcrumb .crumb" \
 *     --eval "getComputedStyle(document.querySelector('.crumb')).color"
 *
 * Flags:
 *   --url <path>        page to load, base relative (default /)
 *   --base <prefix>     base path prefix when previewing a BASE_PATH build
 *   --screenshot <file> where to save the screenshot
 *   --wait <selector>   wait for selector before interacting (repeatable)
 *   --click <selector>  click (first match), repeatable
 *   --type <text>       type text into --type-into (repeatable)
 *   --type-into <sel>   element to focus before typing (default .agent-terminal)
 *   --press <key>       press a keyboard key (repeatable, e.g. Enter)
 *   --eval <js expr>    evaluate in the page and print the result (repeatable)
 *   --width/--height    viewport size (default 1280x720)
 */
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const once = (flag, dflt) => {
	const i = args.indexOf(flag);
	return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const many = (flag) => {
	const out = [];
	for (let i = 0; i < args.length; i++) if (args[i] === flag && args[i + 1]) out.push(args[i + 1]);
	return out;
};

const base = once('--base', '').replace(/\/$/, '');
const target = base + (once('--url', '/').startsWith('/') ? '' : '/') + once('--url', '/');

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: Number(once('--width', 1280)), height: Number(once('--height', 720)) }
});
page.on('pageerror', (e) => console.log('pageerror:', e.message));

const resp = await page.goto(`http://localhost:4173${target}`, { waitUntil: 'networkidle' });
const status = resp?.status();
console.log(`goto ${target} → ${status ?? 'no response'}`);
if (!resp || status >= 400) {
	await browser.close();
	process.exit(1);
}

for (const sel of many('--wait')) {
	try {
		await page.waitForSelector(sel, { timeout: 15000 });
	} catch (e) {
		console.log(`wait failed: ${sel} (${e.message.split('\n')[0]})`);
	}
}
for (const sel of many('--click')) {
	try {
		await page.locator(sel).first().click();
		await page.waitForTimeout(400);
	} catch (e) {
		console.log(`click failed: ${sel} (${e.message.split('\n')[0]})`);
	}
}
for (const text of many('--type')) {
	try {
		await page.locator(once('--type-into', '.agent-terminal')).first().click();
		await page.keyboard.type(text);
	} catch (e) {
		console.log(`type failed (${e.message.split('\n')[0]})`);
	}
}
for (const key of many('--press')) {
	try {
		await page.keyboard.press(key);
	} catch (e) {
		console.log(`press ${key} failed (${e.message.split('\n')[0]})`);
	}
}
await page.waitForTimeout(300);
for (const code of many('--eval')) {
	try {
		const fn = new Function('return (' + code + ')');
		console.log(`eval ${code} → ${JSON.stringify(await page.evaluate(fn))}`);
	} catch (e) {
		console.log(`eval failed: ${e.message.split('\n')[0]}`);
	}
}

const shot = once('--screenshot');
if (shot) {
	await page.screenshot({ path: shot });
	console.log('screenshot:', shot);
}

await browser.close();
