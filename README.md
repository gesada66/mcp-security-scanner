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

### 🎯 Current Features
- **Weighted Risk Scoring**: Critical (10) > High (6) > Medium (3) > Low (1)
- **Environment Multipliers**: Production (1.25x), Data Sensitivity (1.1x)
- **Discovery Wizard**: Interactive context configuration with 5-step questionnaire
- **Context-Aware Scoring**: Dynamic risk weights based on deployment context
- **Dark/Light Theme**: Toggle with next-themes integration
- **Export Options**: JSON download and clipboard copy
- **Accessibility**: 98/100 a11y score with WCAG 2 AA compliance
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🧪 Testing Strategy

### Required for All Environments
- **Unit Tests**: `npm run test:coverage` (≥80% coverage)
- **E2E Tests**: `npm run e2e` (Playwright with accessibility checks)
- **Lint**: `npm run lint` (ESLint with TypeScript)
- **Accessibility**: ≥90 a11y score required

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

## 🏗️ Architecture

### Core Components
- **Scoring Engine**: `lib/scoring.ts` - Pure functions for risk calculation
- **UI Components**: `components/score/` - Reusable scorecard components
- **Theme System**: `components/theme/` - Dark/light mode with next-themes
- **Type Definitions**: `lib/types.ts` - TypeScript interfaces

### Security Rules
- **Location**: `rules/*.yaml` files
- **Format**: id, title, severity, rationale, remediation, references
- **Severity Levels**: critical, high, medium, low

### Data Flow
1. **Fixtures**: JSON files in `public/` directory
2. **Scoring**: Weighted algorithm with environment multipliers
3. **UI**: Real-time updates with accessible components
4. **Export**: JSON download with metadata and timestamps

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
│   └── ui/                # shadcn/ui base components
├── lib/                   # Core logic and types
├── public/                # Static assets and fixtures
├── rules/                 # Security rule definitions
└── tests/                 # Unit and E2E tests
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

- **PDF Export**: Formatted security reports
- **SIEM Integration**: Splunk, Azure Sentinel, Elastic queries
- **YAML Configuration**: Direct MCP server config parsing
- **Authentication**: User accounts and persistent storage
- **Live Scanning**: Real-time MCP server analysis

## 🤝 Contributing

1. Follow existing code patterns and TypeScript strict mode
2. Add tests for new functionality (unit + E2E)
3. Ensure accessibility compliance (≥90 a11y score)
4. Update documentation for API changes
5. Run full test suite before submitting changes

## 📄 License

This project is part of the MCP Security Scorecard MVP initiative.