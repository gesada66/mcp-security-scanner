// Compose: config → detectThreats → scoring
import { detectThreats } from "@/lib/threats"; // existing orchestrator
import { computeScore } from "@/lib/scoring";  // returns number score
import type { MCPServerConfig, ToolScopeConfig, GraphConfig, IdentityConfig, MemoryConfig } from "@/lib/types";

export type StaticScanResult = {
  findings: unknown[];
  score: number;
};

export type StaticScanOutcome =
  | { ok: true; result: StaticScanResult }
  | { ok: false; error: string };

export async function runStaticScan(canonicalConfig: unknown): Promise<StaticScanOutcome> {
  try {
    // Map minimal canonical to threat inputs (deterministic stub)
    const inputs: {
      trojan?: MCPServerConfig;
      privilege?: ToolScopeConfig;
      exfil?: GraphConfig;
      identity?: IdentityConfig;
      memory?: MemoryConfig;
    } = {};
    const cfg = (canonicalConfig ?? {}) as Record<string, unknown>;
    if (cfg) {
      inputs.trojan = {
        server: {
          name: String((cfg["name"] ?? "Imported MCP")),
          source: String((cfg["endpoint"] ?? "unknown")),
          integrityVerified: false,
        },
        network: { egressAllow: [] },
      };
      const rawTools = Array.isArray(cfg["tools"]) ? (cfg["tools"] as unknown[]) : [];
      inputs.privilege = {
        tools: rawTools.map(() => ({ name: "tool", scopes: [] as string[] })),
        sensitivity: String(cfg["sensitivity"] ?? "unknown"),
      };
      inputs.exfil = { graph: { nodes: [], edges: [] } };
      inputs.identity = { auth: { tokens: [] } };
      inputs.memory = { memory: { persistent: false, sanitization: true, retentionHours: 0, approvalForWrites: true } };
    }
    const findings = detectThreats(inputs);
    const score = computeScore(findings);
    return { ok: true, result: { findings, score } };
  } catch (e: unknown) {
    const err = e as { message?: string };
    return { ok: false, error: err?.message ?? "Static scan failed" };
  }
}