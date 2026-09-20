# Aurora Outdoor Furniture Manufacturing System Audit

## Read-only production re-verification — 2026-09-19

Updated after owner confirmation of shared physical boards: one `5x12 Base Bottom` run uses **9 Black boards**, producing **36 Base Bottoms and 18 Table Uprights**. Earlier 52-part and 22-board results are invalid and superseded.

This section supersedes the production/CNC findings below. The original audit is retained as historical notes; its blocked-calculation conclusions and Logo Slat filename statements are no longer current. Existing user changes were preserved. No live Sheets writes, authentication implementation, or transactional write implementation were performed.

### Current live data

- Data rows: Orders 134, BOM 62, Shop Parts Inventory 118, Parts 34, CNC Files 20, Colours 6.
- All 118 inventory quantities parse as zero, with no blank/invalid/negative/fractional quantities or duplicate canonical part/color keys.
- `Sapphire Table Top` matches in BOM row 50, Parts row 29, inventory rows 95–101, and CNC Files row 10 (`5x12 Sapphire Table Top`). `Luxe Table Top` also matches across all four sources. Neither `Sapphire Sapphire Top` nor `Luxe Top` remains in those part-name fields.
- CNC Files rows 3 and 4 share exactly `5x12 Base Bottom`. Row 3 produces `Base Bottoms`, `QtyPerBoard=4`, `BoardsPerFile=9`, `RunDriver=TRUE`; row 4 produces `Table Uprights`, `QtyPerBoard=2`, `BoardsPerFile=9`, `RunDriver=FALSE`. Both are fixed Black outputs.
- The standalone `5x12 Table Uprights` remains in CNC Files row 16 (`1 × 9`, fixed Black, `RunDriver=TRUE`) and Parts row 18. It is an explicitly modeled fallback, not a stale row to remove. There are no duplicate file/part pairs or ambiguous driver routes. Byproduct output is credited before fallback demand is scheduled.
- `Luxe Logo Slat`: Parts row 5 and CNC Files row 21 both use `Front Slat Logo`. It is standalone, customer-color, `1 × 8`, and a driver.
- `Gliding Ottoman`: rows 17–20 still define four outputs: Front Slat 4, Base Top 4, Side 4, Leg 8 per run. Front Slat and Leg use the customer color; Base Top and Side are Black. Only Leg is a driver in current metadata; the other three outputs are byproducts. Four boards per modeled run, two customer-color and two Black. No active demand currently schedules this file.
- 76 completed historical order rows have blank IDs. The active-order reader now validates status and excludes completed rows before requiring active-order identity. Missing active IDs and unknown/blank statuses still fail validation. No unknown statuses were found.
- Fresh read-only verification confirmed both shared rows have `BoardsPerFile=9`: Base Bottoms uses `QtyPerBoard=4`, Table Uprights uses `QtyPerBoard=2`. Each physical board produces both outputs simultaneously.

### Full active-order calculation

| Metric | Verified total |
|---|---:|
| Active orders / lines / finished units | 1 / 9 / 9 |
| Required part/color combinations | 32 |
| Required parts | 216 |
| Shortage combinations / parts after inventory | 32 / 216 |
| CNC shortage combinations / parts | 16 / 93 |
| Non-CNC shortage combinations / parts | 16 / 123 |
| Recommended CNC files / complete runs | 9 / 15 |
| Uncovered CNC shortages / manual-color validation messages | 0 / 0 |

`5x12 Base Bottom` is emitted once, for **one Black run**:

| Output | Demand | Stock | Per run / expected output | Credited to demand | Expected surplus |
|---|---:|---:|---:|---:|---:|
| Base Bottoms | 6 | 0 | 36 | 6 | 30 |
| Table Uprights | 6 | 0 | 18 | 6 | 12 |

No standalone Table Uprights run is recommended. The corrected board model counts the owner-confirmed shared allocation once: **9 Black boards**, not 18 or 22. The full CNC plan uses **152 physical boards: 74 Black and 78 customer-color**. Expected output remains an in-memory planning credit and is not added to inventory.

Other recommendations: A-Frame 1 run, Base Top 1, Luxe 2.0 Back 1, Luxe 2.0 Seat 1, Luxe Arms 3, Luxe Table Top 3, Table Feet 1, Front Slat Logo 3.

### Code and validation

- `src/lib/domain/productionCalculations.ts`: accepts an explicit one-driver-plus-byproducts relationship across different files, validates the Parts reference against the driver, and retains rejection of ambiguous drivers, duplicate rows, invalid output capacities, and incompatible output colors.
- `src/lib/domain/cncCalculations.ts`: calculates fixed-color fallback runs from remaining demand, accounts for fixed byproduct credits, and reports fallback demand/surplus after prior credits. `physicalBoardAllocations` explicitly treats only the confirmed `5x12 Base Bottom` / Base Bottoms / Table Uprights pair as one board allocation. It requires exactly those outputs, matching positive integral board counts, and fixed Black material. Other files retain separate row allocations; equal counts or driver/byproduct status alone never imply shared boards. No Sheet schema change was made.
- `src/lib/domain/orderParsing.ts` and `src/services/orders.ts`: exclude completed historical rows before validating active-order identity.
- `src/lib/domain/productionCalculations.test.ts` and `orderParsing.test.ts`: regression coverage for shared outputs, inventory subtraction, fallback elimination/residual demand, current capacities, unchanged inventory, row-order independence, invalid mappings, and completed/invalid order rows. The existing fallback test now expects residual demand of 1 rather than original demand of 10.
- `scripts/verify-production.mjs`: reusable server-side, read-only verifier using existing Sheets access and service parsers. Prints only production metadata, physical board totals, and aggregate order counts, suppressing raw transport errors. Run with Node 24: `node --use-system-ca scripts/verify-production.mjs`. Windows system certificates were needed here; TLS verification remains enabled.
- `npm test`: 28 tests pass. Updated Base Bottom fixtures verify 36/18 output from 9 boards, covered demand, stock subtraction, residual fallback demand, and inventory immutability. Two added tests reject malformed shared-board definitions and verify current Gliding Ottoman driver/byproducts still consume four boards (two customer-color, two Black). Generic historical fallback fixtures now use a synthetic file name rather than claiming obsolete Base Bottom capacities.
- `npx tsc --noEmit`: passes.
- `npm run build`: passes with network access. The first sandboxed attempt could not fetch existing Google Fonts dependencies.
- `npm run lint`: fails with 15 existing errors and 4 warnings. Errors occur in DisplayContext, OrderCard, OrdersList, OrdersTable, OrderDialog, OrderTvCard, OrdersTvPage, EmployeeDetailsDrawer, and RunCompleteDialog (React effect/static-component/immutability rules and explicit `any`). Warnings concern existing unused values and hook dependencies. These UI/write-dialog issues are outside this calculation fix.
- Diagnostic handlers remain hard-coded 404 responses.

No current data correction is required to complete this active production plan. Authentication and safe transactional completion workflows remain separate unresolved phases. Historical blank order IDs remain in Sheets and were not modified. The verifier performs multiple read requests, not an atomic Sheets snapshot; results describe the data read during this verification.

---

**Audit date:** 2026-09-18  
**Scope:** Repository code, read-only live Google Sheets verification, pure production calculations, static checks, production build, and browser inspection.  
**Safety:** No Google Sheets data was modified. No credentials, private keys, spreadsheet IDs, customer names, or environment values are included.

## A. Executive Summary

The application is not yet safe for production shop use because authentication and transactional write workflows remain unimplemented.

Current live-data status:

- Inventory: 118 rows read; all `In Stock` values are valid non-negative integers, including numeric zero.
- `Luxe Table Top` is canonical and consistent in BOM, Parts, inventory, and CNC Files.
- The full active production calculation is blocked by remaining CNC cross-reference problems: `Sapphire Table Top` is not represented by the same canonical PartName in CNC Files, and `Table Uprights` has duplicate CNC mappings.
- The new `Luxe Logo Slat` CNC row is standalone, not shared with another CNC output.
- Gliding Ottoman's grouped four-output CNC definition is valid.

Largest remaining risks:

- **Security:** no authenticated session protects the application or API routes.
- **Correctness:** order completion and production completion writes are not transactional or idempotent.
- **Data integrity:** the Logo Slat filename mismatch prevents complete production calculation; legacy display spellings remain in data but map deterministically.
- **Usability:** production work is displayed, but worker assignment, claiming, history, and concurrency protection are not implemented.

## B. Current Architecture

- Next.js 16 App Router, React 19, TypeScript, and Google Sheets.
- `src/lib/googleSheets.ts` owns server-side Sheets access.
- Services under `src/services` adapt Sheet rows to application data.
- Pure calculation logic is in `src/lib/domain/productionCalculations.ts` and `src/lib/domain/cncCalculations.ts`.
- `CNC Files` is authoritative for CNC run calculations.
- Parts are classified as CNC-cut by canonical `Primary Machine = CNC`.
- Rows sharing `CNC Files.FileName` are grouped into one multi-output run definition.
- The Node test script and pure-domain test suite are active.
- `/api/debug-env` and `/api/test-sheet` return 404 and do not expose secrets or raw order rows.
- No authentication, database transaction layer, production-job persistence, activity history, or worker assignment system exists.

## C. Latest Live Verification

### Sheet sizes

- Orders: 134 data rows.
- BOM: 62 data rows.
- Shop Parts Inventory: 118 data rows.
- Parts: 34 data rows.
- CNC Files: 20 data rows.
- Colours: 6 data rows.

### Inventory

- Total inventory rows read: 118.
- Blank `In Stock` cells: none.
- Invalid, negative, fractional, or nonnumeric quantities: none.
- Duplicate canonical part/color records: none.
- Numeric zero remains distinct from blank or invalid data; all 118 current values are deliberate numeric zero values.
- Canonical legacy values: 14 `Cherry` colors map to `Cherrywood`; one Unicode-hyphen `A-frame` variant maps to `A-frame`.
- No separate inventory pools are created by those legacy values.

### Canonical name verification

`Luxe Table Top` is now the one canonical name in BOM, Parts, Shop Parts Inventory, and CNC Files.

- BOM uses `Luxe Table Top` for the Luxe Table recipe.
- Parts contains `Luxe Table Top`.
- Inventory contains `Luxe Table Top` rows for Toffee, Granite, and Marble with numeric quantities.
- No `Luxe Top` variant remains in BOM, Parts, inventory, or CNC Files.

Possible equivalent mismatch:

- BOM, Parts, and inventory use `Sapphire Table Top`.
- CNC Files row 10 currently contains `PartName = Sapphire Sapphire Top`.
- This is a separate unresolved CNC naming mismatch; no automatic alias is applied.

### Luxe Logo Slat CNC verification

Parts row 5 has `Luxe Logo Slat`, `Primary Machine = CNC`, and `Parts.CNC File = Front Slat Logo`.

CNC Files row 21 has:

- `FileName = Luxe Logo Slat`
- `PartName = Luxe Logo Slat`
- `QtyPerBoard = 1`
- `BoardsPerFile = 8`
- `MultiColor = TRUE`
- blank `FixedColor`

The row is standalone. It is not shared with another CNC output. `Parts.CNC File` now matches `CNC Files.FileName`; the Logo Slat blocker is resolved.

### Gliding Ottoman CNC verification

The four rows use the shared file `Gliding Ottoman` and retain independent output definitions:

| CNC row | PartName | QtyPerBoard | BoardsPerFile | MultiColor | FixedColor | Parts per run |
|---:|---|---:|---:|---|---|---:|
| 17 | `Ottoman Front Slat` | 4 | 1 | TRUE | blank | 4 |
| 18 | `Ottoman Base Top` | 4 | 1 | FALSE | Black | 4 |
| 19 | `Ottoman Side` | 4 | 1 | FALSE | Black | 4 |
| 20 | `Ottoman Leg` | 8 | 1 | TRUE | blank | 8 |

One grouped run uses four boards: two customer-color boards and two black boards. It produces 4 Front Slats, 4 Base Tops, 4 Sides, and 8 Legs. Expected output is not added to inventory before confirmed completion.

## D. Full Production Calculation Status

The live calculation was attempted using the current active orders and the pure application calculation path.

- Active orders: 1, reported without customer identifiers.
- Active order lines: 9.
- Unknown statuses: none; current supported statuses are `Waiting` and `Completed`.
- Waiting orders contribute demand; completed orders are excluded.
- Total calculated part requirements: unavailable because validation stops at remaining CNC mapping problems.
- Total part-and-color shortages: unavailable for the same reason.
- Grouped CNC recommendations: none emitted because the complete plan is blocked before requirements finalize.
- Non-CNC shortages: unavailable until the complete calculation passes validation.
- Remaining blockers: `Sapphire Sapphire Top` versus canonical `Sapphire Table Top`, and duplicate CNC mappings for `Table Uprights`.

The verification confirms that inventory is intended to be subtracted before scheduling, grouped CNC files are emitted once per file/color plan, fixed-color outputs are counted once per actual run, and expected output is not written to inventory by the read-side calculation.

## E. Confirmed Problems and Fixed Findings

### Remaining problems

| Severity | Area | Evidence | Consequence |
|---|---|---|---|
| Critical | Authentication | No shared authenticated session protects pages or API routes. | Anyone who can reach the URL may read or modify operational data. |
| Critical | Writes | Order completion, inventory deduction, and production completion are not transactional or idempotent. | Duplicate or partial requests can make order status and inventory inconsistent. |
| High | CNC metadata | Resolved: Parts row 5 and CNC Files row 21 both use `Front Slat Logo` for `Luxe Logo Slat`; capacities and color configuration validate. | Logo Slat no longer blocks calculation. |
| High | Cross-reference | CNC Files row 10 has `PartName = Sapphire Sapphire Top`, while BOM/Parts/inventory use `Sapphire Table Top`. | Sapphire Table Top CNC mapping cannot be trusted without an exact-name correction. |
| High | Duplicate CNC mapping | CNC Files rows 4 and 16 both use `PartName = Table Uprights`, with different filenames (`5x12 Base Bottom` and `5x12 Table Uprights`). | The calculation rejects the ambiguity instead of silently selecting one row. |
| Medium | UI | Existing production page still has mobile overflow and lacks full worker assignment/history. | Shop-floor work remains difficult to coordinate. |
| Medium | Lint | Existing React effect, `any`, and component-creation lint errors remain. | CI quality gate is not clean. |
| Medium | Data | Legacy `Cherry` and `A-frame` spellings remain in data, though canonical mapping is deterministic. | Future direct Sheet consumers could still split records. |

### Fixed or verified

- Blank inventory quantities are resolved in the current live Sheet.
- Numeric zero is distinct from blank/invalid inventory.
- Strict Sheet parsing rejects invalid quantities and reports row context.
- Pure production and CNC calculations exist with automated tests.
- CNC classification uses `Primary Machine = CNC`.
- Shared CNC files are grouped into one multi-output recommendation.
- `Cherry` maps to `Cherrywood`; Unicode-hyphen `A-frame` maps to `A-frame`.
- Diagnostic routes are disabled.
- Gliding Ottoman's four-output grouped CNC definition is valid.
- Luxe Logo Slat filename, capacity, and color validation is resolved.
- Luxe Table Top now matches canonically across BOM, Parts, inventory, and CNC Files.

## F. Checks

- `npm test`: passed, 16 tests.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm run lint`: fails on existing UI/component issues, including React effect rules, `any` types, and nested component creation.

## G. Production-Work Recommendation

For a two- or three-person shop, use a small queue rather than an ERP:

- Today view with prioritized jobs, blockers, due dates, and worker assignments.
- Queue filters by CNC, chop saw, assembly, sanding, and finishing.
- Job fields: stable ID, part, color, workstation, planned/completed/remaining quantity, status, assignee, source orders, priority, blocker, notes, and timestamps.
- Status flow: `Ready -> Assigned -> In Progress -> Completed`; blocked work returns to `Ready` after resolution.
- Claim must be an atomic conditional operation so two workers cannot claim the same job.
- Completion must record actual output, update remaining quantity, add inventory, and create history in one approved transactional workflow.

## H. Implementation Plan

1. Resolve the `Sapphire Sapphire Top` PartName and duplicate `Table Uprights` CNC mappings in source data or approved canonical metadata.
2. Add authentication using the Supabase Auth design below.
3. Add transactional order completion and inventory deductions.
4. Add transactional production completion with idempotency and actual-output inventory updates.
5. Add production jobs, atomic claims, worker history, and tablet UI.
6. Reassess which operational records should move from Sheets to Supabase/Postgres.

## I. Supabase Auth Proposal For Approval

No authentication code has been implemented.

### Approach and dependencies

- Use Supabase Auth email/password for one shared shop user with equal access.
- Add `@supabase/supabase-js` and `@supabase/ssr`.
- Do not add custom password hashing or a custom session table.
- Do not add `SUPABASE_SERVICE_ROLE_KEY` for authentication. The browser and Proxy must never receive a service-role key.

### Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Use the publishable key name above unless the installed Supabase version officially requires the documented legacy public key name. No secret service-role variable is needed for this authentication design.

### Exact files

Create:

- `src/lib/supabase/client.ts`, browser client using `createBrowserClient`.
- `src/lib/supabase/server.ts`, server client using `createServerClient` and request cookies.
- `src/lib/auth/requireSession.ts`, server-only helper that calls `supabase.auth.getUser()` and rejects missing/unverified identity.
- `src/app/login/page.tsx`.
- `src/app/api/auth/login/route.ts`.
- `src/app/api/auth/logout/route.ts`.
- `src/proxy.ts`, Next.js 16 Proxy for session refresh and optimistic redirects.

Modify:

- Protected page layout or route entry points.
- Every protected Route Handler under `src/app/api`.
- Every future Server Action that changes state.
- `package.json` and `package-lock.json` for the two dependencies.

### Login, logout, and verification

- Login page submits email/password to the login Route Handler.
- Handler calls Supabase Auth `signInWithPassword` through the server client.
- Supported Supabase SSR cookies are written by the server client.
- Successful login redirects to `/dashboard`.
- Logout calls `signOut`, clears the SSR session cookies, and redirects to `/login`.
- `src/proxy.ts` refreshes the session and performs optimistic redirects only.
- Every protected Route Handler and Server Action independently calls `requireSession`, which uses verified Supabase user identity. Proxy is never the sole authorization layer.

### Session behavior

- Supabase manages access and refresh tokens through its supported SSR cookie flow.
- Browser cookies are `HttpOnly`, `Secure` in production, `SameSite=Lax`, and scoped to the application.
- Access tokens refresh through the SSR server client and Proxy flow.
- Route Handlers reject missing or invalid sessions with `401`; protected pages redirect to `/login`.

### Initial shared account

1. Create or select a Supabase project.
2. Create one user in Supabase Dashboard Authentication, or use the Supabase Admin UI outside this application.
3. Use a shop-controlled email address, enable email/password, and set the initial password through Supabase's secure dashboard flow.
4. Do not create a signup route.

### Rate limiting and CSRF

- Enable Supabase Auth protections and CAPTCHA/rate limits available in project settings.
- Add application-level login attempt throttling at the Route Handler or an edge-compatible provider if stronger protection is required.
- For every state-changing request, require an allowed `Origin` matching the configured application origin and reject missing/mismatched origins.
- Use `SameSite=Lax` cookies and verify request method/content type.
- Do not rely on cookies alone as CSRF protection for write requests.

### Protected coverage

Protect all application pages: `/`, `/dashboard`, `/orders`, `/orders/tv`, `/inventory`, `/production`, `/cnc`, `/piecework`, `/payroll`, `/reports`, and `/settings`.

Protect all API reads and writes, including `/api/orders`, `/api/inventory`, `/api/production`, `/api/cnc-files`, `/api/dashboard`, `/api/products`, `/api/colours`, `/api/customers`, `/api/employees`, `/api/piece-jobs`, `/api/piecework`, `/api/payroll`, and `/api/parts`. Login/logout are the only public auth endpoints. Disabled diagnostics remain disabled.

### Supabase and Vercel setup

- A new Supabase project is required unless an existing approved project is designated for this application.
- Add the URL and publishable key to local `.env.local` and Vercel project environment settings.
- Configure production and preview redirect URLs in Supabase Auth.
- Use HTTPS in Vercel production.
- No service-role key is needed for authentication; Google Sheets credentials remain server-only and separate.
- Supabase's free tier may be sufficient for one shared account and low-volume sessions; review current plan limits, Auth email settings, and CAPTCHA/provider costs before deployment.

### Recovery, tests, and rollback

- Password recovery uses Supabase's password-reset email flow to the controlled shop account.
- An administrator can reset the shared password in Supabase Dashboard and revoke sessions through Supabase Auth controls.
- Tests: browser/client creation, server client cookie handling, verified `getUser` identity, login success/failure, logout, protected page redirect, protected Route Handler `401`, Origin rejection, refresh behavior, and no service-role key in browser/Proxy bundles.
- Rollback: disable the protected deployment or revert auth route/layout changes, keep diagnostic routes disabled, and remove the public Supabase environment variables from deployment after confirming no protected workflow is active.

Approval is required before implementing this design.

## J. Deferred Write Workflows

Order completion and production completion remain unimplemented. They require idempotency keys, sufficient-inventory validation, transactional state changes, recovery handling, and post-write reconciliation before approval.

Expected production output must not enter inventory until actual output is confirmed. Authentication, inventory writes, order-completion writes, and production-job persistence are not included in this audit update.
