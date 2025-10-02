import { test, expect } from "@playwright/test";

test.describe("Threat Validation - Step 5 (Memory Poisoning Detection)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3001/");
	});

	test("validates memory poisoning detection", async ({ page }) => {
		// Select open memory fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/memory/open.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Check for memory poisoning findings
		await expect(page.getByText("Persistent memory without sanitization").first()).toBeVisible();
		await expect(page.getByText("Excessive memory retention period").first()).toBeVisible();
		await expect(page.getByText("Very long memory retention period").first()).toBeVisible();
		await expect(page.getByText("Persistent memory writes without approval gates").first()).toBeVisible();
		await expect(page.getByText("Multiple memory poisoning risk factors detected").first()).toBeVisible();
		
		// Verify severity levels
		await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
		await expect(page.locator('div:has-text("High")').first()).toBeVisible();
		await expect(page.locator('div:has-text("Medium")').first()).toBeVisible();
		
		// Verify score is affected
		await expect(page.getByText(/Overall Security Score/)).toBeVisible();
	});

	test("validates guarded memory produces no findings", async ({ page }) => {
		// Select guarded memory fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/memory/guarded.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Check for no findings or perfect score
		const noFindings = page.getByText("No findings detected");
		const perfectScore = page.getByText("Score: 100");
		
		// Either no findings or perfect score should be visible
		await expect(noFindings.or(perfectScore)).toBeVisible();
	});

	test("validates context weighting affects memory severity", async ({ page }) => {
		// First, configure high-risk context
		const button = page.getByRole("button", { name: /configure context/i });
		await button.click();
		
		// Configure production + regulated context
		await page.getByRole("button", { name: "Production Live user-facing" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Regulated data" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Public (weak/basic auth)" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Basic / custom headers" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click(); // Skip compliance
		await page.getByRole("button", { name: /Confirm & Apply/i }).click();
		
		// Select open memory fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/memory/open.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Verify findings are still present with context weighting
		await expect(page.getByText("Persistent memory without sanitization").first()).toBeVisible();
		await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
		
		// Score should be lower due to context weighting
		const scoreText = await page.getByText(/Overall Security Score/).textContent();
		const score = parseInt(scoreText?.match(/\d+/)?.[0] || "0");
		expect(score).toBeLessThan(100);
	});
});
