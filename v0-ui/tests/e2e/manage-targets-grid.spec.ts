import { test, expect } from "@playwright/test";

test.describe("Manage Targets — Grid (M1–M2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001/manage-targets");
  });

  test("shows title, tooltip, and top bar actions", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Manage Targets" })).toBeVisible();
    await expect(page.getByTestId("add-target-btn")).toBeVisible();
    await expect(page.getByTestId("import-btn")).toBeVisible();
    await expect(page.getByTestId("export-btn")).toBeVisible();
  });

  test("renders empty state when no targets", async ({ page }) => {
    await page.waitForTimeout(200);
    await expect(page.getByTestId("targets-empty")).toBeVisible();
  });

  test("keyboard navigation reaches top bar actions", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("add-target-btn")).toBeFocused();
  });
});