import type { RiskFinding, RiskSeverity, ScanInputProfile, Scorecard, ScoringOptions, SeverityDistribution } from "./types";

/**
 * Default weights reflect conservative security posture: critical > high > medium > low.
 */
const DEFAULT_SEVERITY_WEIGHTS: Record<RiskSeverity, number> = {
	critical: 10,
	high: 6,
	medium: 3,
	low: 1,
};

const DEFAULT_OPTIONS: Required<ScoringOptions> = {
    severityWeights: DEFAULT_SEVERITY_WEIGHTS,
    productionRiskMultiplier: 1.25,
};

/**
 * Compute a 0–100 score where 100 is best (no risk). The model subtracts
 * weighted risk impact from 100, bounded at [0, 100].
 *
 * The impact of each finding is the severity weight possibly multiplied by a
 * production environment factor.
 */
export function computeScore(
	findings: RiskFinding[],
	profile?: ScanInputProfile,
	options?: ScoringOptions
): number {
	const opts = { ...DEFAULT_OPTIONS, ...options, severityWeights: { ...DEFAULT_OPTIONS.severityWeights, ...(options?.severityWeights ?? {}) } };
    const isProduction = (profile?.environmentType ?? "").toLowerCase() === "production";
    const envMultiplier = isProduction ? opts.productionRiskMultiplier : 1.0;
    const sensitivity = (profile?.dataSensitivity ?? "").toLowerCase();
    // Additional conservative multiplier based on data sensitivity
    const sensitivityMultiplier = sensitivity.includes("pii") || sensitivity.includes("health") || sensitivity.includes("financial")
        ? 1.1
        : 1.0;

    const totalImpact = findings.reduce((sum, f) => {
        const weight = opts.severityWeights[f.severity];
        return sum + weight * envMultiplier * sensitivityMultiplier;
    }, 0);

	const raw = 100 - totalImpact;
	return Math.max(0, Math.min(100, Math.round(raw)));
}

/**
 * Create a distribution of severities for quick rendering.
 */
export function calculateSeverityDistribution(findings: RiskFinding[]): SeverityDistribution {
	return findings.reduce<SeverityDistribution>((acc, f) => {
		acc[f.severity] += 1;
		return acc;
	}, { critical: 0, high: 0, medium: 0, low: 0 });
}

/**
 * Sort findings by priority: severity weight descending, preserving input order
 * for equal weights to keep deterministic stable ordering.
 */
export function prioritiseFindings(
	findings: RiskFinding[],
	options?: ScoringOptions
): RiskFinding[] {
	const weights = { ...DEFAULT_SEVERITY_WEIGHTS, ...(options?.severityWeights ?? {}) };
	// Stable sort: decorate-sort-undecorate pattern
	const decorated = findings.map((f, idx) => ({ f, idx, w: weights[f.severity] }));
	decorated.sort((a, b) => {
		if (b.w !== a.w) return b.w - a.w;
		return a.idx - b.idx; // stable
	});
	return decorated.map(d => d.f);
}

/**
 * Produce a full scorecard from inputs with conservative defaults.
 */
export function generateScorecard(
	findings: RiskFinding[],
	profile?: ScanInputProfile,
	options?: ScoringOptions
): Scorecard {
	const score = computeScore(findings, profile, options);
	const distribution = calculateSeverityDistribution(findings);
	const prioritisedFindings = prioritiseFindings(findings, options);
	return { score, distribution, prioritisedFindings };
}


