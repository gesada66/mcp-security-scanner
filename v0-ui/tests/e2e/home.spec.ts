import { test, expect } from "@playwright/test";

test("scorecard renders with sections", async ({ page }) => {
	await page.goto("/");
	await page.waitForLoadState("networkidle");
	
	// Check for main heading (more flexible)
	await expect(page.getByText("MCP Security Scorecard")).toBeVisible();
	
	// Check for key sections
	await expect(page.getByText("Overall Security Score")).toBeVisible();
	await expect(page.getByText("Risk Distribution")).toBeVisible();
	await expect(page.getByText("Prioritised Security Findings")).toBeVisible();
	
	// Check for action buttons
	await expect(page.getByText("Export Report")).toBeVisible();
	await expect(page.getByText("View Details")).toBeVisible();

    // Assert dynamic computed values from the fixture (score = 75)
    await expect(page.getByTestId("overall-score")).toHaveText("75");
    await expect(page.getByText("Critical").first()).toBeVisible();
    await expect(page.getByText("High").first()).toBeVisible();
    await expect(page.getByText("Medium").first()).toBeVisible();
    await expect(page.getByText("Low").first()).toBeVisible();

    await expect(page.getByText("Public MCP server without auth")).toBeVisible();
    await expect(page.getByText("Missing request auditing")).toBeVisible();
    await expect(page.getByText("No input schema validation")).toBeVisible();
    await expect(page.getByText("No prefers-reduced-motion handling")).toBeVisible();
});

test("environment selector affects score and source toggle works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Default is production profile, expect the score displayed (from default fixture) to be visible
    await expect(page.getByTestId("overall-score")).toHaveText("75");

    // Switch to development environment
    const envSelect = page.getByLabel("Environment");
    await envSelect.selectOption("development");

    // Switch to alternate fixture source
    const srcSelect = page.getByLabel("Data Source");
    await srcSelect.selectOption("/input.mcp.json");

    // For development, multiplier is off -> expected score with alt fixture remains 90
    await expect(page.getByTestId("overall-score")).toHaveText("90");

    // Switch to production and high sensitivity to see reduction due to multipliers
    await envSelect.selectOption("production");
    const sensSelect = page.getByLabel("Data Sensitivity");
    await sensSelect.selectOption("PII + Financial");
    // With production (1.25) and sensitivity (1.1): impact = (6+3+1)*1.25*1.1 = 13.75 => ~86
    await expect(page.getByTestId("overall-score")).toHaveText("86");
});

test("export controls present and copy JSON works", async ({ page, context }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Buttons present
    await expect(page.getByRole("button", { name: "Export JSON" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy JSON" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Export PDF" })).toBeVisible();
    // Exercise copy action (clipboard APIs in headless may not persist; we just ensure it does not throw)
    await page.getByRole("button", { name: "Copy JSON" }).click();
});


