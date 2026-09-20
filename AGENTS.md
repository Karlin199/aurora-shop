<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

These instructions apply to the entire repository. A more deeply nested AGENTS.md may add rules for its own directory but must not weaken the safety or data-integrity requirements below.

Project goal

This is an internal production-management system for Aurora Outdoor Furniture. It converts Orders through a BOM into required parts, subtracts Shop Parts Inventory, and maps remaining demand to CNC Files. It must be dependable enough for daily use by office staff and a shop crew of approximately two to three people.

Correct production quantities are more important than clever abstractions or cosmetic improvements. A wrong calculation can cause wasted material, missed due dates, or duplicate work.

Before changing code

Read this file, README.md, package.json, the relevant route/components, and the complete calculation path affected by the task.

Inspect the current implementation before proposing a replacement.

Check the working tree and preserve unrelated user changes.

Trace data from Google Sheets through server utilities/API routes to the UI.

State assumptions explicitly. Ask for an owner decision when a business rule cannot be proven from code or data.

For audits or planning requests, do not implement changes unless the user explicitly asks for implementation.

Communication requirements

Lead with the outcome or confirmed finding.

When proposing or making code changes, always name the exact file path and the function, component, route, or section involved.

Separate confirmed defects from risks, suggestions, and unresolved business questions.

Explain the shop or business consequence of calculation and data-integrity problems.

Do not claim a check passed unless you ran it successfully.

If a check cannot run, give the command, failure cause, and what remains unverified.

Safety and secrets

Never print, expose, commit, or move real credentials, private keys, spreadsheet IDs, access tokens, or environment-variable values.

Google service-account authentication must remain server-side.

Never import server-only modules into client components.

Never write test data to the production spreadsheet.

Never modify production Google Sheets as part of testing or an audit.

Do not change Sheet tab names, headers, column meanings, or order until every dependency has been traced and a migration plan has been approved.

Do not make destructive data changes or broad rewrites without explicit approval.

Validate and authorize every write endpoint; do not rely on hidden UI controls for security.

Avoid logging full Sheet rows when they may contain customer or operational information.

Business-logic invariants

The intended flow is:

Orders -> BOM expansion -> demand by part/color -> inventory subtraction -> production shortage -> CNC mapping/board calculation

Preserve and test these rules:

Only defined production-active statuses contribute demand.

Completed orders do not contribute current demand.

Order quantity multiplies each BOM quantity exactly once.

Demand from multiple orders is combined without double-counting.

Multi-color parts inherit the ordered product color.

Fixed-color parts use their configured fixed color, commonly Black.

Inventory is subtracted only from the matching part and color.

Missing inventory is not automatically equivalent to confirmed zero unless that behavior is explicitly approved and visibly reported.

Negative shortages may display as zero, but surplus inventory must not be lost from underlying calculations.

Missing BOM products, BOM rows, inventory rows, or CNC mappings must produce visible validation errors; never silently omit demand.

CNC capacity calculations must clearly distinguish parts per board, boards per file, file runs, and material color.

Required boards/file runs round upward only at the correct stage.

Empty, whitespace-only, malformed, and number-as-text cells must be handled deliberately.

Customer-order status, production-job status, and part-progress status are separate concepts.

Keep calculation logic in pure, typed domain functions where practical. UI components and route handlers must not maintain separate versions of the same formula.

Known unresolved data issues

Do not silently normalize or choose a value for these cases:

A-frame versus A‑frame (ASCII hyphen versus non-breaking hyphen)

Cherry versus Cherrywood

Smart punctuation versus plain punctuation

Singular/plural, capitalization, and surrounding-whitespace differences

Gliding Ottoman orders without a confirmed complete BOM

CNC rows with blank PartName

CNC rows with blank QtyPerBoard

BOM parts without inventory rows or CNC mappings

Inventory parts without BOM usage

Table Feet: the BOM appears to require two per table while an inventory note may say four

Normalization may be used for detection and reporting. Do not merge records or change business data unless the equivalence has been confirmed. Prefer stable IDs for products, parts, colors, orders, and CNC files over display-name joins when implementing approved schema improvements.

Google Sheets boundaries

Treat every cell as untrusted external input.

Parse and validate rows at the server boundary into explicit domain types.

Do not depend only on physical column positions when headers can be validated and mapped safely.

Distinguish a blank cell, invalid value, and confirmed numeric zero.

Return actionable validation errors with the Sheet tab, row, column, and problematic field when safe to do so.

Batch reads where sensible and avoid repeated per-component Sheet requests.

Handle quota, network, authorization, and malformed-data failures explicitly.

Avoid partial multi-step writes. If Sheets cannot make an operation atomic, document the failure mode and design a recovery path.

Revalidate affected data after writes and prevent duplicate submissions.

Do not introduce caching that can display stale production requirements without a clear invalidation strategy.

Next.js and TypeScript rules

Follow the existing Next.js App Router architecture.

Keep secrets, Sheets clients, and privileged operations in server-only modules.

Use client components only where browser state or interaction requires them.

Validate request bodies and query parameters at API boundaries.

Avoid any, unsafe casts, non-null assertions, and defaults that hide bad data.

Do not use optional chaining or broad try/catch blocks merely to suppress failures.

Preserve useful error details on the server while returning safe, actionable UI messages.

Include intentional loading, empty, validation-error, and failure states.

Maintain accessible labels, keyboard behavior, focus handling, contrast, and touch targets.

Keep shop-floor screens fast and usable on tablets and phones.

Reuse existing patterns and dependencies unless there is a concrete reason not to.

Do not install a large dependency for a small problem without approval.

Production queue direction

When implementing approved production-planning features, keep the workflow small-shop appropriate:

Prioritized jobs based on due date, shortage, dependency readiness, and manual overrides

Workstation or department where useful

Ready, Assigned, In Progress, Blocked, and Completed states

Planned, completed, and remaining quantities

One clear assignee or an atomic claim action

Blocking reason and short notes

Traceability from job to required parts and customer orders

Safe inventory updates when quantities are completed

History of status, quantity, assignee, and priority changes

Protection against two workers claiming or completing the same quantity

Do not build a complex ERP. If concurrent claims, history, or inventory transactions cannot be made reliable in Google Sheets, explain the evidence and propose a gradual database-backed approach rather than silently accepting race conditions.

Testing requirements

Before editing, inspect package.json and use only scripts that actually exist. After relevant changes, run the applicable repository commands, typically:

Lint

TypeScript/type-check

Unit tests

Integration or end-to-end tests when the changed workflow has them

Production build

Changes to calculation logic require focused tests covering the new behavior and regression risk. Important fixtures include:

One order with a manually verifiable BOM

Multiple orders sharing a part/color

Ordered-color and fixed-color parts

Completed-order exclusion

Inventory below, equal to, and above demand

Missing and blank cells

Invalid and number-as-text quantities

Missing mappings

Unicode hyphen and whitespace differences

CNC rounding boundaries

Failed Sheets reads/writes

Duplicate submissions

Concurrent job claims if production assignments exist

Mock external writes. Tests must not depend on or mutate the production spreadsheet.

Change discipline

Make the smallest coherent change that resolves the confirmed problem.

Preserve unrelated edits and existing visual design unless the task requires otherwise.

Do not rename broad sets of files, replace architecture, or migrate data speculatively.

Do not change business data to make a failing test pass.

Add comments for business reasoning, not for obvious syntax.

Remove obsolete code only after confirming it is unreferenced and within task scope.

Update README.md, .env.example, types, and tests when a change alters setup, data shape, or business behavior.

For schema or data migrations, provide forward steps, validation, rollback/recovery, and owner decisions before execution.

Completion report

At handoff, report:

The outcome.

Files created or changed, with exact paths and the relevant section in each.

Business logic or data behavior changed.

Commands/checks run and their results.

Anything not verified.

Remaining risks or owner decisions.

Never describe work as complete while a relevant build, type, test, or data-integrity failure