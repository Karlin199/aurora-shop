This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Aurora Manufacturing System

Internal production-management application for Aurora Outdoor Furniture. The system converts customer orders into part demand, subtracts available shop inventory, and helps the shop determine which parts and CNC files need to be produced.

Purpose

The application is intended to give office and production staff one reliable view of:

Current customer orders and due dates

Required furniture parts calculated from the bill of materials (BOM)

Parts currently available in shop inventory

Remaining parts that must be manufactured

CNC files and estimated board requirements

Completed orders and production history

Production priorities for a shop crew of approximately two to three people

Technology

Next.js 16 using the App Router

React 19

TypeScript

Google Sheets as the current operational data source

Google service-account authentication performed on the server

API routes/server utilities for reading and updating Sheets

The repository is the source of truth for application code. Google Sheets currently hold business data, but display names in Sheets must not be treated as perfectly clean or stable identifiers.

Main application areas

Dashboard: current workload, due dates, warnings, and production priorities

Orders: active and completed customer orders

Inventory / Cut List: available parts, calculated demand, and shortages

CNC Files: mapping from required parts to CNC programs and board quantities

Completed: completed-order records and completion dates

Production planning: planned queue and worker assignments; this area may still be incomplete

Google Sheets data model

The application currently depends on these tabs.

Orders

Column

Meaning

Customer

Customer or dealer name

Item

Product ordered

Color

Product color

Qty

Number of products ordered

Due Date

Required completion/delivery date

Status

Order workflow status

Completed Date

Date the order was completed

BOM

Column

Meaning

Product

Finished product name

Part Name

Required component

Qty Per Unit

Component quantity required per finished product

Shop Parts Inventory

Column

Meaning

Part Name

Component name

Color

Component color or fixed color

In Stock

Current usable quantity

Min Level

Desired minimum inventory

Warn Level

Low-stock warning threshold

Notes

Supporting notes; not a source of truth for calculations

CNC Files

Column

Meaning

FileName

CNC program/file name

PartName

Part produced by the file

QtyPerBoard

Parts produced per board, when applicable

BoardsPerFile

Boards represented by a full CNC run/file

MultiColor

Whether the file follows the ordered product color

FixedColor

Fixed material color, normally Black, when not multi-color

Calculation flow

The expected production calculation is:

Read active customer orders.

Exclude completed or otherwise non-production orders according to the defined status rules.

Multiply each order quantity by every matching BOM row.

Assign the ordered furniture color to multi-color parts.

Assign the defined fixed color to fixed-color parts.

Group required quantities by stable part identity and color.

Subtract usable shop inventory for the same part and color.

Clamp the displayed production shortage to zero without losing knowledge of surplus inventory.

Map shortages to CNC files where appropriate.

Round required boards or file runs upward according to the documented CNC capacity rule.

Business-critical calculation logic should live in pure, typed functions with automated tests. UI components and API handlers should call that shared logic rather than recreating formulas.

Known data-integrity questions

These items must be verified with the business owner before being silently corrected:

A-frame and A‑frame currently use different hyphen characters in different data sets.

Orders may use Cherry while the official material-color name may be Cherrywood.

Gliding Ottoman appears in Orders but may not have a complete BOM.

Some CNC Files rows have blank PartName values.

Several CNC mappings have blank QtyPerBoard values.

The BOM lists two Table Feet per Luxe or Sapphire Table, while an inventory note may state four per unit.

Product, part, color, and status values are currently vulnerable to spelling, whitespace, capitalization, and Unicode differences.

Until these questions are resolved, code must report ambiguous or missing mappings instead of silently dropping demand or guessing a replacement.

Local development

Use the package manager indicated by the repository lockfile. The examples below assume npm.

npm install
npm run dev

Before submitting a change, run the scripts that exist in package.json, normally:

npm run lint
npm run build

Also run the repository's type-check and test scripts when present. Do not invent script names; check package.json first.

Environment variables

Document the required variable names in .env.example. Never commit real values.

Expected categories include:

Google service-account identity

Google service-account private key

Google Sheets spreadsheet ID

Any application authentication or session secrets

All Google credentials and Sheet access must remain server-side. Never include private keys, credentials, or unrestricted Sheet data in client bundles, logs, screenshots, issues, documentation, or commits.

Verification expectations

Changes to production logic should be verified with small fixtures whose results can be calculated manually. At minimum, tests should cover:

BOM expansion and order-quantity multiplication

Ordered-color and fixed-color assignment

Combining demand across orders

Inventory subtraction by part and color

Completed-order exclusion

Blank and invalid numeric cells

Missing BOM, inventory, and CNC mappings

Unicode and whitespace name differences

CNC board/file rounding

Google Sheets read/write failures

Current direction

The highest-value planned addition is a simple production queue for two to three workers. It should show prioritized jobs, allow one worker to claim a job, track planned/completed/remaining quantities, record blockers, and update inventory safely when work is completed. Customer-order status, production-job status, and individual-part progress should remain separate concepts.

Google Sheets may remain appropriate for product setup and reporting. Concurrent job claiming, history, and transactional inventory updates may eventually require a small database. Any migration should be evidence-based and incremental.

Working with Codex

Codex must read the root AGENTS.md before modifying the repository. That file contains the safety, validation, testing, and reporting requirements for AI-assisted changes.