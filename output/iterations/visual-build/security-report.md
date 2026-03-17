# Security Review Report - HESA WEB (Visual Build Phase)

**Date**: 2026-03-17
**Reviewer**: Developer (automated security audit)
**Scope**: Full frontend codebase (`src/`) + configuration files

---

## 1. SQL/NoSQL Injection

**Status**: NOT APPLICABLE (PASS)

No database queries exist in the frontend. All data comes from `MockDataService` with hardcoded mock data. No ORM, no query builders, no raw query strings. When backend integration is added in Iteration 1, parameterized queries via Mongoose should be enforced.

---

## 2. XSS (Cross-Site Scripting)

**Status**: PASS (no issues found)

- All data rendering uses Angular's `{{ }}` interpolation, which auto-escapes HTML entities
- No `innerHTML`, `[innerHTML]`, `bypassSecurityTrustHtml`, or `DomSanitizer` usage found
- No `document.write()`, `eval()`, or `new Function()` usage
- Search query params (`?q=`) are rendered via Angular interpolation (auto-escaped)
- **FIX APPLIED**: Added input sanitization (control character stripping) to search overlay and search results page as defense-in-depth

---

## 3. Authentication / Authorization

**Status**: CRITICAL VULNERABILITY FOUND AND FIXED

**Finding**: All admin routes (`/admin/*`) were accessible without any authentication. Any user could navigate directly to `/admin/dashboard`, `/admin/productos`, etc.

**Fixes Applied**:
- Created `AuthService` (`src/app/shared/services/auth.service.ts`) - mock auth service using sessionStorage (ready for Entra ID in Iteration 3)
- Created `authGuard` (`src/app/shared/guards/auth.guard.ts`) - functional route guard using `CanActivateFn`
- Applied `canActivate: [authGuard]` to the admin parent route in `app.routes.ts`
- Wired login button in `login.component.ts` to call `AuthService.login()` and navigate to dashboard
- Wired logout button in `admin-layout.component.ts` to call `AuthService.logout()` and redirect to login
- Login page (`/admin/login`) remains unguarded (intentional - it's the entry point)

---

## 4. Secrets / Hardcoded Credentials

**Status**: LOW RISK (acceptable for demo phase)

**Finding**: CRM tracking endpoint and lead ID are hardcoded in both environment files:
- `environment.ts`: `trackingEndpoint: 'https://crm-api.linkdesign.cr/api/tracking'`, `leadId: 'HESA-WEB-DEMO-2026'`
- `environment.prod.ts`: Same values

**Assessment**: These are not secrets (the tracking endpoint is a public API, the lead ID is a project identifier). The CRM tracking service will be removed in Iteration 1. No API keys, passwords, tokens, or private keys were found anywhere in the codebase.

---

## 5. CORS

**Status**: NOT APPLICABLE (PASS)

No CORS configuration exists in the Angular frontend. The only external HTTP call is `navigator.sendBeacon` / `fetch` to the CRM tracking endpoint, which is a fire-and-forget POST. CORS headers on the backend API will need to be configured in Iteration 1.

---

## 6. Input Validation

**Status**: VULNERABILITIES FOUND AND FIXED

**Findings and Fixes**:

| Issue | Fix Applied |
|-------|-------------|
| No input length limits on any form field | Added `maxlength` HTML attributes to ALL form inputs (name: 100, email: 254, phone: 20, message: 2000, company: 200, product: 200) |
| No phone format validation | Added `PHONE_REGEX` validation (`/^[+]?[\d\s\-()]{7,20}$/`) for both general and manufacturer forms |
| No rate limiting on form submission | Added 30-second cooldown between submissions with user-facing error message |
| No input sanitization | Added `sanitize()` method that strips control characters (`\x00-\x08`, `\x0B`, `\x0C`, `\x0E-\x1F`, `\x7F`) from all inputs before validation |
| Search input had no length limit | Added `maxlength="100"` to search overlay input, admin search input, and search results query param processing |
| Search query param not sanitized | Added length truncation and control character stripping to `SearchResultsComponent.ngOnInit()` |

**Pre-existing good practices** (no changes needed):
- Honeypot field for anti-bot protection
- Client-side email format validation
- Required field validation with visual error states
- Angular's auto-escaping prevents XSS on all rendered values

---

## 7. Dependencies

**Status**: CRITICAL VULNERABILITIES FOUND AND FIXED

**npm audit before fix**: 6 high-severity vulnerabilities

| Package | Severity | Issue | Fix |
|---------|----------|-------|-----|
| `serialize-javascript <=7.0.2` | HIGH | RCE via RegExp.flags and Date.prototype.toISOString() (GHSA-5c6j-r48x-rmvq) | Override to `>=7.0.3` |
| `tar <=7.5.10` | HIGH | 6 path traversal, symlink poisoning, and race condition vulnerabilities | Override to `>=7.5.11` |

**Fix Applied**: Added `overrides` block in `package.json` to force secure versions:
```json
"overrides": {
  "serialize-javascript": ">=7.0.3",
  "tar": ">=7.5.11"
}
```

**npm audit after fix**: 0 vulnerabilities

**Note**: Both vulnerable packages are transitive dependencies of dev-only tools (`@angular-devkit/build-angular`, `@angular/cli`). They never ship to the production bundle. The overrides ensure the build environment itself is secure.

---

## 8. Additional Security Headers

**Status**: IMPROVEMENTS APPLIED

**Fixes to `staticwebapp.config.json`**:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS for 1 year, protects against downgrade attacks |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://crm-api.linkdesign.cr; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` | Mitigates XSS, clickjacking, and data injection attacks |

**Pre-existing headers** (already configured, no changes needed):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Summary of All Files Modified/Created

### New Files Created:
1. `src/app/shared/guards/auth.guard.ts` - Route guard for admin routes
2. `src/app/shared/services/auth.service.ts` - Authentication service

### Files Modified:
3. `src/app/app.routes.ts` - Added auth guard import and `canActivate` to admin routes
4. `src/app/admin/pages/login/login.component.ts` - Wired login with AuthService
5. `src/app/admin/pages/login/login.component.html` - Added click handler, loading state, error state
6. `src/app/admin/layout/admin-layout.component.ts` - Wired logout with AuthService + Router
7. `src/app/admin/layout/admin-layout.component.html` - Added maxlength to admin search
8. `src/app/public/components/contact-form/contact-form.component.ts` - Input validation, sanitization, rate limiting
9. `src/app/public/components/contact-form/contact-form.component.html` - maxlength attributes on all inputs
10. `src/app/shared/components/search-overlay/search-overlay.component.ts` - Input sanitization
11. `src/app/shared/components/search-overlay/search-overlay.component.html` - maxlength on search input
12. `src/app/public/pages/search-results/search-results.component.ts` - Query param sanitization
13. `staticwebapp.config.json` - Added HSTS and CSP headers
14. `package.json` - Added overrides for vulnerable dependencies

### Build Verification:
- `ng build` completes successfully with 0 errors
- `npm audit` reports 0 vulnerabilities
