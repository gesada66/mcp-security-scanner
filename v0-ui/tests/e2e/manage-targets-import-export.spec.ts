import { test, expect } from "@playwright/test";

test.describe("Manage Targets — Import/Export & CRUD (P4)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/manage-targets");
  });

  test("can add, export, import, and see grid refresh", async ({ page }) => {
    // Add a target
    await page.getByTestId("add-target-btn").click();
    await page.getByLabel("Name").fill("Demo Server");
    await page.getByLabel("Endpoint").fill("https://demo.example.com");
    await page.getByLabel("Credential Alias").fill("demo-cred");
    await page.getByLabel("Owner Team").fill("Security");
    await page.getByLabel("Owner Email").fill("sec@example.com");
    await page.getByTestId("form-save-btn").click();

    // Export
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("export-btn").click(),
    ]);
    expect(await download.suggestedFilename()).toMatch(/targets\.export\.v1\.json/);

    // Simulate Import by uploading the same file back
    const path = await download.path();
    await page.getByTestId("import-btn").click();
    // Since our Import button is label-wrapped, trigger the actual file input
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(path!);

    // Grid should exist (at least one card)
    await page.waitForTimeout(300);
    await expect(page.getByTestId(/target-card-/)).toBeVisible();
  });
});


