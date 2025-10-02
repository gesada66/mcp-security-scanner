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

## 📋 **Detailed Phase 3 Feature Documentation**

### 🛡️ **Threat Detection Capabilities**

#### **1. Trojan Server Detection (MCP-001 to MCP-003)**
- **Integrity Verification**: Detects hash mismatches and tampering indicators
- **Source Trust Analysis**: Validates server sources against trusted registries
- **Egress Monitoring**: Identifies suspicious network connections and data exfiltration paths
- **Risk Levels**: Critical (integrity failure, suspicious egress), High (untrusted source)

#### **2. Over-Privileged Tools Detection (MCP-004 to MCP-006)**
- **Scope Analysis**: Validates tool permissions against intended functionality
- **Principle of Least Privilege**: Ensures tools only have necessary access rights
- **Context-Aware**: Adjusts severity based on data sensitivity (regulated, PII environments)
- **Risk Levels**: High (filesystem access on non-file tools), Medium (mail access on non-mail tools)

#### **3. Exfil Chain Detection (MCP-007 to MCP-010)**
- **Graph Analysis**: Traces data flow paths through MCP server networks
- **External Sink Detection**: Identifies suspicious external data destinations
- **Trust Validation**: Flags untrusted nodes in data processing chains
- **Chain Length Analysis**: Detects overly complex data flows that may indicate exfiltration
- **Risk Levels**: Critical (external sinks, direct sensitive paths), High (untrusted nodes), Medium (long chains)

#### **4. Identity Issues Detection (MCP-011 to MCP-016)**
- **Shared Credential Detection**: Identifies tokens used across multiple services
- **Token Lifecycle Management**: Validates TTL policies and rotation schedules
- **Usage Pattern Analysis**: Detects excessive token usage and privilege violations
- **Policy Compliance**: Ensures adherence to security best practices
- **Risk Levels**: Critical (very long-lived tokens), High (shared tokens, no rotation), Medium (weak policies)

#### **5. Memory Poisoning Detection (MCP-017 to MCP-021)**
- **Sanitization Validation**: Ensures memory is properly cleared between sessions
- **Retention Policy Analysis**: Validates data retention periods and lifecycle management
- **Approval Gate Verification**: Ensures controlled access to persistent memory
- **Risk Factor Correlation**: Detects multiple compounding security risks
- **Risk Levels**: Critical (unsanitized persistent memory, very long retention), High (excessive retention), Medium (missing approval gates)

### 🔧 **Technical Implementation Details**

#### **Detection Engine Architecture**
- **Modular Design**: Each threat type has dedicated detection functions
- **Orchestrator Pattern**: Central `detectThreats()` function coordinates all detectors
- **Type Safety**: Full TypeScript implementation with comprehensive interfaces
- **Extensible**: Easy to add new threat types following established patterns

#### **Testing Strategy**
- **Unit Tests**: 49 tests covering individual detection logic and edge cases
- **E2E Tests**: 28 tests validating complete user workflows and integrations
- **Fixture-Based Testing**: 10 realistic test scenarios (5 bad + 5 good configurations)
- **Context Validation**: Tests verify discovery wizard integration and weighting

#### **Integration Points**
- **Discovery Wizard**: Context weighting affects threat severity calculations
- **Scoring Engine**: Findings integrate with weighted risk scoring system
- **UI Components**: Seamless integration with existing scorecard interface
- **Data Sources**: Support for JSON configuration files and real-time analysis

### 📊 **Risk Assessment Framework**

#### **Severity Classification**
- **Critical**: Immediate security threats requiring urgent attention
- **High**: Significant security risks that should be addressed promptly
- **Medium**: Moderate risks that should be planned for remediation
- **Low**: Minor issues that can be addressed in regular maintenance

#### **Context-Aware Weighting**
- **Environment Type**: Production environments receive higher risk multipliers
- **Data Sensitivity**: Regulated/PII data increases threat severity
- **Compliance Requirements**: Industry standards influence risk calculations
- **Exposure Level**: Public-facing systems receive additional scrutiny

### 🎯 **Usage Scenarios**

#### **Development Teams**
- **Pre-deployment Scanning**: Validate MCP configurations before production
- **CI/CD Integration**: Automated security checks in deployment pipelines
- **Configuration Review**: Regular assessment of MCP server security posture

#### **Security Teams**
- **Risk Assessment**: Comprehensive evaluation of MCP security landscape
- **Compliance Auditing**: Validate adherence to security policies and standards
- **Incident Response**: Identify and prioritize security findings for remediation

#### **DevOps Teams**
- **Infrastructure Monitoring**: Continuous validation of MCP server configurations
- **Policy Enforcement**: Ensure consistent security practices across environments
- **Automated Remediation**: Integration with security automation tools

### 🔮 **Future Enhancement Opportunities**

#### **Advanced Detection**
- **Machine Learning**: Behavioral analysis for anomaly detection
- **Real-time Monitoring**: Continuous threat detection and alerting
- **Custom Rules**: User-defined security policies and detection rules

#### **Integration Expansion**
- **SIEM Integration**: Export findings to security information systems
- **API Endpoints**: RESTful API for programmatic access
- **Webhook Support**: Real-time notifications for security events

#### **Reporting & Analytics**
- **Trend Analysis**: Historical security posture tracking
- **Executive Dashboards**: High-level security metrics and KPIs
- **Compliance Reporting**: Automated generation of audit reports