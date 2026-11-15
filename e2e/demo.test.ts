import { expect, test } from '@playwright/test';

test('home page renders the terminal shell', async ({ page }) => {
	await page.goto('/');
	// The homepage is a terminal view — assert the shell chrome and main tabs.
	await expect(page.getByText('runrioter@blog: ~')).toBeVisible();
	await expect(page.getByRole('navigation', { name: 'Main tabs' })).toBeVisible();
});
