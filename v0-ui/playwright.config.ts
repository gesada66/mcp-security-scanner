import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	reporter: [["list"]],
	use: {
		baseURL: "http://localhost:3001",
		trace: "off",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    webServer: {
        command: process.platform === "win32"
            ? "cross-env PORT=3001 next dev --turbopack"
            : "PORT=3001 next dev --turbopack",
        url: "http://localhost:3001",
        reuseExistingServer: !process.env.CI,
        cwd: __dirname,
        timeout: 120_000,
    },
});


