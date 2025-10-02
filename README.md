# MCP Security Scorecard

A comprehensive security assessment tool for Model Context Protocol (MCP) deployments. This MVP provides weighted risk scoring, prioritised findings, and export capabilities with a modern, accessible UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone and navigate to UI directory
cd v0-ui

# Install dependencies
npm ci

# Start development server
npm run dev:3001

# Open http://localhost:3001 in your browser
```

## 📋 Project Status

### ✅ Completed Milestones
- **Milestone 0**: Next.js scaffolding with shadcn/ui components
- **Milestone 1**: Domain types, scoring algorithm, and fixtures
- **Milestone 2**: Complete UI with scorecard components and empty states
- **Milestone 3**: Environment configuration and data source switching
- **Milestone 4**: Dark mode, export functionality, and documentation
- **Phase 2**: Discovery Wizard with context-aware scoring and comprehensive testing
- **Phase 3**: Comprehensive Threat Validation with 5 major security detection categories

### 🎯 Current Features
- **Weighted Risk Scoring**: Critical (10) > High (6) > Medium (3) > Low (1)
- **Environment Multipliers**: Production (1.25x), Data Sensitivity (1.1x)
- **Discovery Wizard**: Interactive context configuration with 5-step questionnaire
- **Context-Aware Scoring**: Dynamic risk weights based on deployment context
- **Comprehensive Threat Detection**: 5 major MCP security categories with 21 specific threat types
- **Dark/Light Theme**: Toggle with next-themes integration
- **Export Options**: JSON download and clipboard copy
- **Accessibility**: 98/100 a11y score with WCAG 2 AA compliance
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🧪 Testing Strategy

### Required for All Environments
- **Unit Tests**: `npm run test:coverage` (49 tests, ≥80% coverage)
- **E2E Tests**: `npm run e2e` (28 tests, Playwright with accessibility checks)
- **Lint**: `npm run lint` (ESLint with TypeScript)
- **Accessibility**: ≥90 a11y score required
- **Threat Validation**: All 5 threat detection categories tested

### Preprod/Production Only
- **Performance Testing**: Load times, frame rates, memory usage
- **Load Testing**: Concurrent user simulation
- **Security Scans**: Dependency and code vulnerability checks

### Test Execution
```bash
# From v0-ui/ directory
npm run test:coverage    # Unit tests with coverage
npm run e2e             # E2E tests (auto-starts dev server)
npm run lint            # Code quality checks
```

## 🛡️ Threat Detection Capabilities

### **Phase 3: Comprehensive Security Validation**

The MCP Security Scorecard now includes advanced threat detection across 5 major security categories:

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

### **Test Fixtures Available**
- **10 Threat Fixtures**: 5 bad configurations + 5 good configurations for comprehensive testing
- **Realistic Scenarios**: Based on actual MCP security vulnerabilities and best practices
- **Context Integration**: All fixtures work with discovery wizard and context weighting

## 🏗️ Architecture

### Core Components
- **Scoring Engine**: `lib/scoring.ts` - Pure functions for risk calculation
- **Threat Detection**: `lib/threats/index.ts` - Comprehensive security validation engine
- **UI Components**: `components/score/` - Reusable scorecard components
- **Theme System**: `components/theme/` - Dark/light mode with next-themes
- **Type Definitions**: `lib/types.ts` - TypeScript interfaces

### Security Rules
- **Location**: `rules/*.yaml` files
- **Format**: id, title, severity, rationale, remediation, references
- **Severity Levels**: critical, high, medium, low

### Data Flow
1. **Threat Fixtures**: JSON configuration files in `public/threat-fixtures/` directory
2. **Threat Detection**: Automated analysis using 5 detection engines
3. **Scoring**: Weighted algorithm with environment multipliers and context weighting
4. **UI**: Real-time updates with accessible components and severity indicators
5. **Export**: JSON download with metadata, timestamps, and detailed findings

## 🎨 UI Quality Standards

### Design Principles
- **shadcn/ui**: Primary component system
- **Magic UI**: Augmented with MCP blocks when beneficial
- **Motion**: 60fps transitions respecting `prefers-reduced-motion`
- **Accessibility**: Focus states, keyboard navigation, ARIA compliance

### Responsive Breakpoints
- **Mobile**: 375px+ with touch-friendly interactions
- **Tablet**: 768px+ with optimized layouts
- **Desktop**: 1024px+ with full feature set

## 🔧 Development

### Project Structure
```
v0-ui/
├── app/                    # Next.js App Router
├── components/
│   ├── score/             # Scorecard components
│   ├── theme/             # Theme system
│   ├── discovery/         # Discovery wizard components
│   └── ui/                # shadcn/ui base components
├── lib/                   # Core logic and types
│   ├── threats/           # Threat detection engines
│   ├── discovery/         # Discovery wizard logic
│   └── scoring.ts         # Risk scoring algorithm
├── public/                # Static assets and fixtures
│   └── threat-fixtures/   # 10 threat test scenarios
├── rules/                 # Security rule definitions
└── tests/                 # Unit and E2E tests
    ├── unit/              # 49 unit tests
    └── e2e/               # 28 E2E tests
```

### Key Commands
```bash
npm run dev:3001          # Development server
npm run build             # Production build
npm run start             # Production server
npm run test:watch        # Unit tests in watch mode
npm run e2e               # End-to-end tests
```

## 📚 Documentation

- **Setup Guide**: This README
- **API Reference**: Inline JSDoc comments
- **Component Docs**: `components/` directory
- **Testing Guide**: `tests/` directory with examples
- **Architecture**: `AGENTS.md` for development guidelines

## 🚧 Future Roadmap (v1.5+)

### **Advanced Threat Detection**
- **Machine Learning**: Behavioral analysis for anomaly detection
- **Custom Rules**: User-defined security policies and detection rules
- **Real-time Monitoring**: Continuous threat detection and alerting

### **Integration & Reporting**
- **PDF Export**: Formatted security reports with executive summaries
- **SIEM Integration**: Splunk, Azure Sentinel, Elastic queries
- **API Endpoints**: RESTful API for programmatic access
- **Webhook Support**: Real-time notifications for security events

### **Enhanced Configuration**
- **YAML Configuration**: Direct MCP server config parsing
- **Authentication**: User accounts and persistent storage
- **Live Scanning**: Real-time MCP server analysis
- **Trend Analysis**: Historical security posture tracking

## 🤝 Contributing

1. Follow existing code patterns and TypeScript strict mode
2. Add tests for new functionality (unit + E2E)
3. Ensure accessibility compliance (≥90 a11y score)
4. Update documentation for API changes
5. Run full test suite before submitting changes

## 📄 License

This project is part of the MCP Security Scorecard MVP initiative.