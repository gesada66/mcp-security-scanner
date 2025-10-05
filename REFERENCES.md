# Reference Documentation — MCP Scorecard Project

This file lists official and trusted docs for our stack.  
Agents must consult these before answering implementation questions.  

---

## Frameworks / Libraries

### Next.js (App Router, TS)
- Docs Home: https://nextjs.org/docs
- App Router (since v13+): https://nextjs.org/docs/app
- Data Fetching: https://nextjs.org/docs/app/building-your-application/data-fetching
- Routing / Layouts: https://nextjs.org/docs/app/building-your-application/routing
- Deployment: https://nextjs.org/docs/deployment

### shadcn/ui
- Docs: https://ui.shadcn.com
- Components Index: https://ui.shadcn.com/docs/components
- Installation / CLI: https://ui.shadcn.com/docs/installation
- Styling: https://ui.shadcn.com/docs/overview/styling

### TailwindCSS
- Docs: https://tailwindcss.com/docs
- Utility classes reference: https://tailwindcss.com/docs/utility-first
- Dark Mode: https://tailwindcss.com/docs/dark-mode

### TypeScript
- Docs: https://www.typescriptlang.org/docs/
- Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- TSConfig reference: https://www.typescriptlang.org/tsconfig

### Node.js
- API reference: https://nodejs.org/api/
- File system: https://nodejs.org/api/fs.html
- Process/env: https://nodejs.org/api/process.html

---

## Useful Add-ons

### PDF Export
- `react-pdf` docs: https://react-pdf.org/
- Alternative (`pdf-lib`): https://pdf-lib.js.org/docs/
- Node-based (`puppeteer` HTML→PDF): https://pptr.dev/

### Form Handling (Discovery)
- React Hook Form: https://react-hook-form.com/get-started
- Zod (schema validation): https://zod.dev/?id=basic-usage

### Magic UI (blocks & patterns) (May vary by account/version)
- Site: https://magicui.design
- MCP Server: `@magicuidesign/mcp` (component discovery/scaffolding via MCP)

### shadcn/ui MCP servers (May vary by account/version)
- Official registry MCP: `shadcn@canary registry:mcp`
- Community: `@jpisnice/shadcn-ui-mcp-server`, `@heilgar/shadcn-ui-mcp-server`

### Motion / Animation (May vary by account/version)
- Framer Motion: https://www.framer.com/motion/
- Tailwind Animate: https://www.tailwindcss-animate.com/
- WCAG on motion & flashing content: https://www.w3.org/WAI/WCAG21/quickref/#animations
- Guidance: Respect `prefers-reduced-motion`; use motion to reinforce hierarchy/state, not as decoration.

---

## Security / Context

### MCP (Model Context Protocol)
- Spec / docs: https://github.com/modelcontextprotocol/spec
- Security Considerations (draft): https://github.com/modelcontextprotocol/spec#security-considerations

### General Security Benchmarks (for reference)
- CIS Benchmarks: https://www.cisecurity.org/cis-benchmarks
- NIST Cybersecurity Framework (CSF): https://www.nist.gov/cyberframework
- OWASP Top 10 (AI/LLM risks included): https://owasp.org

---

# Usage Rule
- When implementing, **first check here**.  
- If unclear, stub with `TODO` and cite this file.  
- Never invent APIs beyond these references.  

## UI Usage Note
- Prefer shadcn/ui primitives for cohesion; augment with Magic UI blocks via MCP when it accelerates delivery, while maintaining accessibility and responsiveness aligned to shadcn patterns. (May vary by account/version)
######
######
## Phase 2
# REFERENCES (Inputs & Sources)

## Specs
- MCP protocol spec: https://github.com/modelcontextprotocol/spec
- CIS benchmarks: https://www.cisecurity.org/cis-benchmarks
- NIST CSF: https://www.nist.gov/cyberframework

## Frameworks & Libraries
- Next.js (App Router): https://nextjs.org/docs/app
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com/docs/customizing-colors
- TypeScript: https://www.typescriptlang.org/docs/
- Node.js APIs: https://nodejs.org/api/

## Design Patterns
- Multi-step form wizard (one question per screen, review/confirm).
- Contextual scoring (answers → multipliers).

## API contracts / schemas
- `config/discovery-questions.json` defines wizard content.
- `lib/discovery/types.ts` defines schema types + answers.
- `lib/profile/map.ts` maps answers to scoring weights.

# phase 3
# External Test Sources (for threat validation)

## Public examples & scanners
- MCP examples & community servers — GitHub (search "mcp server example").
- mcp-scan (Invariant Labs) — use README/testcases as pattern sources. (May vary by repo.)
- mcpscan.ai example scans — recreate patterns (do not copy proprietary output).

## Prompt-injection / adversarial datasets
- OWASP LLM Top-10 (prompt injection guidance).
- Lakera PINT benchmark (prompt-injection tests) — sample subsets per license.
- Hugging Face prompt-injection collections (for fuzzing).

## Mapping & frameworks
- MITRE ATLAS (agent/LLM tactics) — map findings to ATLAS IDs.
- NIST AI RMF / Generative AI Profile — use for control mapping and expected evidence.
# Phase 4
# References — Manage Targets Phase

## UI / Component References
- Shadcn UI component library (Card, Tooltip, Dialog, Button, Input, Select).
- Next.js 14 App Router documentation.
- idb-keyval or Dexie documentation (IndexedDB helpers).

## External Inspiration
- SaaS “Asset Inventory” UI patterns (saasframe.io/security-page).
- OWASP a11y testing guide (for form validation & focus management).
- Example dark-theme dashboards from HaloLab / Behance for card spacing.

## Local Persistence
- localStorage: temporary draft state.
- IndexedDB: long-term offline persistence.
- Optional: JSON Export / Import.

## Data Model Reference
```json
{
  "id": "uuid",
  "type": "mcp",
  "name": "Finance MCP",
  "endpoint": "https://mcp.example/api",
  "env": "prod",
  "sensitivity": "regulated",
  "authMethod": "oidc",
  "credentialAlias": "OIDC_MCP_FIN",
  "tags": ["finance", "core"],
  "owner": { "team": "platform", "email": "platsec@example.com" },
  "compliance": ["soc2", "gdpr"],
  "scan": { "includeInBatch": true, "frequency": "weekly" },
  "status": "connected",
  "createdAt": 0,
  "updatedAt": 0
}
