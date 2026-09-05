# FIRECYCLE® COMMAND CENTER FREE v1.1

Versión estática, gratuita y exportable del Command Center FIRECYCLE.

## Salto v1.1

La v1.1 materializa el primer paso del roadmap operativo: **M02 Evidence Engine**. El paquete incorpora un manifest local de evidencia con hashes SHA-256, procedencia de compilación, estados de verdad y audit trail descargable. Esto permite declarar como `VERIFIED` la integridad de los artefactos del propio paquete, sin convertir en “verificados” datos externos que todavía no han sido aportados.

## Gates conservados deliberadamente

- M01 Territory: `HOLD` para geometría/baseline administrativo definitivo.
- M00-SAT: `HOLD` para conectores live y observaciones reales.
- M03 Risk: `HOLD/NOT AVAILABLE` hasta entradas M01 + M02 verificadas.
- M04 Intervention: `HOLD` hasta riesgo, expediente y evidencia suficiente.
- M08 MRV: `HOLD` hasta baseline + intervención verificable.
- M16 Assurance: estructura `DEFINED`; evidencias de assurance externo no inventadas.

## Uso

Abra `index.html` en un navegador. No requiere servidor, cuenta, suscripción ni API. En **C4 Evidence Engine / M02** puede inspeccionar los hashes incluidos y descargar `FIRECYCLE_EVIDENCE_MANIFEST_v1.1.json`.

## Principio de verdad

`DATA → PROVENANCE → EVIDENCE → KPI → GATE → DECISION → ACTION → RESULT → NEW EVIDENCE`

Ningún `DEFINED/HOLD` se eleva a `VERIFIED` por razones visuales o de completitud: solo cambia cuando existe evidencia verificable materializada.
