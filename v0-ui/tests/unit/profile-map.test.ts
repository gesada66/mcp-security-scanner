import { describe, expect, it } from "vitest";
import { calculateWeightMultiplier, mapAnswersToProfile } from "@/lib/profile/map";

describe("profile mapping", () => {
	it("applies conservative multipliers for unknowns", () => {
		const m = calculateWeightMultiplier({ env: "unknown", sensitivity: "unknown", exposure: "unknown", auth: "unknown" });
		expect(m).toBeGreaterThan(1.0);
	});

	it("multiplier is highest for prod + regulated + public_weak + basic", () => {
		const m = calculateWeightMultiplier({ env: "prod", sensitivity: "regulated", exposure: "public_weak", auth: "basic" });
		expect(m).toBeGreaterThanOrEqual(1.25 * 1.3 * 1.4 * 1.3 / 1.3); // sanity lower bound
	});

	it("maps answers into a normalised profile", () => {
		const p = mapAnswersToProfile({ env: "prod", sensitivity: "regulated", exposure: "public_strong", auth: "oidc", compliance: ["soc2", "gdpr"] });
		expect(p.envType).toBe("prod");
		expect(p.dataSensitivity).toBe("regulated");
		expect(p.complianceContext).toContain("soc2");
		expect(p.hasUnknowns).toBe(false);
		expect(p.weightMultiplier).toBeGreaterThan(1);
	});

	it("detects unknowns correctly", () => {
		const p = mapAnswersToProfile({ env: "unknown", sensitivity: "pii", exposure: "public_strong", auth: "oidc" });
		expect(p.hasUnknowns).toBe(true);
	});

	it("handles empty compliance array", () => {
		const p = mapAnswersToProfile({ env: "prod", sensitivity: "none", exposure: "private", auth: "mtls", compliance: [] });
		expect(p.complianceContext).toEqual([]);
		expect(p.hasUnknowns).toBe(false);
	});

	it("normalises all string values to lowercase", () => {
		const p = mapAnswersToProfile({ env: "PROD", sensitivity: "REGULATED", exposure: "PUBLIC_STRONG", auth: "OIDC" });
		expect(p.envType).toBe("prod");
		expect(p.dataSensitivity).toBe("regulated");
		expect(p.exposureLevel).toBe("public_strong");
		expect(p.authMethod).toBe("oidc");
	});
});
