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
