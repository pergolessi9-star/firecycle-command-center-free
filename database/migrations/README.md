# FIRECYCLE v3 database migrations

Migrations are append-only and ordered numerically.

`0001_v3_foundation.sql` creates the initial PostGIS, territory, evidence, provenance, audit, risk, event and job primitives.

Future migrations must not rewrite existing migration files. Use a new numbered migration for every schema change.
