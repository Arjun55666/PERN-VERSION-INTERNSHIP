# Asset Management PERN migration

A separate PERN implementation of the asset-management workflows. It uses only generated demo data and does not copy the source SQLite database, uploads, QR images, branding, or employee records.

## Converted modules

- Dashboard summary and groupings
- Asset creation, listing, detail, status, and QR download
- Assignment, shift, unassignment, and history
- Location-aware CSV/PDF reports
- Verification image upload and status storage
- Atomic spreadsheet asset import
- Location capacity configuration

## Local setup

1. Copy `server/.env.example` to `server/.env`.
2. Start PostgreSQL: `docker compose up -d`.
3. Install dependencies: `npm run install:all`.
4. Generate and migrate: `npm run db:generate --prefix server` then `npm run db:migrate --prefix server`.
5. Seed fake data: `npm run db:seed --prefix server`.
6. Start both applications: `npm run dev`.

Client: `http://localhost:5173`  
API: `http://localhost:5050/api`

## Verification boundary

The converted verification module safely uploads evidence and records verification status. Automated QR decoding, OCR, and fuzzy serial matching are not yet claimed as converted; they need dedicated algorithm parity tests.

## Safety

Never import a real operational database or upload directory into this repository. Keep secrets in `.env`, and use approved infrastructure before any deployment.
