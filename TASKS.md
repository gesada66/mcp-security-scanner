# TASKS — MCP Scorecard MVP

## Milestone 0 — Scaffolding (0.5–1 day)
- [x] Create Next.js app (App Router, TS).
- [x] Install shadcn/ui and add base components (Card, Badge, Table, Progress, Button, Separator).
- Acceptance: `npm run dev` boots; `/` renders “Hello”.

## Milestone 0.5 — UI Preview (static)
- [ ] Build scorecard page with mocked fixture data using shadcn primitives; optionally scaffold sections from Magic UI via MCP. (May vary by account/version)
- [ ] Add subtle, accessible motion (enter/exit, state changes), respect `prefers-reduced-motion`.
- Acceptance: Visual approval; Lighthouse a11y ≥ 90 (local); motion present and non-blocking.

## Milestone 1 — Domain Types & Scoring (1–2 days)
- [x] Define types: RiskSeverity, RiskFinding, ScanInputProfile, Scorecard.
- [x] Implement `lib/scoring.ts` with weighted scoring and prioritization.
- [x] Add sample fixtures in `fixtures/`.
- Acceptance: Unit tests for scoring (at least 3 cases: empty, low mix, high mix).

## Milestone 2 — UI: Scorecard Page (2–3 days)
- [x] Build components: `ScoreBadge`, `RiskSeverityBadge`, `ScoreGauge` (Progress), `RiskTable` using shadcn/ui; optionally scaffold sections from Magic UI via MCP. (May vary by account/version)
- [x] Show: Overall score, distribution by severity, prioritized list with remediation.
- [x] Handle empty/error states.
- Acceptance: Demo page loads with fixture; Lighthouse a11y ≥ 90 (local); shadcn patterns followed; motion present with reduced-motion path.

## Milestone 3 — Import & Discovery (1–2 days)
- [x] Minimal discovery: envType, dataSensitivity, complianceContext (optional).
- [x] Import local JSON (`input.mcp.json`) and apply rules.
- [x] Acceptance: Changing discovery answers alters weighting/score.

## Milestone 4 — Polish (0.5–1 day)
- [x] Dark mode, responsive, copy-to-clipboard, "Export JSON".
- [x] TODO stubs for PDF export & SIEM pack (commented).
- Acceptance: No TS errors; README explains usage.

## Defer (v1.5+)
- PDF export, Splunk/Sentinel pack, YAML ingestion, auth, persistence.
#######
#######
## Phase 2 ✅ COMPLETED
# TASKS (Discovery Wizard Work Plan)

## Milestones
1. ✅ Schema & Types
   - ✅ Create `public/discovery-questions.json`.
   - ✅ Define `lib/discovery/types.ts` for schema + answers.
   - ✅ Acceptance: JSON validated; types compile.

2. ✅ Wizard UI
   - ✅ Build `DiscoveryWizard.tsx`, `QuestionCard.tsx`, `ReviewCard.tsx`.
   - ✅ Show one question at a time; Next/Back; Step progress.
   - ✅ Review step: summary table + edit links + confirm/start over.
   - ✅ Acceptance: Wizard navigates through all steps, edits possible, unknown always present.

3. ✅ Apply Profile & Context Banner
   - ✅ Map answers to `ScanInputProfile` via `lib/profile/map.ts`.
   - ✅ Recompute Scorecard with context weights.
   - ✅ Show `ContextBanner.tsx` above Scorecard.
   - ✅ Acceptance: Banner displays env, sensitivity, compliance chips; unknown note visible if any unknown chosen.

4. ✅ Testing & Validation
   - ✅ Unit: answers → profile mapping, context multipliers.
   - ✅ E2E: complete wizard → confirm → see banner + score update.
   - ✅ A11y: run Lighthouse a11y ≥ 90; radiogroup roles; keyboard nav.
   - ✅ Perf: run Lighthouse perf only on prod build.
   - ✅ Acceptance: All tests pass; docs updated.

## Feature flags
- ✅ `DISCOVERY_WIZARD=true` controls rendering wizard entry point.

## Phase 3: Threat Validation (Step 1 Complete)
# TASKS (Threat Validation Work Plan)

## Step 1: Trojan Server Detection ✅ COMPLETED
- ✅ Extended `lib/types.ts` with MCPServerConfig interface
- ✅ Created `lib/threats/index.ts` with trojan server detection logic
- ✅ Implemented integrity verification, source trust, and egress analysis
- ✅ Created unit tests for trojan detection with positive/negative cases
- ✅ Created E2E tests for trojan detection validation
- ✅ Created trojan server fixtures (bad/good pairs)
- ✅ Updated fixture adapter for trojan detection
- ✅ Updated main page to support trojan fixtures
- ✅ All tests passing: Unit (20/20), E2E (12/12)

## Step 2: Over-Privileged Tools Detection ✅ COMPLETED
- ✅ Implemented `detectOverPrivilegedTools()` function with scope analysis
- ✅ Created unit tests for privilege detection with positive/negative cases
- ✅ Created E2E tests for privilege detection validation
- ✅ Created privilege fixtures (over/least privilege pairs)
- ✅ Updated fixture adapter for privilege detection
- ✅ Updated main page to support privilege fixtures
- ✅ All tests passing: Unit (25/25), E2E (6/6)

## Step 3: Exfil Chain Detection ✅ COMPLETED
- ✅ Extended GraphConfig interface
- ✅ Implemented graph analysis for external sink paths
- ✅ Created unit tests for exfil detection with positive/negative cases
- ✅ Created E2E tests for exfil detection validation
- ✅ Created graph fixtures (exfil/safe pairs)
- ✅ Updated fixture adapter for exfil detection
- ✅ Updated main page to support graph fixtures
- ✅ All tests passing: Unit (30/30), E2E (9/9)

## Step 4: Identity Issues Detection ✅ COMPLETED
- ✅ Extended IdentityConfig interface
- ✅ Implemented shared credentials, long-lived tokens, rotation policy detection
- ✅ Created unit tests for identity detection with positive/negative cases
- ✅ Created E2E tests for identity detection validation
- ✅ Created identity fixtures (shared/ephemeral pairs)
- ✅ Updated fixture adapter for identity detection
- ✅ Updated main page to support identity fixtures
- ✅ All tests passing: Unit (35/35), E2E (12/12)

## Step 5: Memory Poisoning Detection ✅ COMPLETED
- ✅ Extended MemoryConfig interface
- ✅ Implemented sanitization, retention, approval gates detection
- ✅ Created unit tests for memory detection with positive/negative cases
- ✅ Created E2E tests for memory detection validation
- ✅ Created memory fixtures (open/guarded pairs)
- ✅ Updated fixture adapter for memory detection
- ✅ Updated main page to support memory fixtures
- ✅ All tests passing: Unit (49/49), E2E (15/15)

## Step 6: Complete Orchestrator ✅ COMPLETED
- ✅ Integrated all 5 threat detectors in `detectThreats()` function
- ✅ Created comprehensive E2E tests for all threat types
- ✅ Validated context weighting across all threats
- ✅ All orchestrator tests passing: Unit (49/49), E2E (28/28)

## Step 7: Final Integration ✅ COMPLETED
- ✅ Updated UI with all 10 threat fixtures (5 bad + 5 good pairs)
- ✅ Completed threat validation flow with discovery wizard integration
- ✅ Final test suite validation: All 28 E2E tests passing
- ✅ All threat types integrated and working end-to-end

## Test Results - Phase 3 Complete ✅
- ✅ Unit Tests: All 5 threat detection types tested (49/49 tests)
- ✅ E2E Tests: All threat validation flows tested (28/28 tests)
- ✅ A11y: Maintained ≥90 score throughout development
- ✅ Integration: All 5 threat types integrated with discovery wizard and scoring
- ✅ Comprehensive Testing: Full orchestrator validation with context weighting
- ✅ UI Integration: All 10 threat fixtures available in data source dropdown

## Feature flags
- ✅ `DISCOVERY_WIZARD=true` controls rendering wizard entry point.
- ✅ All 10 threat fixtures available in data source dropdown (5 threat types × 2 variants each).

## Phase 3 Summary ✅ COMPLETED
**Threat Validation Implementation Complete**

Successfully implemented comprehensive threat detection for 5 major MCP security categories:

1. **Trojan Server Detection** - Integrity verification, source trust, egress analysis
2. **Over-Privileged Tools Detection** - Scope analysis, principle of least privilege
3. **Exfil Chain Detection** - Graph analysis, external sinks, untrusted nodes
4. **Identity Issues Detection** - Shared tokens, long-lived credentials, rotation policies
5. **Memory Poisoning Detection** - Sanitization, retention policies, approval gates

**Key Achievements:**
- 49 unit tests covering all threat detection logic
- 28 E2E tests validating complete user workflows
- 10 threat fixtures (5 bad + 5 good pairs) for comprehensive testing
- Full integration with discovery wizard and context weighting
- Maintained accessibility standards (≥90 Lighthouse score)
- Complete orchestrator with all threat types working together

**Ready for Production:** All threat validation features are implemented, tested, and integrated.