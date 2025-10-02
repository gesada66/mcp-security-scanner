# WIREFRAMES — Discovery Wizard & Scorecard Context

This document describes the intended UI states and flows for the Discovery Wizard feature.  
It serves as a design reference for Cursor IDE agents when generating components.  
Screenshots or diagrams may be added later, but text descriptions are sufficient for now.

---

## Wizard Question Screen
- Each question is presented **one at a time**.
- Layout:
  - Card with **Question Title** + **Short Explanation**.
  - Options displayed as **buttons or radio choices** (3–5 options, plus “Unknown”).
  - Navigation: **Back / Next** buttons.
  - Progress indicator: `Step X of 5`.
- Accessibility:
  - Radiogroup roles with labels.
  - Keyboard support (arrows, enter, tab).
  - Focus moves to heading when step changes.

---

## Review Screen
- Displays a **summary list of all answers**.
- Each answer row includes an **Edit** link that navigates back to that step.
- Actions:
  - **Confirm & Apply** → finalizes profile and triggers scorecard update.
  - **Start Over** → clears answers and restarts wizard from Q1.

---

## Scorecard with Context Banner
- After confirmation, the Scorecard is displayed with a **Context Banner** above it.
- Banner contents:
  - **Badges** for Environment, Data Sensitivity, Compliance selections.
  - If any answer is “Unknown”, show a muted note: *“Unknown answers treated conservatively.”*
- Scorecard results appear below the banner (misconfigs, findings, overall score).

---

## Flow Summary
1. User starts wizard → answers questions one by one.
2. Reaches Review Screen → confirms answers or edits.
3. On confirmation → Scorecard recalculates.
4. Context Banner shows selected profile above Scorecard results.

---

## Design Principles
- Minimalism: 5 core questions, ≤ 1 min to complete.
- Consistency: All components styled with shadcn/ui + Tailwind semantic tokens.
- Accessibility: Lighthouse a11y ≥ 90 (dev + prod).
- Transparency: Unknown answers clearly flagged; conservative weighting applied.
