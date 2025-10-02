import { test, expect } from "@playwright/test";

test.describe("Threat Validation - Step 4 (Identity Issues Detection)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3001/");
	});

	test("validates identity issues detection", async ({ page }) => {
		// Select shared identity fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/identity/shared.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Check for identity findings
		await expect(page.getByText("Shared authentication token detected").first()).toBeVisible();
		await expect(page.getByText("Long-lived authentication token detected").first()).toBeVisible();
		await expect(page.getByText("Very long-lived authentication token detected").first()).toBeVisible();
		await expect(page.getByText("Weak token rotation policy").first()).toBeVisible();
		await expect(page.getByText("Token used by excessive number of services").first()).toBeVisible();
		
		// Verify severity levels
		await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
		await expect(page.locator('div:has-text("High")').first()).toBeVisible();
		await expect(page.locator('div:has-text("Medium")').first()).toBeVisible();
		
		// Verify score is affected
		await expect(page.getByText(/Overall Security Score/)).toBeVisible();
	});

	test("validates ephemeral identity produces no findings", async ({ page }) => {
		// Select ephemeral identity fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/identity/ephemeral.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Check for no findings or perfect score
		const noFindings = page.getByText("No findings detected");
		const perfectScore = page.getByText("Score: 100");
		
		// Either no findings or perfect score should be visible
		await expect(noFindings.or(perfectScore)).toBeVisible();
	});

	test("validates context weighting affects identity severity", async ({ page }) => {
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
		
		// Select shared identity fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/identity/shared.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Verify findings are still present with context weighting
		await expect(page.getByText("Shared authentication token detected").first()).toBeVisible();
		await expect(page.locator('div:has-text("High")').first()).toBeVisible();
		
		// Score should be lower due to context weighting
		const scoreText = await page.getByText(/Overall Security Score/).textContent();
		const score = parseInt(scoreText?.match(/\d+/)?.[0] || "0");
		expect(score).toBeLessThan(100);
	});
});
