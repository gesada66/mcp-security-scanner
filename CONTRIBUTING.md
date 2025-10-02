# Contributing

## PR Quality Gates
- Lint, typecheck, unit (coverage ≥80% for core logic), integration/contract, E2E (Playwright headless, reporter=list), a11y ≥ 90 (local), visual regression, security scans, smoke/config checks. Failures block merge.

## Visual Approval
- UI-first: submit static, data-mocked screens for visual approval before wiring logic.
- Include screenshots/video for key flows and reduced-motion mode; establish visual regression baselines after approval.

## Testing Discipline
- Write tests with each change; keep tests fast and reliable.
- Terminate E2E runs with Ctrl+C; avoid orphaned processes.

## UI Guidelines
- Use shadcn/ui primitives; use Magic UI blocks via MCP when it accelerates delivery. (May vary by account/version)
- Prefer transform/opacity for motion; avoid layout thrashing; provide non-animated paths and respect `prefers-reduced-motion`.

## Rules and Scoring
- Each rule requires id, title, severity, rationale, remediation, refs, and a fixture.
- Document scoring changes via ADR if they affect outputs or types.