# Phase 4
# Manage Targets — Test Plan

## Functional Scenarios
1. Button rename visible, tooltip correct.
2. Grid renders persisted targets from IndexedDB.
3. Add Target → form autosaves draft.
4. Save → persists; refresh → card remains.
5. Edit → updates; Delete → confirmation then removal.
6. Test Connection → fake ping success/fail updates status chip.
7. Export/Import JSON round-trip succeeds.

## Edge / Negative
- Invalid URL → validation error, no save.
- Duplicate names → allowed but flagged warning.
- Clear local storage → UI empty, no crash.

## Accessibility
- Tab order sequential.
- Screen reader reads button and card names.
- Color contrast ≥ 4.5:1 for status chips.

## Performance
- Render ≤ 200 ms on 10 cards.
- Lighthouse a11y ≥ 90.
- Perf measured only on prod build.

## Security
- No secret strings or tokens written to localStorage / IndexedDB.
- Credential alias verified safe.
