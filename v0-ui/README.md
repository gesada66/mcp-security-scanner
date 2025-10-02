# MCP Security Scorecard

A comprehensive security assessment tool for Model Context Protocol (MCP) deployments. This MVP provides weighted risk scoring, prioritised findings, and export capabilities.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Development
```bash
# Install dependencies
npm ci

# Start development server on port 3001
npm run dev:3001

# Open http://localhost:3001 in your browser
```

## Features

### 🎯 Security Scoring
- **Weighted Risk Assessment**: Critical (10) > High (6) > Medium (3) > Low (1)
- **Environment Multipliers**: Production environments receive 1.25x risk penalty
- **Data Sensitivity**: PII/Financial/Health data adds 1.1x multiplier
- **Context-Aware Scoring**: Dynamic weights based on deployment context via Discovery Wizard
- **Real-time Updates**: Score recalculates as you change environment settings

### 🎨 User Interface
- **Dark/Light Mode**: Toggle theme with the sun/moon icon in the header
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessible Motion**: Respects `prefers-reduced-motion` settings
- **Interactive Components**: Hover effects and smooth transitions

### 📊 Scorecard Components
- **Overall Security Score**: 0-100 scale with visual progress bar
- **Risk Distribution**: Breakdown by severity (Critical, High, Medium, Low)
- **Prioritised Findings**: Sorted by risk weight with remediation guidance
- **Environment Context**: Shows current settings affecting the score

### 🔧 Configuration Options
- **Environment Type**: Development, Staging, Production
- **Data Source**: Switch between different fixture files
- **Data Sensitivity**: None, Internal, PII + Financial, Health
- **Discovery Wizard**: Interactive 5-step questionnaire for deployment context
- **Context Banner**: Visual summary of current security context settings

### 🔍 Discovery Wizard
- **Interactive Questionnaire**: 5-step context configuration process
- **Environment Assessment**: Production, staging, development environments
- **Data Sensitivity**: None, internal, PII, regulated data classification
- **Network Exposure**: Public, private, or hybrid deployment models
- **Authentication**: OIDC/OAuth, mTLS, API keys, or unknown methods
- **Compliance**: SOC 2, GDPR, HIPAA, and other regulatory requirements
- **Conservative Handling**: Unknown answers treated with worst-case assumptions
- **Context Banner**: Visual summary of current security context

### 📤 Export & Sharing
- **Export JSON**: Download complete scorecard as JSON file
- **Copy to Clipboard**: Quick sharing with timestamp and metadata
- **Export PDF**: Planned for v1.5 (currently disabled)

## Testing

### Unit Tests
```bash
# Run unit tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### End-to-End Tests
```bash
# Run Playwright E2E tests
npm run e2e
```

Tests verify:
- Scorecard rendering with fixture data
- Environment selector functionality
- Data source switching
- Export controls and clipboard functionality
- Accessibility compliance (≥90 a11y score)

### Performance Testing
Performance testing is **required only in preprod/prod environments** and not mandatory for local development or feature branches. This includes:
- Load time measurements
- Animation frame rates
- Memory usage monitoring
- Network request optimization

## Project Structure

```
v0-ui/
├── app/                    # Next.js App Router pages
├── components/
│   ├── score/             # Scorecard-specific components
│   ├── theme/             # Theme and UI components
│   └── ui/                # shadcn/ui base components
├── lib/
│   ├── scoring.ts         # Core scoring algorithm
│   ├── types.ts           # TypeScript definitions
│   └── todo-stubs.ts      # Future feature placeholders
├── public/                # Static assets and fixtures
├── tests/
│   ├── e2e/              # Playwright tests
│   └── unit/             # Vitest tests
└── rules/                # Security rule definitions (YAML)
```

## Customisation

### Adding New Security Rules
1. Create YAML files in `rules/` directory
2. Follow the pattern: `mcp-XXX-rule-name.yaml`
3. Include: id, title, severity, rationale, remediation, references

### Modifying Scoring Weights
Edit `lib/scoring.ts`:
```typescript
const DEFAULT_SEVERITY_WEIGHTS: Record<RiskSeverity, number> = {
  critical: 10,  // Adjust these values
  high: 6,
  medium: 3,
  low: 1,
};
```

### Adding New Fixtures
1. Place JSON files in `public/` directory
2. Follow the `FixturePayload` interface structure
3. Update the data source selector in `app/page.tsx`

## Future Roadmap (v1.5+)

- **PDF Export**: Formatted security reports with charts
- **SIEM Integration**: Splunk, Azure Sentinel, Elastic queries
- **YAML Configuration**: Parse MCP server configs directly
- **Authentication**: User accounts and persistent storage
- **Live Scanning**: Real-time MCP server analysis
- **Advanced Analytics**: Trend analysis and historical data

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation for API changes
4. Ensure accessibility compliance (a11y ≥ 90)

## License

This project is part of the MCP Security Scorecard MVP initiative.
