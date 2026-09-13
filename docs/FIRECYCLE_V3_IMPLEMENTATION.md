# FIRECYCLE v3 Implementation Specification

## Status
Foundation branch: `v3-foundation`

## Objective
Transform the current static Command Center into a database-backed, evidence-driven operational platform while preserving the existing truth-state and gate semantics.

## Architecture
- Next.js App Router + TypeScript
- PostgreSQL + PostGIS
- REST API under `/api/v3`
- Domain services isolated from UI
- Algorithm registry with versioned inputs/outputs
- Connectors for satellite, weather, climate and GIS sources
- Background jobs for ingestion and processing
- Evidence + provenance + audit as first-class platform services

## Non-negotiable truth model
`DATA -> PROVENANCE -> EVIDENCE -> KPI -> GATE -> DECISION -> ACTION -> RESULT -> NEW EVIDENCE`

`DEFINED`, `HOLD`, `ESTIMATED`, `OBSERVED`, `CALCULATED` and `VERIFIED` are materially different states. UI completeness never promotes a state to `VERIFIED`.

## Modules
M00 Command Center; M01 Territory; M02 Evidence; M03 Risk; M04 Intervention; M05 Satellite; M06 Fire; M07 Climate; M08 MRV; M09 Infrastructure; M10 Economy; M11 Funding; M12 AI; M13 Scenarios; M14 Reporting; M15 GIS; M16 Assurance & Audit.

## Initial foundation scope
1. Database/PostGIS migrations.
2. Domain entity and truth-state contracts.
3. Evidence/provenance/audit core.
4. Versioned algorithm registry.
5. Connector and job contracts.
6. Next.js route skeleton under `app/api/v3`.
7. Documentation and migration strategy.

## Gate rules
M03 Risk requires a verified M01 baseline and sufficient M02 evidence. M04 Intervention requires risk + evidence. M08 MRV requires a verifiable baseline and intervention. M16 Assurance cannot invent external assurance evidence.

## Migration strategy
The existing static UI remains untouched on `main`. `v3-foundation` adds the operational platform alongside it. Subsequent commits will migrate one module at a time, starting with M02 Evidence and M01 Territory, then activating M03 Risk.
