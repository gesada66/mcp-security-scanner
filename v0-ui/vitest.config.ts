import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { URL } from "node:url";

export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./", import.meta.url)),
		},
	},
	test: {
		globals: true,
		environment: "node",
		include: ["tests/unit/**/*.test.ts"],
		coverage: {
			reporter: ["text", "lcov"],
			include: ["lib/**/*.ts"],
			exclude: ["**/*.test.ts", "**/*.spec.ts"],
		},
	},
});
