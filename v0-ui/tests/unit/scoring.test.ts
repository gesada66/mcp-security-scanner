import { describe, it, expect } from "vitest";
import { computeScore, generateScorecard, prioritiseFindings, calculateSeverityDistribution } from "@/lib/scoring";
import type { RiskFinding } from "@/lib/types";

describe("scoring", () => {
	it("returns 100 for empty findings", () => {
		const score = computeScore([]);
		expect(score).toBe(100);
	});

	it("handles a low/medium mix with reasonable deduction", () => {
		const findings: RiskFinding[] = [
			{ id: "R1", title: "Minor logging gap", severity: "low" },
			{ id: "R2", title: "Missing schema validation", severity: "medium" },
		];
		const score = computeScore(findings);
		// default weights: low=1, medium=3 => total impact 4 => 96
		expect(score).toBe(96);
	});

	it("applies production multiplier for high/critical mix", () => {
		const findings: RiskFinding[] = [
			{ id: "R3", title: "Public server no auth", severity: "critical" },
			{ id: "R4", title: "No audit logs", severity: "high" },
		];
		const score = computeScore(findings, { environmentType: "production" });
		// impact = (10 + 6) * 1.25 = 20 => 80
		expect(score).toBe(80);
	});

	it("generates a consistent scorecard and priority ordering", () => {
		const findings: RiskFinding[] = [
			{ id: "A", title: "Medium issue", severity: "medium" },
			{ id: "B", title: "Critical issue", severity: "critical" },
			{ id: "C", title: "Low issue", severity: "low" },
			{ id: "D", title: "High issue", severity: "high" },
		];
		const card = generateScorecard(findings);
		expect(card.score).toBe(100 - (10 + 6 + 3 + 1));
		expect(card.distribution).toEqual({ critical: 1, high: 1, medium: 1, low: 1 });
		expect(card.prioritisedFindings.map(f => f.id)).toEqual(["B", "D", "A", "C"]);
	});

	it("calculates severity distribution correctly for empty", () => {
		const dist = calculateSeverityDistribution([]);
		expect(dist).toEqual({ critical: 0, high: 0, medium: 0, low: 0 });
	});
});


