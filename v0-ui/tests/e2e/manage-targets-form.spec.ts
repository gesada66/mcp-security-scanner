import { test, expect } from "@playwright/test";

test.describe("Manage Targets — Form (M3)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001/manage-targets");
  });

  test("opens form from Add Target and shows autosave indicator", async ({ page }) => {
    await page.getByTestId("add-target-btn").click();
    await expect(page.getByTestId("target-form")).toBeVisible();

    // Type a name and check autosave indicator updates
    await page.getByLabel("Name").fill("Finance MCP");
    await page.waitForTimeout(400);
    await expect(page.getByText(/All changes saved/i)).toBeVisible();
  });

  test("validates required fields and url format", async ({ page }) => {
    await page.getByTestId("add-target-btn").click();
    await page.getByTestId("form-save-btn").click();

    await expect(page.getByText(/Name is required/)).toBeVisible();
    await expect(page.getByText(/Environment is required/)).not.toBeVisible(); // default provided
    await expect(page.getByText(/Type is required/)).not.toBeVisible(); // default provided

    await page.getByLabel("Endpoint").fill("not-a-url");
    await page.getByTestId("form-save-btn").click();
    await expect(page.getByText(/Endpoint must be a valid URL/)).toBeVisible();
  });

  test("cancel closes the form view", async ({ page }) => {
    await page.getByTestId("add-target-btn").click();
    await expect(page.getByTestId("target-form")).toBeVisible();
    await page.getByTestId("form-cancel-btn").click();
    await expect(page.getByTestId("target-form")).toHaveCount(0);
  });
});


