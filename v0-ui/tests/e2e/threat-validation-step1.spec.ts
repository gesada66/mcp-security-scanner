import { test, expect } from "@playwright/test";

test.describe("Threat Validation - Step 1 (Trojan Server Detection)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3001/");
	});

	test("validates trojan server detection with bad fixture", async ({ page }) => {
		// Select trojan server (bad) fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/trojan/bad.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Check for trojan findings
		await expect(page.getByText("MCP Server integrity verification failed")).toBeVisible();
		await expect(page.getByText("MCP Server from untrusted source")).toBeVisible();
		await expect(page.getByText("Suspicious network egress configuration")).toBeVisible();
		
		// Verify severity levels - check for specific severity badges
		await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
		await expect(page.locator('div:has-text("High")').first()).toBeVisible();
		
		// Verify score is affected - look for the score display
		await expect(page.getByText(/Overall Security Score/)).toBeVisible();
	});

	test("validates clean server produces no findings", async ({ page }) => {
		// Select vetted server (good) fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/trojan/good.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Check for no findings or perfect score
		const noFindings = page.getByText("No findings detected");
		const perfectScore = page.getByText("Score: 100");
		
		// Either no findings or perfect score should be visible
		await expect(noFindings.or(perfectScore)).toBeVisible();
	});

	test("validates context weighting affects trojan severity", async ({ page }) => {
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
		
		// Select trojan server (bad) fixture
		const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
		await dataSourceSelect.selectOption("/threat-fixtures/trojan/bad.json");
		
		// Wait for findings to load
		await page.waitForTimeout(1000);
		
		// Verify findings are still present with context weighting
		await expect(page.getByText("MCP Server integrity verification failed")).toBeVisible();
		await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
		
		// Score should be lower due to context weighting
		const scoreText = await page.getByText(/Overall Security Score/).textContent();
		const score = parseInt(scoreText?.match(/\d+/)?.[0] || "0");
		expect(score).toBeLessThan(100);
	});
});
