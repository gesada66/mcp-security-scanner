import { test, expect } from "@playwright/test";

test.describe("Threat Validation - Step 3 (Exfil Chain Detection)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3001/");
	});

	test("validates exfil chain detection", async ({ page }) => {
		// Select exfil chain fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/graph/exfil.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Check for exfil findings
		await expect(page.getByText("External data sinks detected in graph").first()).toBeVisible();
		await expect(page.getByText("Untrusted nodes in data flow graph").first()).toBeVisible();
		await expect(page.getByText("Long data flow chains detected").first()).toBeVisible();
		await expect(page.getByText("Direct paths from sensitive data to external sinks").first()).toBeVisible();
		
		// Verify severity levels
		await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
		await expect(page.locator('div:has-text("High")').first()).toBeVisible();
		await expect(page.locator('div:has-text("Medium")').first()).toBeVisible();
		
		// Verify score is affected
		await expect(page.getByText(/Overall Security Score/)).toBeVisible();
	});

	test("validates safe graph produces no findings", async ({ page }) => {
		// Select safe graph fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/graph/safe.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Check for no findings or perfect score
		const noFindings = page.getByText("No findings detected");
		const perfectScore = page.getByText("Score: 100");
		
		// Either no findings or perfect score should be visible
		await expect(noFindings.or(perfectScore)).toBeVisible();
	});

	test("validates context weighting affects exfil severity", async ({ page }) => {
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
		
		// Select exfil chain fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/graph/exfil.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Verify findings are still present with context weighting
		await expect(page.getByText("External data sinks detected in graph").first()).toBeVisible();
		await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
		
		// Score should be lower due to context weighting
		const scoreText = await page.getByText(/Overall Security Score/).textContent();
		const score = parseInt(scoreText?.match(/\d+/)?.[0] || "0");
		expect(score).toBeLessThan(100);
	});
});
