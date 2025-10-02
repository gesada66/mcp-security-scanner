import type { RiskFinding, ScanInputProfile } from "@/lib/types";
import { generateScorecard } from "@/lib/scoring";

export interface FixturePayload {
	profile?: ScanInputProfile;
	findings: RiskFinding[];
}

export async function fetchScorecardFromFixture(path: string = "/scorecard.json") {
	const res = await fetch(path, { cache: "no-store" });
	if (!res.ok) throw new Error(`Failed to load fixture: ${res.status}`);
	const json = (await res.json()) as FixturePayload;
	return generateScorecard(json.findings ?? [], json.profile);
}

export async function fetchFixturePayload(path: string = "/scorecard.json"): Promise<FixturePayload> {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load fixture: ${res.status}`);
    const json = (await res.json()) as FixturePayload;
    return json;
}

import { detectThreats } from "@/lib/threats";
import type { MCPServerConfig, ToolScopeConfig, GraphConfig, IdentityConfig, MemoryConfig } from "@/lib/types";

/**
 * Threat-specific fixture adapters for Phase 3 validation.
 * Step 1: Trojan server detection
 */

export async function fetchTrojanServerFixture(path: string): Promise<FixturePayload> {
	const res = await fetch(path, { cache: "no-store" });
	if (!res.ok) throw new Error(`Failed to load trojan fixture: ${res.status}`);
	const config = (await res.json()) as MCPServerConfig;
	
	const findings = detectThreats({ trojan: config });
	return { findings };
}

/**
 * Step 2: Over-privileged tools detection
 */
export async function fetchToolScopeFixture(path: string): Promise<FixturePayload> {
	const res = await fetch(path, { cache: "no-store" });
	if (!res.ok) throw new Error(`Failed to load tool scope fixture: ${res.status}`);
	const config = (await res.json()) as ToolScopeConfig;
	
	const findings = detectThreats({ privilege: config });
	return { findings };
}

/**
 * Step 3: Exfil chain detection
 */
export async function fetchGraphFixture(path: string): Promise<FixturePayload> {
	const res = await fetch(path, { cache: "no-store" });
	if (!res.ok) throw new Error(`Failed to load graph fixture: ${res.status}`);
	const config = (await res.json()) as GraphConfig;
	
	const findings = detectThreats({ exfil: config });
	return { findings };
}

/**
 * Step 4: Identity issues detection
 */
export async function fetchIdentityFixture(path: string): Promise<FixturePayload> {
	const res = await fetch(path, { cache: "no-store" });
	if (!res.ok) throw new Error(`Failed to load identity fixture: ${res.status}`);
	const config = (await res.json()) as IdentityConfig;
	
	const findings = detectThreats({ identity: config });
	return { findings };
}

/**
 * Step 5: Memory poisoning detection
 */
export async function fetchMemoryFixture(path: string): Promise<FixturePayload> {
	const res = await fetch(path, { cache: "no-store" });
	if (!res.ok) throw new Error(`Failed to load memory fixture: ${res.status}`);
	const config = (await res.json()) as MemoryConfig;
	
	const findings = detectThreats({ memory: config });
	return { findings };
}







