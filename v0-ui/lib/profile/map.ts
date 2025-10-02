import type { DiscoveryAnswers, DiscoveryProfile } from "@/lib/discovery/types";

/**
 * Deterministic, conservative mapping from answers → profile and multiplier.
 * Unknowns increase multiplier (worst-case bias).
 */
export function mapAnswersToProfile(answers: DiscoveryAnswers): DiscoveryProfile {
	const hasUnknowns =
		(answers.env === "unknown") ||
		(answers.sensitivity === "unknown") ||
		(answers.exposure === "unknown") ||
		(answers.auth === "unknown") ||
		(Array.isArray(answers.compliance) && answers.compliance.includes("unknown"));

	const weightMultiplier = calculateWeightMultiplier(answers);

	return {
		envType: normalise(answers.env ?? "unknown"),
		dataSensitivity: normalise(answers.sensitivity ?? "unknown"),
		exposureLevel: normalise(answers.exposure ?? "unknown"),
		authMethod: normalise(answers.auth ?? "unknown"),
		complianceContext: answers.compliance ?? [],
		hasUnknowns,
		weightMultiplier,
	};
}

/**
 * Multiplier is a product of factors; rounded to 2 dp for display stability.
 */
export function calculateWeightMultiplier(answers: DiscoveryAnswers): number {
	let m = 1.0;

	// Environment
	if (answers.env === "prod") m *= 1.25;
	else if (!answers.env || answers.env === "unknown") m *= 1.4;

	// Sensitivity
	if (answers.sensitivity === "regulated") m *= 1.3;
	else if (answers.sensitivity === "pii") m *= 1.2;
	else if (!answers.sensitivity || answers.sensitivity === "unknown") m *= 1.3;

	// Exposure
	if (answers.exposure === "public_weak") m *= 1.4;
	else if (answers.exposure === "public_strong") m *= 1.2;
	else if (!answers.exposure || answers.exposure === "unknown") m *= 1.2;

	// Authentication
	if (answers.auth === "basic" || answers.auth === "none") m *= 1.3;
	else if (!answers.auth || answers.auth === "unknown") m *= 1.15;

	// Compliance does not increase risk by itself; it governs obligations.

	return Math.round(m * 100) / 100;
}

function normalise(v: string) {
	return v.toLowerCase();
}
