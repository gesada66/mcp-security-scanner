import { redactSecretsWithMeta } from "./redactSecrets";
// Shape: accept unknown but return a minimal canonical subset for targets + detectors
export type CanonicalConfig = {
  name?: string;
  endpoint?: string;
  env?: "dev"|"stage"|"prod"|"unknown";
  sensitivity?: "internal"|"confidential"|"regulated"|"unknown";
  authMethod?: "none"|"apiKey"|"oidc"|"unknown";
  credentialAlias?: string | null;
  tools?: unknown[]; // detectors will interpret
  memory?: unknown;
  identity?: unknown;
  graph?: unknown;
  __raw?: unknown;
};

export function parseMcpJson(text: string): CanonicalConfig {
  try {
    const json = JSON.parse(text) as unknown;
    const { data } = redactSecretsWithMeta<Record<string, unknown>>(json as Record<string, unknown>);
    const redacted = data as Record<string, unknown>;
    const getStr = (k: string): string | undefined => {
      const v = redacted[k];
      return typeof v === "string" ? v : undefined;
    };
    // conservative picks; everything else remains available under __raw for detectors
    const cfg: CanonicalConfig = {
      name: getStr("name") ?? getStr("serverName") ?? "Imported MCP",
      endpoint: getStr("endpoint") ?? getStr("url"),
      env: (getStr("env") as CanonicalConfig["env"]) ?? "unknown",
      sensitivity: (getStr("sensitivity") as CanonicalConfig["sensitivity"]) ?? "unknown",
      authMethod: (getStr("authMethod") as CanonicalConfig["authMethod"]) ?? "unknown",
      credentialAlias: getStr("credentialAlias") ?? null,
      tools: (redacted["tools"] ?? redacted["capabilities"]) as unknown[] | undefined,
      memory: redacted["memory"] ?? redacted["memoryPolicy"],
      identity: redacted["identity"] ?? redacted["auth"],
      graph: redacted["graph"],
      __raw: redacted
    };
    return cfg;
  } catch (e: unknown) {
    const err = e as { message?: string };
    const msg = e instanceof SyntaxError ? "Invalid JSON" : "Parse error";
    throw new Error(`${msg}: ${err?.message ?? String(e)}`);
  }
}

export function parseMcpJsonWithMeta(text: string): { config: CanonicalConfig; redactions: number; unknownKeys: string[] } {
  const original = JSON.parse(text) as Record<string, unknown>;
  const keys = new Set(Object.keys(original));
  const config = parseMcpJson(text);
  const known = new Set([
    "name","serverName","endpoint","url","env","sensitivity","authMethod","credentialAlias",
    "tools","capabilities","memory","memoryPolicy","identity","auth","graph"
  ]);
  const unknownKeys = Array.from(keys).filter(k => !known.has(k));
  const { redactions } = redactSecretsWithMeta(original);
  return { config, redactions, unknownKeys };
}