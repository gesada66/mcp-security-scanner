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
	            ? "next dev --turbopack"
	            : "next dev --turbopack",
	        url: "http://localhost:3001",
	        reuseExistingServer: !process.env.CI,
	        cwd: __dirname,
	        timeout: 120_000,
	        env: { PORT: "3001", NEXT_PUBLIC_DISCOVERY_WIZARD: "true" },
	    },
});


