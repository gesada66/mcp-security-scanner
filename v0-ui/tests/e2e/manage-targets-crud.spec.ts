import { test, expect } from "@playwright/test";

test.describe("Manage Targets — CRUD & Test (P4)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/manage-targets");
  });

  test("add → test connection → edit → delete", async ({ page }) => {
    // Add
    await page.getByTestId("add-target-btn").click();
    await page.getByLabel("Name").fill("CRUD Server");
    await page.getByLabel("Endpoint").fill("https://crud.example.com");
    await page.getByLabel("Credential Alias").fill("crud-cred");
    await page.getByLabel("Owner Team").fill("Ops");
    await page.getByLabel("Owner Email").fill("ops@example.com");
    await page.getByTestId("form-save-btn").click();

    // Click Test (should set status to connected and show toast)
    const testBtn = page.getByTestId("test-connection-btn").first();
    await testBtn.click();
    await page.waitForTimeout(200);

    // Badge should update to connected somewhere
    await expect(page.getByText(/connected/i).first()).toBeVisible();

    // Edit
    await page.getByTestId("edit-target-btn").first().click();
    await page.getByLabel("Name").fill("CRUD Server Updated");
    await page.getByTestId("form-save-btn").click();

    // Updated name should be visible on card
    await expect(page.getByText("CRUD Server Updated").first()).toBeVisible();

    // Delete
    await page.getByTestId("delete-target-btn").first().click();
    await page.waitForTimeout(200);
    // Grid might be empty or entries reduced; basic expectation: no card with updated name
    await expect(page.getByText("CRUD Server Updated")).toHaveCount(0);
  });
});


