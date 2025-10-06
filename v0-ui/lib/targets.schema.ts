import { z } from "zod";

const SecretLike = /(token|secret|api[_-]?key|password)/i;

export const TargetSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["mcp", "agent", "connector"]),
  name: z.string().min(1).max(120),
  endpoint: z.string().url(),
  env: z.enum(["dev", "staging", "prod"]),
  sensitivity: z.enum(["none", "internal", "pii", "regulated"]),
  authMethod: z.enum(["oidc", "mtls", "apikey", "unknown"]),
  credentialAlias: z.string().min(1),
  tags: z.array(z.string().min(1)).max(20).default([]),
  owner: z.object({
    team: z.string().min(1),
    email: z.string().email(),
  }),
  compliance: z.array(z.string().min(1)).max(20).default([]),
  scan: z.object({
    includeInBatch: z.boolean().default(true),
    frequency: z.enum(["manual", "daily", "weekly"]).default("manual"),
  }),
  status: z.enum(["connected", "pending", "error"]).default("pending"),
  createdAt: z.number().nonnegative(),
  updatedAt: z.number().nonnegative(),
  // Phase 5 metadata for imported MCP configs
  source: z.enum(["manual", "config-import"]).default("manual"),
  sourceFiles: z.array(z.string().min(1)).optional(),
  lastStaticScan: z
    .object({ findingsCount: z.number().nonnegative(), score: z.number().min(0).max(100) })
    .optional(),
}).refine(obj => {
  const kv = JSON.stringify(obj);
  return !SecretLike.test(kv);
}, { message: "Secret-like content detected. Use credentialAlias; do not include secrets." });

export type Target = z.infer<typeof TargetSchema>;

export const TargetsExportSchema = z.object({
  schemaVersion: z.literal(1),
  targets: z.array(TargetSchema),
});
export type TargetsExport = z.infer<typeof TargetsExportSchema>;