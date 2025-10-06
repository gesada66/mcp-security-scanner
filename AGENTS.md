# AGENTS

> Goal: Ship an MCP Security Scorecard MVP: config scan → weighted risk score → prioritized findings → 1-click PDF export (later). UI: Next.js (App Router) + shadcn/ui.

## Global Rules (STRICT MODE)
- Two-step by default: draft → self-evaluate (rubric below) → revise → final.
- If user says “freeform”, bypass two-step and ship best effort.
- Any claim about vendor features or APIs that may change → append: “(May vary by account/version)”.
- Do **not** invent non-existent APIs. If uncertain, stub and clearly mark `TODO`.
- Branch instructions style: “If A then X / If B then Y” whenever decisions are needed.

## Rubric (use for self-eval before finalizing)
- Clarity: Is the change obvious and documented?
- Minimalism: Did we ship only what’s needed for MVP?
- Reliability: Types, error states, empty states handled?
- UX Cohesion: shadcn/ui patterns; accessible; responsive.
- Extensibility: Types + folder layout won’t fight v1.5 (SIEM pack later).
- Testability: Key logic isolated (e.g., scoring).
- Security: No secrets in code; safe defaults.

## Agents

### 1) Product Architect
- Define minimal surfaces (types, folders, naming).
- Produce acceptance criteria per task.
- If tension between scope/quality → bias to MVP minimalism.

### 2) Security SME
- Maintain `rules/*.yaml` (MCP best practices).
- Map each rule to: id, title, severity, rationale, remediation, refs.
- Keep severities conservative; avoid vendor-specific assumptions.

### 3) Fullstack Engineer
- Build UI (Next + shadcn/ui as primary system), augment with Magic UI blocks via MCP servers (`shadcn-official`, `shadcn-enhanced`, `shadcn-blocks`, `@magicuidesign/mcp`, “Magic MCP”). (May vary by account/version)
- Implement `lib/scoring.ts` (pure functions, unit-testable).
- Create `adapters/` for scan input (JSON/YAML).
- Zero backend complexity for now (static/demo data OK).

### 4) QA / DX
- Add sample fixtures in `fixtures/`.
- Verify mobile/desktop, dark mode, empty/error states.
- Lint & typecheck must pass.
- Enforce DevTestOps gates: static analysis, unit, integration/contract, E2E (Playwright via MCP), visual regression, accessibility (a11y ≥ 90 local), security scans, coverage (≥80% for core logic), smoke/config checks. Failures block merge.
- Performance/load testing: **Required only in preprod/prod environments** - not mandatory for local development or feature branches.
- Ensure E2E teardown discipline (Ctrl+C), minimise flakiness, maintain test utilities.
  - E2E must be executed after EACH task/feature completion and before reporting status as "done". Prefer Playwright MCP for runs. Keep dev server at `http://localhost:3001`.

### 5) Docs Writer
- Keep `README.md` concise: setup, run, where to edit rules.
- Add inline docs in code blocks (JSDoc).

## Working Agreement
- Small PRs.
- Keep TODOs with owner + date.
- Breaking changes require updating `TASKS.md` acceptance criteria.
- UI-first workflow: deliver static, data-mocked screens (shadcn + Magic UI via MCP) for visual review/approval before wiring logic or adapters.
- UI must be clear, aesthetically appealing, and motion-rich where it adds clarity. Aim for smooth 60 fps; respect `prefers-reduced-motion`; provide non-animated fallbacks.
############
############
## Phase 2
# AGENTS (Cursor IDE Guidance & Constraints)

## Product goals & scope
- Introduce a **Discovery Wizard** before running MCP scans.
- Collect deployment context (environment, data sensitivity, exposure, auth, compliance).
- Use answers to adjust scoring weights and show a context banner above the Scorecard.
- Keep lean (5 questions for v1).

## Scope boundaries
- **In scope:** Schema-driven wizard, review/confirm step, context banner, weighted scoring.
- **Out of scope (MVP):** AI-based doc parsing, dynamic inference, auto-remediation.

## Non-negotiables
- Security: No secrets in code; answers stored in session/local state only.
- Accessibility: Lighthouse a11y ≥ 90 in dev and prod. Radiogroups, focus reset, keyboard navigation required.
- Performance: Perf score only valid on production builds (`next build && next start`).
- Test gates: Unit tests for mapping; E2E test for full wizard → scorecard flow.

## Decision rules
- Prefer **determinism** (rules-based mapping) over LLM inference.
- Unknown answers always treated conservatively (worst-case).
- Favor clarity > completeness. If user fatigue risk, fewer questions.
- UI must reuse theme tokens, no hardcoded colors.

## UI/UX principles
- One question per screen (wizard flow).
- Progress indicator (e.g., Step X of 5).
- Final review/confirm step before applying.
- Context banner summarizing answers above Scorecard.
- Component library: shadcn/ui + Tailwind (semantic tokens).
# (Phase 4)
# Manage Targets — Feature Definition

## Goal
Replace “Configure Servers” with **Manage Targets** and introduce a unified, card-based UI for defining, viewing, and configuring MCP servers and (future) Agentic AI assets.

## Scope
- Button rename across dashboard UI and navigation.
- New **Manage Targets** page:
  - Lists all defined MCP/Agentic assets as interactive cards.
  - Allows Add / Edit / Delete / Test Connection.
  - Supports offline persistence (draft + local store).
- No credentials stored in plain text; only credential aliases.
- Export / Import JSON for portability.

## Non-negotiables
- No storage of raw secrets or tokens.
- a11y ≥ 90 Lighthouse score in dev & prod.
- Performance gates only in prod build.
- Light-weight local persistence (IndexedDB + localStorage drafts).

## Decision Rules
- Local persistence now → server DB later (when multi-user).
- Use existing dark-theme + Shadcn component system.
- Autosave drafts automatically; explicit “Save” writes to IndexedDB.
- Tooltip clarifies dual purpose: *“Add, edit, or configure servers and agents included in security assessments.”*

## Trade-off Preferences
| Priority | Decision |
|-----------|-----------|
| Simplicity > Complexity | Favor local store over backend |
| Security > Convenience | No secret values persisted |
| Consistency > Novelty | Match current UI components & spacing |

## UI / UX Principles
- Each target represented by a **card** with header, body, footer actions.
- Cards visually aligned with Scorecard / Risk components.
- Keyboard navigable; focus rings visible; tooltips accessible.
- Light animations; minimal color accents consistent with theme palette.

## Phase 5 — Setup, Installation, and Test Execution (for Cursor Agent)

- Actions are local-only; never upload raw configs. Unknowns handled conservatively.

### Install
```bash
# From repo root
cd v0-ui

# Install dependencies
npm ci

# Phase 5 parser dependency
npm i yaml
```

### Develop
```bash
# Start dev server on port 3001
npm run dev:3001
# Open http://localhost:3001
```

### Quality Gates
- Lint + build must pass.
- Unit coverage ≥ 80% for core logic (`lib/scoring.ts`, adapters, `scanRunner.ts`).
- A11y Lighthouse ≥ 90 (dev).
- E2E: Phase 5 import/scan flow must pass locally and in CI.
- Perf: Only required on production build.

### Lint, Typecheck, Build
```bash
npm run lint
npm run build
```

### Unit Tests
```bash
# With coverage (saves lcov)
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
# Ensure dev server is running on 3001
npm run dev:3001

# Run E2E
npm run e2e

# Optional: specify base URL
E2E_BASE_URL=http://localhost:3001 npm run e2e
```

- E2E artefacts: screenshots/videos on failure saved under `v0-ui/test-results/`.
- After each run, terminate sessions cleanly via Ctrl+C.

### Accessibility & Performance
```bash
# Dev a11y audit (saves JSON report)
npx lighthouse http://localhost:3001 --only-categories=accessibility --quiet --chrome-flags='--headless=new' --output=json --output-path=./lighthouse-a11y-report-final.json

# Production perf audit (build, start, run)
npm run perf:lighthouse
```

### Phase 5 Acceptance (must pass)
- Import MCP config preview shows redaction count + unknown keys.
- On confirm: target stored with `source:"config-import"`, optional static scan.
- `runStaticScan()` deterministic; bad file → clear error, no partial persistence.

### Security & Persistence
- Redaction happens locally; raw secrets are never persisted.
- Only non-sensitive metadata is stored: IndexedDB (targets), localStorage (drafts).
- Imported targets must include `source:"config-import"` and optional `sourceFiles`.

### Operational Notes
- Unknown values are treated conservatively (worst case) in scoring.
- Static scans are deterministic: repeated imports produce identical findings/score.
- Bad imports: show a clear error with filename; do not persist any partial state.

### CI Invocation
```bash
# Lint + build + unit tests + E2E (dev server required for E2E)
npm run lint
npm run build
npm run test:coverage
npm run dev:3001 &
E2E_BASE_URL=http://localhost:3001 npm run e2e
# Stop the dev server (Windows PowerShell)
Stop-Process -Name node -ErrorAction SilentlyContinue
```

### Teardown Discipline
- After E2E, terminate the dev server with Ctrl+C (or Stop-Process on Windows) to avoid orphaned processes.
- Ensure screenshots/videos on failure are saved under `v0-ui/test-results/`.

### Accessibility & Reports
- Keep Lighthouse a11y ≥ 90 in dev; save the report to `v0-ui/lighthouse-a11y-report-final.json`.
- Production performance audit only on production builds via `npm run perf:lighthouse`.

### File Locations (Phase 5)
- Adapters: `v0-ui/adapters/parseMcpJson.ts`, `v0-ui/adapters/parseMcpYaml.ts`, `v0-ui/adapters/redactSecrets.ts`
- Scan runner: `v0-ui/lib/scanRunner.ts`
- E2E: `v0-ui/tests/e2e/phase5-import-config.spec.ts`
- Fixtures: `fixtures/vetted_server.good.json`, `fixtures/trojan_server.bad.json`
- Docs: `AGENTS.md`, `TASKS.md`, `REFERENCES.md`, `v0-ui/README.md`

### Acceptance Checklist (Cursor must verify)
- Import preview shows redaction count + unknown keys; keyboard accessible.
- Confirm persists target with `source:"config-import"`; optional static scan updates card with findings/score.
- Deterministic outputs across repeated imports.
- Error path: clear message with filename; no partial persistence.
- Quality gates pass (lint, build, unit ≥80% core coverage, E2E green, a11y ≥90).

### Teardown Discipline
- After E2E, terminate the dev server with Ctrl+C (or Stop-Process on Windows) to avoid orphaned processes.
- Ensure screenshots/videos on failure are saved under `v0-ui/test-results/`.

### Accessibility & Reports
- Keep Lighthouse a11y ≥ 90 in dev; save the report to `v0-ui/lighthouse-a11y-report-final.json`.
- Production performance audit only on production builds via `npm run perf:lighthouse`.

### File Locations (Phase 5)
- Adapters: `v0-ui/adapters/parseMcpJson.ts`, `v0-ui/adapters/parseMcpYaml.ts`, `v0-ui/adapters/redactSecrets.ts`
- Scan runner: `v0-ui/lib/scanRunner.ts`
- E2E: `v0-ui/tests/e2e/phase5-import-config.spec.ts`
- Fixtures: `fixtures/vetted_server.good.json`, `fixtures/trojan_server.bad.json`
- Docs: `AGENTS.md`, `TASKS.md`, `REFERENCES.md`, `v0-ui/README.md`

### Acceptance Checklist (Cursor must verify)
- Import preview shows redaction count + unknown keys; keyboard accessible.
- Confirm persists target with `source:"config-import"`; optional static scan updates card with findings/score.
- Deterministic outputs across repeated imports.
- Error path: clear message with filename; no partial persistence.
- Quality gates pass (lint, build, unit ≥80% core coverage, E2E green, a11y ≥90).