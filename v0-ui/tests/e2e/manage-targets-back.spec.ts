import { test, expect } from "@playwright/test";

test.describe("Manage Targets navigation", () => {
  test("Back goes to home scorecard", async ({ page, baseURL }) => {
    await page.goto(baseURL + "/manage-targets");
    await page.getByRole("button", { name: /back$/i }).click();
    await expect(page).toHaveURL(new RegExp(`${baseURL}/?$`));
    await expect(page.getByRole("heading", { name: /mcp security scorecard/i })).toBeVisible();
  });
});


