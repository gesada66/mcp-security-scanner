# Phase 2
# TEST PLAN: Discovery Wizard

## Scenarios
- User answers all questions → confirm → Scorecard updates.
- User chooses "Unknown" → conservative multiplier applied.
- User edits answers in review → correct step reopened.
- User resets → wizard restarts at Q1.

## E2E Paths
1. Full happy path (prod + regulated + public strong + mTLS + SOC2).
2. Minimal path with unknowns → check conservative behavior.
3. Reset mid-way → start over.

## A11y Checks
- Radiogroup roles with labels.
- Focus management (focus on new question).
- Keyboard navigation (arrow keys, enter).
- Lighthouse a11y ≥ 90 (dev + prod).

## Env-specific gates
- Perf score runs only on prod build.
- A11y checks valid in dev and prod.

# Phase 3
# TEST PLAN — Threat Validation (Phase 3–5)

## Scope
Validate detection and prioritization for five key MCP threats:
1) Trojan MCP servers
2) Over-privileged tools
3) Cross-server parasitic flows (exfil chains)
4) Identity fragmentation / long-lived credentials
5) Memory poisoning (advisory)

## Test Layers (apply to each threat)
1. **Rule / Unit Tests** — inputs → findings → severity/score mapping.
2. **Static Fixtures** — known-good / known-bad configs (precision & recall).
3. **E2E (staging)** — run scanner end-to-end; verify UI & exports.
4. **Adversarial Tests** — crafted payloads/graphs to prove real exploit patterns are caught.
5. **Negative Tests** — compliant configs produce no findings (avoid false positives).
6. **Regression** — snapshot findings/score to detect drift across releases.
7. **Gates** — a11y ≥ 90 (dev/prod); perf measured only on prod build.

## Environment Rules
- **Accessibility**: Run Lighthouse a11y in dev and prod; target ≥ 90.
- **Performance**: Only measure on production build (`next build && next start`) or staging URL.
- **Data**: Use synthetic/sample configs only (no production secrets).

---

## Per-Threat Validation Matrix

### 1) Trojan MCP Servers
**Validate**
- Server integrity (hash/signature), source registry trust, suspicious endpoints.

**Fixtures**
- `fixtures/trojan_server.bad.json` — unknown source, mismatched hash, external exfil URL.
- `fixtures/vetted_server.good.json` — signed/pinned, vetted registry.

**E2E**
- Import bad → finding appears with *critical/high* severity + remediation.
- Import good → no finding.

**Adversarial**
- Swap package URL/hash → detection must trigger.

**Pass/Fail**
- 0 false positives on vetted.
- 100% detection on altered trojan sample.

---

### 2) Over-Privileged Tools
**Validate**
- Tool scopes/permissions vs least-privilege baseline (read/write/delete to sensitive resources).

**Fixtures**
- `fixtures/tool_scope.over.json` — broad write/delete to sensitive resources.
- `fixtures/tool_scope.least.json` — minimal, action-specific scopes.

**E2E**
- Over-scoped → prioritized as top fix (esp. prod/regulated).
- Least-priv → no finding.

**Adversarial**
- Add one dangerous permission to otherwise least config → severity increases.

**Pass/Fail**
- Prod+regulated multipliers raise severity; dev+none reduces.

---

### 3) Cross-Server Parasitic Flows (Exfil Chains)
**Validate**
- Static graph analysis: A→B→C chain to external sink; identify untrusted edges.

**Fixtures**
- `fixtures/graph.exfil.json` — path to external sink present.
- `fixtures/graph.safe.json` — internal-only, no sink.

**E2E**
- Exfil graph flagged with chain shown in finding details.
- Safe graph → no finding.

**Adversarial**
- Introduce alias/indirect hop; detector still flags chain.

**Pass/Fail**
- Must flag any path to external sink; 0 FPs on safe.

---

### 4) Identity Fragmentation / Long-Lived Credentials
**Validate**
- Shared credentials across tools; TTL too long; missing rotation policy.

**Fixtures**
- `fixtures/identity.shared.json` — same token across multiple tools.
- `fixtures/identity.ephemeral.json` — scoped, short-lived, rotation policy.

**E2E**
- Shared/long-lived flagged (high in prod).
- Ephemeral passes.

**Adversarial**
- Increase TTL beyond policy threshold → severity bump.

**Pass/Fail**
- FP rate near zero on ephemeral sample; shared/long-lived always detected.

---

### 5) Memory Poisoning (Advisory)
**Validate**
- Persistent memory enabled without guardrails (sanitization, TTL, approvals).

**Fixtures**
- `fixtures/memory.open.json` — persistent memory, no sanitization/TTL.
- `fixtures/memory.guarded.json` — sanitization, TTL, approval gates.

**E2E**
- Open → advisory finding (not blocking) with policy recommendations.
- Guarded → no advisory.

**Adversarial**
- Seed known “poison” marker; advisory still appears (policy focus, not content analysis).

**Pass/Fail**
- Advisory only (no severity inflation beyond policy intent); no FP on guarded.

---

## Cross-Cutting Checks

### Context Weighting (Discovery)
- Run a subset of each threat under:
  - **Profile A**: prod + regulated
  - **Profile B**: dev + none  
- Verify severity/score shift aligns with multipliers.

### Exports
- JSON/PDF include: threat id, rationale, remediation, (optional) control mappings.

### A11y
- Radiogroups, labels, focus order, keyboard (arrows/enter/tab).
- Lighthouse a11y ≥ 90 (dev + prod).

### Perf Gate
- Only measured on prod build/staging.
- Note score but don’t block delivery unless catastrophic.

---

## “Done” Definition
- All per-threat fixtures pass (positive + negative + adversarial).
- Regression snapshots updated and green.
- a11y gates met in dev & prod; perf checked in prod.
- Findings include rationale + remediation; no placeholder text.
# Phase 3
fixtures/external folder is for External test patterns referenced from: mcp-scan, mcpscan.ai examples, OWASP LLM Top-10, Lakera PINT, Hugging Face datasets.

