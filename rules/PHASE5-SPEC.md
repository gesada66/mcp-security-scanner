# Phase 5 — MCP Config Import & Static Scan (SPEC)

> Goal: Let users import an MCP server configuration file (JSON/YAML/manifest/TS export) in **Manage Targets**, auto-populate target metadata, and run a **local rule-based static analysis**. E2E tests must run via **Playwright (MCP in Cursor)**.

## Scope (MVP)
- **In**: Client-side file parsing (JSON, YAML), safe TS export parsing (static only), schema validation (zod), redaction of secrets, preview+confirm, save to IndexedDB, run `detectThreats()` static analysis, surface findings + score, import/export JSON.
- **Out** (MVP): Uploading raw files to server, remote AI normalization, live endpoint auth, multi-file project crawls, PDF export.

## User Stories
1. As a security engineer, I can **import** `mcp.json` to auto-fill a target and immediately see static findings.
2. As an auditor, I get a **preview** showing extracted fields with **secret values redacted** before I save.
3. As a platform owner, I can **re-run static scan** from the target card to verify changes.
4. As a user, I can **export** the merged results with a flag that indicates the source: “Static Config Import”.

## File Types (priority order)
1) `mcp.json`, `mcp.yaml`/`yml`, `.mcp.json`  
2) `server.manifest.json` (if present, enrich only)  
3) `tool_scope.json|yaml`, `memory.config.json`, `identity.config.json` (optional enrichers)

> Branch rules: **If** multiple files are imported together, **then** `mcp.*` is the canonical base; **if** only enrichers are provided, **then** import is allowed but marked `base: unknown`.

## Security & Privacy
- All parsing **local-only**; do **not** transmit files.  
- Auto-redact any key/value with `/token|secret|password|key/i`.  
- Never persist raw secrets; store **aliases** only.  
- Show banner: “We parse locally and redact potentially sensitive values. Always verify results.”  
- “Explain with AI” is **disabled** by default (feature-flagged; optional later). (May vary by account/version)

## Data Model Additions
Extend `Target` with:
```ts
{
  source?: "manual" | "config-import",
  sourceFiles?: string[],         // e.g., ["mcp.json", "tool_scope.json"]
  lastStaticScanAt?: number,      // epoch ms
  lastStaticFindings?: number,    // count
  lastStaticScore?: number        // computed overall score
}
