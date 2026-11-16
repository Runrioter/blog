import { expect, test } from '@playwright/test';

test('two-pane agent shell renders', async ({ page }) => {
	await page.goto('/');
	// Left pane: the interactive terminal. Right pane: welcome doc with TOC.
	await expect(page.locator('.agent-terminal')).toBeVisible();
	await expect(page.locator('.agent-docs')).toBeVisible();
	await expect(page.locator('.agent-docs h1')).toHaveText('Runrioter Blog');
	// The terminal grid must be fitted to the pane — otherwise an empty black
	// band sits below the prompt (regression: missing fit/resize handling).
	await page.waitForSelector('.terminal-host .xterm-rows > div');
	const dims = await page.evaluate(() => {
		const host = document.querySelector('.terminal-host');
		const screen = host?.querySelector('.xterm-screen');
		return { host: host?.clientHeight ?? 0, screen: screen?.getBoundingClientRect().height ?? 0 };
	});
	expect(dims.screen).toBeGreaterThanOrEqual(dims.host - 24);
});

test('clicking a TOC link navigates the document pane and echoes in the terminal', async ({
	page
}) => {
	await page.goto('/');
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
	// Hovering a crumb highlights it green (clickable affordance)
	await page.getByRole('link', { name: '基础概念' }).first().click();
	const aiCrumb = page.locator('.breadcrumb .crumb').filter({ hasText: 'ai' });
	await aiCrumb.hover();
	await expect(aiCrumb).toHaveCSS('color', 'rgb(63, 185, 80)');
});

test('long terminal lines wrap inside the pane instead of clipping', async ({ page }) => {
	await page.goto('/');
	await page.waitForSelector('.terminal-host .xterm-rows > div');
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
	await page.waitForSelector('.terminal-host .xterm-rows > div');
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
	await page.waitForSelector('.terminal-host .xterm-rows > div');
	const readPct = () =>
		page.evaluate(
			() => parseFloat((document.querySelector('.agent-terminal') as HTMLElement).style.width) || 0
		);
	const before = await readPct();
	const box = (await page.locator('.pane-divider').boundingBox()) ?? undefined;
	if (!box) throw new Error('divider not found');
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, { steps: 8 });
	await page.mouse.up();
	const after = await readPct();
	expect(after).toBeGreaterThan(before);
	// after the drag the terminal must still fit its (new) pane width
	const dims = await page.evaluate(() => {
		const host = document.querySelector('.terminal-host');
		const screen = host?.querySelector('.xterm-screen');
		return { host: host?.clientWidth ?? 0, screen: screen?.getBoundingClientRect().width ?? 0 };
	});
	expect(dims.screen).toBeLessThanOrEqual(dims.host + 2);
});
