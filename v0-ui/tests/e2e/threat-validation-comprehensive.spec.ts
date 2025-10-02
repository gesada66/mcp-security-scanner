import { test, expect } from "@playwright/test";

test.describe("Threat Validation - Comprehensive (All 5 Threat Types)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3001/");
	});

	test("validates all threat types are detected", async ({ page }) => {
		// Test each threat type fixture
		const threatFixtures = [
			{
				name: "Trojan Server",
				path: "/threat-fixtures/trojan/bad.json",
				expectedFindings: [
					"MCP Server integrity verification failed",
					"MCP Server from untrusted source",
					"Suspicious network egress configuration"
				]
			},
			{
				name: "Over-Privileged Tools",
				path: "/threat-fixtures/privilege/over.json",
				expectedFindings: [
					"Tool has unnecessary filesystem access",
					"Tool has unnecessary mail access",
					"Tool has excessive privileges for sensitive data"
				]
			},
			{
				name: "Exfil Chain",
				path: "/threat-fixtures/graph/exfil.json",
				expectedFindings: [
					"External data sinks detected in graph",
					"Untrusted nodes in data flow graph",
					"Long data flow chains detected",
					"Direct paths from sensitive data to external sinks"
				]
			},
			{
				name: "Identity Issues",
				path: "/threat-fixtures/identity/shared.json",
				expectedFindings: [
					"Shared authentication token detected",
					"Long-lived authentication token detected",
					"Very long-lived authentication token detected",
					"Weak token rotation policy",
					"Token used by excessive number of services"
				]
			},
			{
				name: "Memory Poisoning",
				path: "/threat-fixtures/memory/open.json",
				expectedFindings: [
					"Persistent memory without sanitization",
					"Excessive memory retention period",
					"Very long memory retention period",
					"Persistent memory writes without approval gates",
					"Multiple memory poisoning risk factors detected"
				]
			}
		];

		for (const fixture of threatFixtures) {
			// Select the fixture
			const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
			await dataSourceSelect.selectOption(fixture.path);
			
			// Wait for findings to load
			await page.waitForTimeout(1000);
			
			// Verify expected findings are present
			for (const finding of fixture.expectedFindings) {
				await expect(page.getByText(finding).first()).toBeVisible();
			}
			
			// Verify severity levels are present
			await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
			await expect(page.locator('div:has-text("High")').first()).toBeVisible();
			
			// Verify score is affected
			await expect(page.getByText(/Overall Security Score/)).toBeVisible();
			
			// Verify score is less than 100
			const scoreText = await page.getByText(/Overall Security Score/).textContent();
			const score = parseInt(scoreText?.match(/\d+/)?.[0] || "0");
			expect(score).toBeLessThan(100);
		}
	});

	test("validates clean configurations produce no findings", async ({ page }) => {
		// Test each clean fixture
		const cleanFixtures = [
			"/threat-fixtures/trojan/good.json",
			"/threat-fixtures/privilege/least.json",
			"/threat-fixtures/graph/safe.json",
			"/threat-fixtures/identity/ephemeral.json",
			"/threat-fixtures/memory/guarded.json"
		];

		for (const fixture of cleanFixtures) {
			// Select the fixture
			const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
			await dataSourceSelect.selectOption(fixture);
			
			// Wait for findings to load
			await page.waitForTimeout(1000);
			
			// Check for no findings or perfect score
			const noFindings = page.getByText("No findings detected");
			const perfectScore = page.getByText("Score: 100");
			
			// Either no findings or perfect score should be visible
			await expect(noFindings.or(perfectScore)).toBeVisible();
		}
	});

	test("validates context weighting affects all threat types", async ({ page }) => {
		// Configure high-risk context
		const button = page.getByRole("button", { name: /configure context/i });
		await button.click();
		
		// Configure production + regulated context
		await page.getByRole("button", { name: "Production Live user-facing" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Regulated data" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Public (weak/basic auth)" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Basic / custom headers" }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click();
		await page.getByRole("button", { name: "Next", exact: true }).click(); // Skip compliance
		await page.getByRole("button", { name: /Confirm & Apply/i }).click();
		
		// Test that context weighting affects scores for all threat types
		const threatFixtures = [
			"/threat-fixtures/trojan/bad.json",
			"/threat-fixtures/privilege/over.json",
			"/threat-fixtures/graph/exfil.json",
			"/threat-fixtures/identity/shared.json",
			"/threat-fixtures/memory/open.json"
		];

		for (const fixture of threatFixtures) {
			// Select the fixture
			const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
			await dataSourceSelect.selectOption(fixture);
			
			// Wait for findings to load
			await page.waitForTimeout(1000);
			
			// Verify findings are present
			await expect(page.locator('div:has-text("Critical")').first()).toBeVisible();
			
			// Score should be lower due to context weighting
			const scoreText = await page.getByText(/Overall Security Score/).textContent();
			const score = parseInt(scoreText?.match(/\d+/)?.[0] || "0");
			expect(score).toBeLessThan(100);
		}
	});

	test("validates threat detection orchestrator integration", async ({ page }) => {
		// This test verifies that the orchestrator properly integrates all threat types
		// by checking that multiple threat types can be detected in sequence
		
		const threatFixtures = [
			"/threat-fixtures/trojan/bad.json",
			"/threat-fixtures/privilege/over.json",
			"/threat-fixtures/graph/exfil.json",
			"/threat-fixtures/identity/shared.json",
			"/threat-fixtures/memory/open.json"
		];

		let totalFindings = 0;
		
		for (const fixture of threatFixtures) {
			// Select the fixture
			const dataSourceSelect = page.locator('select[aria-label="Data Source"]');
			await dataSourceSelect.selectOption(fixture);
			
			// Wait for findings to load
			await page.waitForTimeout(1000);
			
			// Count findings for this fixture
			const findings = page.locator('tbody tr');
			const count = await findings.count();
			totalFindings += count;
			
			// Verify that findings are present
			expect(count).toBeGreaterThan(0);
		}
		
		// Verify that we detected findings across all threat types
		expect(totalFindings).toBeGreaterThan(10);
	});
});
