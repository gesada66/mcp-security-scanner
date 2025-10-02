# PRD: Discovery Wizard Feature

## Problem
Current MCP scanner lacks deployment context. Findings are treated equally, regardless of environment, data sensitivity, or compliance needs. CISOs require context-aware prioritization.

## Goals
- Add a lightweight discovery flow before scan.
- Gather 5 key attributes (env, sensitivity, exposure, auth, compliance).
- Use answers to adjust scoring and show a context banner.
- Must be quick (≤ 1 minute to complete) and enterprise-friendly.

## Out-of-Scope
- AI/agent-based doc ingestion.
- Auto-remediation.
- Integration with SIEMs (covered separately).

## UX Notes
- One question per screen, short explanation, 3–5 options.
- Always include “Unknown / Not sure.”
- Review/confirm screen before applying.
- Scorecard shows banner with chosen context.
- Unknowns flagged: “Treated conservatively.”

## Risks
- User fatigue if too many questions.
- Misclassification if user selects wrong option.
- Overweighting unknowns may alarm unnecessarily.
