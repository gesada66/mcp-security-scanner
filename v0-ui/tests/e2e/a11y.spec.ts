import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
    test("home has no serious/critical a11y violations", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"]) // standard checks
            .analyze();

        const violations = results.violations.filter(v => ["critical"].includes(v.impact || ""));
        if (violations.length > 0) {
            console.log("A11y violations:", violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })));
            violations.forEach(violation => {
                console.log(`\nViolation: ${violation.id} (${violation.impact})`);
                violation.nodes.forEach((node, index) => {
                    console.log(`  Node ${index + 1}: ${node.html}`);
                    console.log(`  Target: ${node.target.join(', ')}`);
                });
            });
        }
        expect(violations.length, "Serious/critical accessibility violations found").toBe(0);
    });
});


