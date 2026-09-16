# PROJECT FORGE production database

## Required Vercel configuration

Set `DATABASE_URL` in the Vercel Production environment. The secret is never stored in Git.

## Canonical bootstrap

Run from the repository root with the same `DATABASE_URL` used by Vercel:

```bash
npm install
npm run db:migrate
npm run db:seed
```

The migration runner is idempotent and records applied migrations in `schema_migrations`.

## Verification

After deployment, `/api/health` checks the database connection and the required operational tables. It returns HTTP 200 only when all required tables are present.

Required tables:

- projects
- discovery_runs
- agent_runs
- sources
- evidence
- findings
- synthesis
- audit_events

The operational dashboard must remain gated while this endpoint reports a non-200 status.
