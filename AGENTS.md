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