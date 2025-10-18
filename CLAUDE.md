# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arc Hub is an Architecture Catalogue management application built with React, TypeScript, Vite, and Tailwind CSS. It's a single-page application for managing enterprise application portfolios, including application metadata, lifecycle tracking, vendor management, and architecture domain classification.

## Development Commands

### Starting Development
```bash
npm run dev          # Start Vite dev server with HMR
```

### Building
```bash
npm run build        # TypeScript build + Vite production build
```

### Code Quality
```bash
npm run lint         # Run ESLint on codebase
npm run preview      # Preview production build locally
```

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── features/arch_hub/          # Main feature module
│   │   ├── ui/components/          # Feature-specific UI components
│   │   ├── services/               # Business logic & data access
│   │   ├── validation/             # Zod schemas for form validation
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── contexts/               # React contexts (e.g., SidebarProvider)
│   │   ├── data/                   # JSON data files & metadata
│   │   └── types/                  # TypeScript type definitions
│   ├── providers/                  # Application-level providers
│   └── routes/                     # React Router configuration
├── components/ui/                  # Radix UI-based shared components
└── lib/                            # Utility functions
```

### Key Architectural Patterns

#### Feature-Based Organization
The codebase follows a feature-based structure under `src/app/features/arch_hub/`. All code related to the architecture hub feature is co-located, including UI, services, validation, and data.

#### Data-Driven Forms
The application uses a metadata-driven approach for forms:
- Form structure is defined in `src/app/features/arch_hub/data/form_metadata.json`
- The `DynamicForm` component (`src/app/features/arch_hub/ui/components/dynamic-form.tsx`) renders forms based on this metadata
- Form validation is handled via Zod schemas in `src/app/features/arch_hub/validation/application-schema.ts`
- Field types include: textbox, textarea, select, searchable-select, checkbox, datetime
- Supports dependent fields (cascading selects) via `dataFilter.dependsOn` in metadata

#### Base Types System
The application uses a hierarchical base types system for dropdown options:
- Base types are defined in `src/app/features/arch_hub/data/base_types.json`
- `BaseTypesService` provides methods to query base types by type, parent relationships, and convert to select options
- This enables cascading dropdowns (e.g., Architecture Domain L1 → L2 → L3)

#### Service Layer Pattern
Business logic is centralized in service classes:
- `ApplicationService`: CRUD operations and queries for applications
- `BaseTypesService`: Querying hierarchical dropdown data
- `AuditLogService`: Audit trail functionality
- Services currently use in-memory JSON data; they're designed to be swapped with API calls

#### Provider Composition
The app uses a composed provider pattern:
- `Providers` component wraps `ThemeProvider` and `SidebarProvider`
- All providers are composed in `src/app/providers/index.tsx`
- Router is initialized separately in `src/app/routes/index.tsx`

### Routing Structure

Routes are defined in `src/app/routes/index.tsx`:
- `/` - Dashboard view
- `/application/:id` - Application detail view
- `/catalogues` - Catalogue listing page
- `/catalogues/new` - New catalogue form
- `/catalogues/metrics` - Catalogue metrics page

### State Management

- **Theme**: Managed via `ThemeProvider` with localStorage persistence
- **Sidebar**: Managed via `SidebarContext` for collapse/expand state
- **Forms**: Local component state with validation via Zod
- **Toast Notifications**: Custom `useToast` hook for user feedback

### Styling System

- **Tailwind CSS v4**: Uses native CSS with `@import "tailwindcss"`
- **Design Tokens**: Custom properties defined in `src/index.css` with light/dark theme support
- **Component Library**: Radix UI primitives with custom styling
- **CSS Variables**: Uses OKLCH color space for theme colors
- **Path Alias**: `@/` maps to `./src/` for cleaner imports

### TypeScript Configuration

- **Strict Mode**: All strict TypeScript checks enabled
- **No Emit**: TypeScript used for type checking only; Vite handles transpilation
- **Path Mapping**: `@/*` alias configured in both `tsconfig.json` and `vite.config.ts`
- **Module Resolution**: Uses `bundler` mode for Vite compatibility
- **React Compiler**: Enabled via `babel-plugin-react-compiler` for automatic optimization

## Important Implementation Details

### Form Metadata Schema
When working with forms, reference `form_metadata.json` which defines:
- **sections**: Array of form steps with title, description, and fields
- **fields**: Each field has `field`, `label`, `type`, `required`, `validationType`, and optional `dataFilter`
- **dataFilter**: For dependent fields, specify `dependsOn` and `baseType` to filter options

### Application Data Model
Applications include these key properties:
- **Identity**: id, applicationName, applicationCommonName, prefix
- **Ownership**: ownerDivision, ownerDomain
- **Architecture**: architectureDomainL1/L2/L3 (hierarchical)
- **Vendor**: vendorName, productName, version, applicationType
- **Lifecycle**: lifecycleStatus, currentTier, targetTier
- **Strategy**: shortTerm, midTerm, longTerm strategies
- **Deployment**: deploymentLocations object with boolean flags per region
- **Metadata**: is_active, created_by, created_on, updated_by, updated_on

### Validation Patterns
When adding form validation:
- Use Zod schemas defined in `application-schema.ts`
- Regex patterns are enforced for IDs, names, versions, etc.
- Field validation schemas support type-specific validation (textbox, select, checkbox, datetime)
- Error messages should be user-friendly and specific

### Component Patterns
- UI components in `src/components/ui/` are generic and reusable
- Feature components in `src/app/features/arch_hub/ui/components/` are specific to the arch_hub feature
- Use `lucide-react` for icons
- Use `class-variance-authority` (cva) and `clsx` for conditional styling

## React Compiler Notes

This project uses the React Compiler (`babel-plugin-react-compiler`), which automatically optimizes component re-renders. Be aware that this may impact dev and build performance. The compiler requires React 19+.

## Common Gotchas

1. **Path Aliases**: Always use `@/` for imports from `src/` directory
2. **Form Metadata**: Changes to form structure require updating `form_metadata.json`, not just components
3. **Base Types**: When adding new dropdown fields, ensure base types exist in `base_types.json`
4. **Service Layer**: Currently uses JSON files; when migrating to API, only update service methods
5. **Styling**: Use Tailwind classes; custom CSS properties are in `index.css` for theming only
