window.FIRECYCLE_DATA = {
  "version": "1.1",
  "generatedAt": "2026-09-05T23:30:00+02:00",
  "evidenceManifest": [
    {
      "id": "EVD-FILE-001",
      "file": "index.html",
      "state": "VERIFIED",
      "sha256": "aa51486832ea222dd5f7b2bb74aa4496747facb2ecee9719f7734f7e2dce28bb",
      "provenance": "Generated locally from FIRECYCLE_COMMAND_CENTER_FREE_v1.0 → v1.1 build"
    },
    {
      "id": "EVD-FILE-002",
      "file": "styles.css",
      "state": "VERIFIED",
      "sha256": "475b0e5b2c95813d12f281cc554214e9f1f0aa65b5d166802b4ffbde66266a81",
      "provenance": "Generated locally from FIRECYCLE_COMMAND_CENTER_FREE_v1.0 → v1.1 build"
    },
    {
      "id": "EVD-FILE-003",
      "file": "app.js",
      "state": "VERIFIED",
      "sha256": "7681b49434092757f3b11051d167ad2cb657c8c67c564bdfe0d47d02dfd94f5b",
      "provenance": "Generated locally from FIRECYCLE_COMMAND_CENTER_FREE_v1.0 → v1.1 build"
    }
  ],
  "auditTrail": [
    {
      "id": "AUD-001",
      "event": "v1.0 source package ingested",
      "state": "VERIFIED"
    },
    {
      "id": "AUD-002",
      "event": "M02 local evidence manifest generated",
      "state": "VERIFIED"
    },
    {
      "id": "AUD-003",
      "event": "M01 territorial baseline gate retained",
      "state": "HOLD"
    },
    {
      "id": "AUD-004",
      "event": "M00-SAT live connector gate retained",
      "state": "HOLD"
    },
    {
      "id": "AUD-005",
      "event": "M03 calculation blocked until verified M01/M02 inputs",
      "state": "HOLD"
    }
  ],
  "recordEvidence": {
    "EVD-SCHEMA-001": {
      "title": "Esquema de evidencia individual",
      "state": "VERIFIED",
      "note": "Estructura local materializada en data.js y manifest descargable.",
      "evidenceId": "EVD-FILE-003",
      "source": "app.js"
    },
    "EVD-PROV-001": {
      "title": "Modelo de procedencia",
      "state": "VERIFIED",
      "note": "Cada artefacto del paquete se vincula a hash y procedencia de compilación.",
      "evidenceId": "EVD-FILE-001",
      "source": "index.html"
    },
    "EVD-HASH-001": {
      "title": "Hashes SHA-256 del paquete",
      "state": "VERIFIED",
      "note": "Hashes calculados sobre los artefactos distribuidos en v1.1.",
      "evidenceId": "EVD-FILE-002",
      "source": "styles.css"
    },
    "EVD-AUDIT-001": {
      "title": "Registro de auditoría local",
      "state": "VERIFIED",
      "note": "Eventos de compilación y gates incluidos en el dataset local.",
      "evidenceId": "EVD-FILE-003",
      "source": "app.js"
    }
  }
};
