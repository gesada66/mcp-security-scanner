import { test, expect } from "@playwright/test";

test.describe("Home navigation", () => {
  test("Manage Targets button navigates to /manage-targets", async ({ page, baseURL }) => {
    await page.goto(baseURL + "/");
    await page.getByRole("button", { name: /manage targets/i }).click();
    await expect(page).toHaveURL(/\/manage-targets$/);
    await expect(page.getByRole("heading", { name: /manage targets/i })).toBeVisible();
  });
});


