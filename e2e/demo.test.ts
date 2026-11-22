import { expect, test, type Page } from '@playwright/test';

// The terminal starts hidden; document links, breadcrumbs and the theme
// switcher work without it. Terminal-dependent interactions open it first via
// the footer toggle.
async function openTerminal(page: Page) {
	await page.locator('.term-toggle').click();
	await page.waitForSelector('.terminal-host .xterm-rows > div');
}

test('terminal is hidden by default and toggled by the footer button', async ({ page }) => {
	await page.goto('/');
	// Desktop shell: document on top full width, terminal collapsed.
	await expect(page.locator('.agent-terminal')).toHaveClass(/collapsed/);
	await expect(page.locator('.agent-docs h1')).toHaveText('Runrioter Blog');
	const docsWidth = await page.evaluate(
		() => document.querySelector('.agent-docs')?.getBoundingClientRect().width ?? 0
	);
	const shellWidth = await page.evaluate(
		() => document.querySelector('.terminal-shell')?.getBoundingClientRect().width ?? 0
	);
	expect(docsWidth).toBeGreaterThan(shellWidth * 0.95); // near-full width
	await expect(page.locator('.term-toggle')).toBeVisible();
	await expect(page.locator('.term-toggle')).toHaveAttribute('aria-pressed', 'false');

	// Open: terminal block appears at the bottom with its status bar.
	await openTerminal(page);
	await expect(page.locator('.agent-terminal')).not.toHaveClass(/collapsed/);
	await expect(page.locator('.term-toggle')).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('.term-statusbar')).toContainText('Browser:');
	await expect(page.locator('.term-statusbar')).toContainText('Kit:');
	// Terminal sits at the bottom edge (docs above it).
	const shell = (await page.locator('.terminal-shell').boundingBox()) ?? { y: 0, height: 0 };
	const term = (await page.locator('.agent-terminal').boundingBox()) ?? { y: 0, height: 0 };
	expect(term.y + term.height).toBeGreaterThan(shell.y + shell.height - 4);

	// The grid must be fitted to the pane (fit regression guard).
	const dims = await page.evaluate(() => {
		const host = document.querySelector('.terminal-host');
		const screen = host?.querySelector('.xterm-screen');
		return { host: host?.clientHeight ?? 0, screen: screen?.getBoundingClientRect().height ?? 0 };
	});
	expect(dims.screen).toBeGreaterThanOrEqual(dims.host - 24);

	// Close via the status bar ✕; the session survives a reopen (same rows).
	const before = await page.locator('.terminal-host .xterm-rows > div').count();
	await page.locator('.term-toggle').click();
	await expect(page.locator('.agent-terminal')).toHaveClass(/collapsed/);
	await openTerminal(page);
	await expect(page.locator('.terminal-host .xterm-rows > div')).toHaveCount(before);
});

test('clicking a TOC link navigates the document pane and echoes in the terminal', async ({
	page
}) => {
	await page.goto('/');
	await openTerminal(page);
	await page.getByRole('link', { name: '基础概念' }).click();
	await expect(page).toHaveURL(/\/ai\/basics$/);
	await expect(
		page.locator('.doc-scroll').getByRole('heading', { name: '基础概念' })
	).toBeVisible();
	// the terminal echoes the navigation as if it were a command
	await expect(page.locator('.xterm-rows')).toContainText('open ai/basics');
});

test('terminal open command navigates', async ({ page }) => {
	await page.goto('/');
	await openTerminal(page);
	await page.locator('.agent-terminal').click();
	await page.keyboard.type('open about');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/\/about$/);
	// {#key} + fade keeps the outgoing doc in the DOM for 140ms, so filter to the new one
	await expect(page.locator('.agent-docs h1').filter({ hasText: 'About' })).toHaveText('About');
});

test('breadcrumb path navigates and highlights on hover', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: '基础概念' }).first().click();
	await expect(page).toHaveURL(/\/ai\/basics$/);
	// The path indicator is now the breadcrumb: ~ / ai / basics
	const crumbs = page.locator('.breadcrumb .crumb');
	await expect(crumbs).toHaveText(['~', 'ai', 'basics']);
	// Ancestor segment: clicking "ai" jumps to the AI section
	await crumbs.filter({ hasText: 'ai' }).click();
	await expect(page).toHaveURL(/\/ai$/);
	// Root segment: clicking ~ jumps home
	await page.locator('.breadcrumb .crumb').filter({ hasText: '~' }).click();
	await expect(page).toHaveURL(/\/$/);
	// Hovering a crumb highlights it green (clickable affordance) — the exact
	// accent comes from the theme token (dark #ff3e00, light #c2410c).
	await page.getByRole('link', { name: '基础概念' }).first().click();
	const aiCrumb = page.locator('.breadcrumb .crumb').filter({ hasText: 'ai' });
	await aiCrumb.hover();
	const accent = await page.evaluate(() => {
		const hex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
		const n = parseInt(hex.slice(1), 16);
		return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
	});
	await expect(aiCrumb).toHaveCSS('color', accent);
});

test('long terminal lines wrap inside the pane instead of clipping', async ({ page }) => {
	await page.goto('/');
	await openTerminal(page);
	await page.locator('.agent-terminal').click();
	await page.keyboard.type('a'.repeat(120));
	await page.keyboard.press('Enter');
	await page.waitForTimeout(300);
	// The grid must not be wider than the pane: if the column fit is wrong the
	// screen overflows the host and every line tail gets clipped.
	const dims = await page.evaluate(() => {
		const host = document.querySelector('.terminal-host');
		const screen = host?.querySelector('.xterm-screen');
		return { host: host?.clientWidth ?? 0, screen: screen?.getBoundingClientRect().width ?? 0 };
	});
	expect(dims.screen).toBeLessThanOrEqual(dims.host + 2);
});

test('typing a wrapped line does not balloon the terminal history', async ({ page }) => {
	await page.goto('/');
	await openTerminal(page);
	await page.locator('.agent-terminal').click();
	await page.keyboard.type('a'.repeat(120));
	await page.waitForTimeout(300);
	// A redraw bug re-writes the prompt+buffer on every keystroke; past the
	// wrap edge the overflow lands on fresh rows, so the visible buffer fills
	// with junk prompt lines. The fixed in-place redraw keeps the input in its
	// original block (one prompt line, wrapped).
	const promptRows = await page.evaluate(
		() =>
			[...document.querySelectorAll('.terminal-host .xterm-rows > div')].filter((r) =>
				(r.textContent ?? '').includes('~ $')
			).length
	);
	expect(promptRows).toBeLessThan(6);
});

test('dragging the divider resizes the terminal pane', async ({ page }) => {
	await page.goto('/');
	await openTerminal(page);
	const readHeight = () =>
		page.evaluate(
			() => document.querySelector('.agent-terminal')?.getBoundingClientRect().height ?? 0
		);
	const before = await readHeight();
	const box = (await page.locator('.pane-divider').boundingBox()) ?? undefined;
	if (!box) throw new Error('divider not found');
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width / 2, box.y - 120, { steps: 8 }); // up → taller terminal
	await page.mouse.up();
	const after = await readHeight();
	expect(after).toBeGreaterThan(before);
	// after the drag the terminal must still fit its (new) pane width
	const dims = await page.evaluate(() => {
		const host = document.querySelector('.terminal-host');
		const screen = host?.querySelector('.xterm-screen');
		return { host: host?.clientWidth ?? 0, screen: screen?.getBoundingClientRect().width ?? 0 };
	});
	expect(dims.screen).toBeLessThanOrEqual(dims.host + 2);
});

test('on mobile the open terminal overlays the shell body, not the page', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await openTerminal(page);
	// The terminal covers the shell body (document area) but stays inside the
	// window — the header and the footer toggle remain visible/reachable.
	const shell = (await page.locator('.terminal-shell').boundingBox()) ?? {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	const body = (await page.locator('.agent-body').boundingBox()) ?? {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	const rect = (await page.locator('.agent-terminal').boundingBox()) ?? {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	expect(rect.x).toBeGreaterThanOrEqual(shell.x - 1);
	expect(rect.y).toBeGreaterThanOrEqual(body.y - 1);
	expect(rect.y + rect.height).toBeLessThanOrEqual(body.y + body.height + 1);
	// The footer toggle is still visible and closes the terminal.
	await expect(page.locator('.term-toggle')).toBeVisible();
	await page.locator('.term-toggle').click();
	await expect(page.locator('.agent-terminal')).toHaveClass(/collapsed/);
});

test('theme switcher toggles light/dark and persists', async ({ page }) => {
	await page.goto('/');
	await openTerminal(page);
	await page.waitForTimeout(1200);

	// default: auto (= light in the headless runner) — no .dark class
	await expect
		.poll(async () => page.evaluate(() => document.documentElement.className))
		.not.toContain('dark');

	const fg = () =>
		page.evaluate(() => {
			const s = document.querySelector('.xterm-rows span');
			return s ? getComputedStyle(s).color : '';
		});

	// switch to dark: html gets .dark, localStorage persists, terminal repaints
	await page.getByRole('button', { name: 'Dark theme' }).click();
	await expect(page.locator('html')).toHaveClass(/dark/);
	await expect.poll(async () => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
	await expect.poll(fg).toBe('rgb(201, 209, 217)'); // #c9d1d9 dark foreground

	// back to light: class removed, terminal repaints again
	await page.getByRole('button', { name: 'Light theme' }).click();
	await expect(page.locator('html')).not.toHaveClass(/dark/);
	await expect.poll(fg).toBe('rgb(31, 35, 40)'); // #1f2328 light foreground

	// survives a reload (app.html inline script, no FOUC)
	await page.reload({ waitUntil: 'networkidle' });
	await openTerminal(page);
	await expect(page.locator('html')).not.toHaveClass(/dark/);
	await expect.poll(async () => page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
});
