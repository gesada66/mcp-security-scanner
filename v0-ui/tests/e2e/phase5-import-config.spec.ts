import { test, expect } from "@playwright/test";
import path from "path";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3001";
const rootFixtures = path.resolve(__dirname, "../../../fixtures"); // from v0-ui/tests/e2e

test.describe("Phase 5 - MCP Config Import & Static Scan", () => {
  test("import vetted good config → save target → run static scan", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.getByRole("button", { name: /Manage Targets/i }).click();

    // Open import dialog then upload vetted good config
    await page.getByTestId("open-import-dialog").click();
    // Fallback: if dialog did not open via direct button, use menu → item
    try {
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 500 });
    } catch {
      await page.getByTestId("import-btn").click();
      await page.getByTestId("import-mcp-menuitem").click();
      await expect(page.getByRole("dialog")).toBeVisible();
    }
    await page.locator('#mcp-import-file').setInputFiles(path.join(rootFixtures, "vetted_server.good.json"));

    // Preview modal should appear with redaction chip
    await expect(page.getByText(/Secrets redacted/i)).toBeVisible();
    await page.getByRole("button", { name: /Confirm & Save/i }).click();

    // Target card visible
    await expect(page.getByText(/Imported MCP/i)).toBeVisible();

    // Run static scan
    await page.getByRole("button", { name: /Run Scan/i }).first().click();
    await expect(page.getByText(/Static findings:/i)).toBeVisible();
  });

  test("import trojan bad config → findings > 0", async ({ page }) => {
    await page.goto(`${BASE}/targets`);
    // Open import dialog then upload bad config
    await page.getByTestId("open-import-dialog").click();
    try {
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 500 });
    } catch {
      await page.getByTestId("import-btn").click();
      await page.getByTestId("import-mcp-menuitem").click();
      await expect(page.getByRole("dialog")).toBeVisible();
    }
    await page.locator('#mcp-import-file').setInputFiles(path.join(rootFixtures, "trojan_server.bad.json"));
    await page.getByRole("button", { name: /Confirm & Save/i }).click();

    // Run static scan
    await page.getByRole("button", { name: /Run Scan/i }).first().click();

    // Assert some non-zero findings and score presence
    await expect(page.getByText(/Static findings:\s*[1-9]\d*/i)).toBeVisible();
    await expect(page.getByText(/Score/i)).toBeVisible();
  });
});