# Fixtures — Threat Validation

This folder contains static JSON fixtures used to validate detection of the 5 core MCP security threats in Phase 3–5.  
Fixtures provide **known-good** and **known-bad** examples so tests can check precision (no false positives) and recall (catch real issues).

---

## Structure

- **Trojan MCP servers**
  - `trojan_server.bad.json` — server from untrusted source, hash mismatch, exfil egress.
  - `vetted_server.good.json` — trusted registry source, hash verified, safe egress.

- **Over-privileged tools**
  - `tool_scope.over.json` — tools with broad read/write/delete permissions.
  - `tool_scope.least.json` — tools with least-privilege, scoped permissions.

- **Cross-server parasitic flows**
  - `graph.exfil.json` — graph with path A→B→ExternalSink (exfil path).
  - `graph.safe.json` — graph with only trusted internal nodes.

- **Identity fragmentation / long-lived credentials**
  - `identity.shared.json` — token reused across tools, TTL too long, no rotation.
  - `identity.ephemeral.json` — short-lived token, scoped, rotation in place.

- **Memory poisoning (advisory)**
  - `memory.open.json` — persistent memory, no sanitization, no approval.
  - `memory.guarded.json` — persistent memory with guardrails (sanitization, TTL, approval).

---

## Usage

1. **Unit / Rule Tests**  
   - Feed each `.json` into rule functions (e.g. `mapThreats()`) and assert severity matches expected.

2. **E2E Tests**  
   - Run scanner end-to-end using these fixtures as input.  
   - Verify findings surface correctly in **Scorecard** and **export (JSON/PDF)**.

3. **Adversarial Tests**  
   - Modify fixture slightly (e.g., increase TTL, swap hash, add exfil node) → ensure detection changes accordingly.

4. **Negative Tests**  
   - `*.good.json` fixtures must produce **no findings**.

5. **Regression**  
   - Snapshot findings/score per fixture.  
   - Compare on each run to detect drift.

---

## Notes
- Fixtures are **synthetic** — no production secrets.  
- Use them as baselines to avoid regressions.  
- Extend with new threats as ruleset expands.  
