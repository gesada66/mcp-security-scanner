import { test, expect } from "@playwright/test";

test.describe("Discovery Wizard flow", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3001/");
	});

	test("opens, navigates questions, reviews, confirms, shows banner", async ({ page }) => {
		// Start wizard (feature flag must be on)
		const button = page.getByRole("button", { name: /configure context|update context/i });
		await expect(button).toBeVisible();
		await button.click();
		
		// Wait for wizard to load
		await page.waitForTimeout(500);
		
		// Scroll to wizard content
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		// Step 1: env
		await expect(page.getByRole("heading", { name: "Environment Type" })).toBeVisible();
		await page.getByRole("button", { name: "Production Live user-facing" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.waitForTimeout(300);

		// Step 2: sensitivity
		await page.getByRole("button", { name: "Regulated data" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.waitForTimeout(300);

		// Step 3: exposure
		await page.getByRole("button", { name: "Public (strong auth)" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.waitForTimeout(300);

		// Step 4: auth
		await page.getByRole("button", { name: "OIDC / OAuth" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.waitForTimeout(300);

		// Step 5: compliance (multi)
		await page.getByRole("button", { name: "SOC 2" }).click();
		await page.getByRole("button", { name: "GDPR" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.waitForTimeout(300);

		// Review
		await expect(page.getByText(/Review your answers/i)).toBeVisible();
		await page.getByRole("button", { name: /Confirm & Apply/i }).click();

		// Banner visible
		await expect(page.getByText(/Security Context/i)).toBeVisible();
		await expect(page.getByText(/Env: prod/i)).toBeVisible();
		await expect(page.getByText(/Sensitivity: regulated/i)).toBeVisible();
	});

	test("handles unknown answers conservatively", async ({ page }) => {
		const button = page.getByRole("button", { name: /configure context|update context/i });
		await button.click();
		
		// Wait for wizard to load and scroll to content
		await page.waitForTimeout(500);
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		// Select unknowns for all questions
		await page.getByRole("button", { name: "Unknown / Not sure" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();

		await page.getByRole("button", { name: "Unknown / Not sure" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();

		await page.getByRole("button", { name: "Unknown / Not sure" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();

		await page.getByRole("button", { name: "Unknown / Not sure" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();

		await page.getByRole("button", { name: "Unknown / Not sure" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();

		// Review and confirm
		await page.getByRole("button", { name: /Confirm & Apply/i }).click();

		// Check for conservative note
		await expect(page.getByText(/Unknown answers treated conservatively/i)).toBeVisible();
	});

	test("allows editing answers in review step", async ({ page }) => {
		const button = page.getByRole("button", { name: /configure context|update context/i });
		await button.click();
		
		// Wait for wizard to load and scroll to content
		await page.waitForTimeout(500);
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		// Quick path to review
		await page.getByRole("button", { name: "Production Live user-facing" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.waitForTimeout(1000);
		
		// Check if we're on the next step
		await expect(page.getByRole("heading", { name: "Data Sensitivity" })).toBeVisible();
		await page.getByRole("button", { name: "Contains PII" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Private network only" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "mTLS" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click(); // Skip compliance

		// In review, edit the second item (data sensitivity)
		await page.getByRole("button", { name: "Edit" }).nth(1).click();

		// Should be back at data sensitivity question
		await expect(page.getByRole("heading", { name: "Data Sensitivity" })).toBeVisible();
		await page.getByRole("button", { name: "Regulated data" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();

		// Should skip to review again
		await page.waitForTimeout(1000);
		await expect(page.getByText(/Review your answers/i)).toBeVisible();
		await expect(page.getByText(/Regulated data/i)).toBeVisible();
	});

	test("can cancel wizard and return to scorecard", async ({ page }) => {
		const button = page.getByRole("button", { name: /configure context|update context/i });
		await button.click();
		
		// Wait for wizard to load and scroll to content
		await page.waitForTimeout(500);
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		// Cancel from first question
		await page.getByRole("button", { name: "Close" }).click();

		// Should be back to scorecard
		await expect(page.getByText(/MCP Security Scorecard/i)).toBeVisible();
		await expect(button).toBeVisible();
	});

	test("can start over from review step", async ({ page }) => {
		const button = page.getByRole("button", { name: /configure context|update context/i });
		await button.click();
		
		// Wait for wizard to load and scroll to content
		await page.waitForTimeout(500);
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		// Quick path to review
		await page.getByRole("button", { name: "Production Live user-facing" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.waitForTimeout(500);
		await page.getByRole("button", { name: "Contains PII" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Private network only" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "mTLS" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click(); // Skip compliance

		// Start over
		await page.getByRole("button", { name: "Start Over" }).click();

		// Should be back at first question
		await expect(page.getByRole("heading", { name: "Environment Type" })).toBeVisible();
	});
});