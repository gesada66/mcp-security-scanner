/**
 * Domain types for the MCP Security Scorecard.
 *
 * All types are designed for stability and testability, with
 * conservative assumptions and clear naming. British English is used in
 * documentation/comments per repository standards.
 */

/**
 * Risk severities ordered from most to least severe.
 */
export type RiskSeverity = "critical" | "high" | "medium" | "low";

/**
 * Context detected or provided during discovery which may influence weighting.
 */
export interface ScanInputProfile {
	/** e.g. "production" | "staging" | "development" */
	environmentType?: string;
	/** e.g. "none" | "pii" | "financial" | "health" (free text acceptable) */
	dataSensitivity?: string;
	/** Optional compliance context such as "pci", "hipaa", "soc2" */
	complianceContext?: string[];
}

/**
 * A single risk finding derived from configuration/rule evaluation.
 */
export interface RiskFinding {
	/** Stable identifier, typically rule id (e.g., "MCP-001"). */
	id: string;
	/** Human-friendly title of the finding. */
	title: string;
	severity: RiskSeverity;
	/** Why this matters in practical terms. */
	rationale?: string;
	/** Next best action to remediate the risk. */
	remediation?: string;
	/** Optional references/links (rendered as list). */
	refs?: string[];
}

/**
 * Distribution of findings by severity.
 */
export interface SeverityDistribution {
	critical: number;
	high: number;
	medium: number;
	low: number;
}

/**
 * Scorecard result after computing weighted score and prioritisation.
 */
export interface Scorecard {
	/** Overall score from 0 (worst) to 100 (best). */
	score: number;
	/** Count of findings by severity. */
	distribution: SeverityDistribution;
	/** Findings ordered from highest to lowest priority. */
	prioritisedFindings: RiskFinding[];
}

/**
 * Options controlling how scoring behaves. Defaults are safe and conservative.
 */
export interface ScoringOptions {
	/** Base weights per severity (higher means more impact on score). */
	severityWeights?: Record<RiskSeverity, number>;
	/**
 	 * Optional environment factor applied as a multiplier to risk impact when
 	 * environmentType is "production". Other values use 1.0 by default.
 	 */
	productionRiskMultiplier?: number;
}

// Threat Detection Types (Phase 3)

/**
 * MCP Server configuration for trojan detection.
 */
export interface MCPServerConfig {
	server: {
		name: string;
		source: string;
		expectedHash?: string;
		actualHash?: string;
		integrityVerified: boolean;
	};
	network?: {
		egressAllow?: string[];
	};
}

/**
 * Tool scope configuration for privilege analysis.
 */
export interface ToolScopeConfig {
	tools: Array<{
		name: string;
		scopes: string[];
	}>;
	sensitivity?: string;
}

/**
 * Graph configuration for exfil chain detection.
 */
export interface GraphConfig {
	graph: {
		nodes: string[];
		edges: [string, string][];
	};
	trust?: Record<string, boolean>;
	externalSinks?: string[];
}

/**
 * Identity/auth configuration for credential analysis.
 */
export interface IdentityConfig {
	auth: {
		tokens: Array<{
			id: string;
			ttlSeconds: number;
			usedBy: string[];
		}>;
		rotationPolicyDays?: number;
	};
}

/**
 * Memory configuration for poisoning risk detection.
 */
export interface MemoryConfig {
	memory: {
		persistent: boolean;
		sanitization: boolean;
		retentionHours: number;
		approvalForWrites: boolean;
	};
}
