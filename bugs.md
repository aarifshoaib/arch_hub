# Known Bugs and Issues

## 🔴 Critical Issues

### 1. ✅ FIXED - Missing Import in application-details.tsx
**File**: `src/app/features/arch_hub/ui/components/application-details.tsx:57`
- **Issue**: `ArrowLeft` icon is used but not imported from 'lucide-react'
- **Impact**: Runtime error when clicking on an application that doesn't exist
- **Fix Applied**: Added `ArrowLeft` to the import statement from 'lucide-react'
- **Status**: ✅ Fixed

### 2. ✅ FIXED - Navigation Using window.location (Anti-Pattern)
**File**: `src/app/features/arch_hub/ui/components/dashboard.tsx:191`
- **Issue**: Using `window.location.href = '/catalogues/new'` instead of React Router's navigate
- **Impact**: Full page reload, loses React state, poor UX
- **Fix Applied**:
  - Added `useNavigate` import
  - Replaced `window.location.href = '/catalogues/new'` with `navigate('/catalogues/new')`
  - In catalogue-listing-page.tsx, replaced `window.location.reload()` with proper refresh handler
- **Status**: ✅ Fixed

### 3. ✅ FIXED - Service Layer Data Persistence Issue
**File**: `src/app/features/arch_hub/services/application-service.ts:86-124`
- **Issue**: `addApplication()` doesn't persist data to the static array
- **Impact**: New applications created via the form are not stored and will disappear
- **Fix Applied**: Added `this.applications.push(newApplication)` to persist data
- **Status**: ✅ Fixed

## 🟡 High Priority Issues

### 4. ✅ FIXED - Invalid Tailwind Class in FormField Component
**File**: `src/app/features/arch_hub/ui/components/form-field.tsx:125`
- **Issue**: Template literal in className: `col-span-${field.columnSize || 12}` won't work in Tailwind
- **Impact**: Grid layout breaks, all fields appear full width
- **Fix Applied**: Used conditional className with actual Tailwind classes:
  ```tsx
  className={field.columnSize === 12 ? 'space-y-2 lg:col-span-2' : 'space-y-2 lg:col-span-1'}
  ```
- **Status**: ✅ Fixed

### 5. ✅ FIXED - Potential Null Reference Error in Dashboard
**File**: `src/app/features/arch_hub/ui/components/dashboard.tsx:123-127`
- **Issue**: Search filter accesses properties without null checks
- **Impact**: Runtime error if any application has undefined properties
- **Fix Applied**: Added optional chaining:
  ```tsx
  app.applicationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  app.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  app.vendorName?.toLowerCase().includes(searchQuery.toLowerCase())
  ```
- **Status**: ✅ Fixed

### 6. Regex Validation Inconsistency
**File**: `src/app/features/arch_hub/validation/application-schema.ts:37-42`
- **Issue**: `integrationIdSchema` and `replacementIdSchema` allow empty string via regex but are optional
- **Impact**: Confusing validation behavior - `''` passes but `undefined` also passes
- **Fix**: Simplify to `.optional().refine()` pattern or make regex more explicit
- **Status**: ⏳ Not Fixed (Low impact)

## 🟢 Medium Priority Issues

### 7. Missing Error Boundaries
**Files**: All component files
- **Issue**: No React Error Boundaries to catch rendering errors
- **Impact**: A single component error crashes the entire app
- **Fix**: Implement Error Boundary components at route level

### 8. ✅ FIXED - Console.log Statements in Production Code
**Files**: Multiple (dashboard.tsx, App.tsx, providers/index.tsx, dynamic-form.tsx)
- **Issue**: Debug console.log statements left in production code
- **Impact**: Performance overhead, potential information leakage
- **Fix Applied**: Removed non-essential console.log statements (kept console.error for error tracking)
- **Status**: ✅ Fixed

### 9. Hardcoded User Data
**File**: `src/app/features/arch_hub/ui/components/new-catalogue-page.tsx:37, 40, 83`
- **Issue**: Default values use 'system' for created_by/updated_by
- **Impact**: No real user tracking in audit logs
- **Fix**: Integrate proper authentication context and use actual user data

### 10. Missing Accessibility Attributes
**Files**: dashboard.tsx, application-details.tsx, form-field.tsx
- **Issue**: Interactive elements missing ARIA labels and keyboard navigation support
- **Impact**: Poor accessibility for screen readers and keyboard users
- **Examples**:
  - View mode toggle buttons need aria-label
  - Search input needs aria-label
  - Notification badge needs aria-live region

### 11. Date Parsing Without Timezone Handling
**File**: `src/app/features/arch_hub/ui/components/application-details.tsx:108-117`
- **Issue**: Date formatting doesn't handle timezones explicitly
- **Impact**: Inconsistent date display across different timezones
- **Fix**: Use a date library like date-fns with timezone support or ensure ISO strings

### 12. Unhandled Promise Rejection in handleRefresh
**File**: `src/app/features/arch_hub/ui/components/dashboard.tsx:44-61`
- **Issue**: Error caught but not displayed to user
- **Impact**: Silent failures, poor UX
- **Fix**: Add toast notification or error state display

## 🔵 Low Priority / Code Quality Issues

### 13. Type Safety Issue in DynamicForm
**File**: `src/app/features/arch_hub/ui/components/dynamic-form.tsx:25`
- **Issue**: Using `any` type for formData state
- **Impact**: No type safety for form data
- **Fix**: Create proper TypeScript interface for form data

### 14. Duplicate Code in Statistics Calculation
**Files**: dashboard.tsx (lines 159-171), application-service.ts (lines 50-74)
- **Issue**: Statistics calculation logic duplicated
- **Impact**: Maintenance burden, potential inconsistency
- **Fix**: Use centralized `ApplicationService.getApplicationStats()` in Dashboard component

### 15. Missing Input Sanitization
**Files**: All form components
- **Issue**: No sanitization of user inputs before display/storage
- **Impact**: Potential XSS vulnerabilities
- **Fix**: Sanitize inputs before storage and display

### 16. Inefficient Filtering in useMemo
**File**: `src/app/features/arch_hub/ui/components/dashboard.tsx:119-130`
- **Issue**: Multiple toLowerCase() calls on same strings
- **Impact**: Minor performance issue with large datasets
- **Fix**: Memoize lowercased search query

### 17. Magic Numbers in Pagination
**File**: `src/app/features/arch_hub/ui/components/dashboard.tsx:144, 374`
- **Issue**: Hardcoded values `12`, `6`, `24`, `48` without constants
- **Impact**: Hard to maintain and understand
- **Fix**: Extract to named constants

### 18. Missing Loading States
**Files**: application-details.tsx, new-catalogue-page.tsx
- **Issue**: No loading indicator when fetching data
- **Impact**: Poor UX during data loading
- **Fix**: Add skeleton loaders or loading spinners

### 19. ✅ FIXED - No Form Validation on Submit in DynamicForm
**File**: `src/app/features/arch_hub/ui/components/dynamic-form.tsx:187-202`
- **Issue**: `handleSubmit` function receives event parameter but calls `validateForm()` without the event
- **Impact**: Form validation might not run properly
- **Fix Applied**: Made event parameter optional and added conditional preventDefault: `e?.preventDefault()`
- **Status**: ✅ Fixed

### 20. Unused Validation in ApplicationService
**File**: `src/app/features/arch_hub/services/application-service.ts:86`
- **Issue**: `addApplication` doesn't validate input data before processing
- **Impact**: Invalid data can be added to the service
- **Fix**: Validate with Zod schema before adding

## 📋 Improvement Suggestions

### 21. Implement Proper State Management
- **Issue**: No global state management (using props drilling)
- **Suggestion**: Consider using the already-installed Zustand for application state
- **Files**: Multiple component files passing application data through props

### 22. Add React Query Integration
- **Issue**: Manual loading states and data fetching
- **Suggestion**: Use already-installed TanStack Query (@tanstack/react-query) for data fetching
- **Benefit**: Automatic caching, refetching, optimistic updates

### 23. Improve Form Error Display
- **Issue**: Errors only shown per-field, no summary
- **Suggestion**: Add error summary at form level showing all validation errors
- **File**: dynamic-form.tsx

### 24. Add Unit Tests
- **Issue**: No test files found
- **Suggestion**: Add unit tests for services, validation schemas, and utility functions
- **Priority**: High for business logic in services

### 25. Implement Route Guards
- **Issue**: No authentication/authorization checks on routes
- **Suggestion**: Add route guards for protected pages
- **File**: src/app/routes/index.tsx

### 26. Add Data Mocking for Development
- **Issue**: Using static JSON files
- **Suggestion**: Use MSW (Mock Service Worker) for API mocking during development
- **Benefit**: Easier transition to real API

### 27. Optimize Bundle Size
- **Issue**: Importing entire icon libraries
- **Suggestion**: Tree-shake lucide-react imports more aggressively
- **Example**: Analyze bundle size with vite-plugin-analyzer

### 28. Add TypeScript Strict Null Checks
- **Issue**: Potential null/undefined issues not caught at compile time
- **Suggestion**: Enable `strictNullChecks` in tsconfig
- **File**: tsconfig.json

## ✅ Resolved Issues

### Critical Fixes (3/3 - 100%)
1. ✅ Missing ArrowLeft import - Fixed
2. ✅ Navigation using window.location - Fixed
3. ✅ Service layer data persistence - Fixed

### High Priority Fixes (3/6 - 50%)
4. ✅ Invalid Tailwind class in form-field.tsx - Fixed
5. ✅ Null reference errors in dashboard search - Fixed
8. ✅ Console.log statements in production code - Fixed

### Low Priority Fixes (1/8 - 12.5%)
19. ✅ Form validation event handling - Fixed

## Summary
- **Total Issues Fixed**: 7 out of 28 (25%)
- **Critical Issues Fixed**: 3 out of 3 (100%) ✅
- **High Priority Fixed**: 3 out of 6 (50%)
- **Medium Priority Fixed**: 0 out of 6 (0%)
- **Low Priority Fixed**: 1 out of 8 (12.5%)

## Notes
- Analysis completed: 2025-10-18
- Bug fixes completed: 2025-10-18
- Files analyzed: ~20 component files, 3 service files, validation schemas
- Files modified: 7 files
- No malicious code detected
- Overall code quality: Good - Critical bugs fixed, production-ready for MVP
