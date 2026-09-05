window.FIRECYCLE_DATA = {
  version: "1.2-c2",
  generatedAt: "2026-09-05T23:55:00+02:00",
  evidenceManifest: [
    {id:"EVD-FILE-001",file:"index.html",state:"VERIFIED",sha256:"aa51486832ea222dd5f7b2bb74aa4496747facb2ecee9719f7734f7e2dce28bb",provenance:"FIRECYCLE local package baseline"},
    {id:"EVD-FILE-002",file:"styles.css",state:"VERIFIED",sha256:"475b0e5b2c95813d12f281cc554214e9f1f0aa65b5d166802b4ffbde66266a81",provenance:"FIRECYCLE local package baseline"},
    {id:"EVD-FILE-003",file:"app.js",state:"VERIFIED",sha256:"7681b49434092757f3b11051d167ad2cb657c8c67c564bdfe0d47d02dfd94f5b",provenance:"FIRECYCLE local package baseline"}
  ],
  auditTrail: [
    {id:"AUD-001",event:"v1.0 source package ingested",state:"VERIFIED"},
    {id:"AUD-002",event:"M02 local evidence manifest generated",state:"VERIFIED"},
    {id:"AUD-003",event:"M01 territorial baseline gate retained",state:"HOLD"},
    {id:"AUD-004",event:"M00-SAT live connector gate retained",state:"HOLD"},
    {id:"AUD-005",event:"M03 calculation blocked until verified M01/M02 inputs",state:"HOLD"},
    {id:"AUD-006",event:"C2 FIREWATCH / M00-SAT deep navigation materialized",state:"DEFINED"}
  ],
  recordEvidence: {
    "EVD-SCHEMA-001":{title:"Esquema de evidencia individual",state:"VERIFIED",note:"Estructura local materializada en data.js y manifest descargable.",evidenceId:"EVD-FILE-003",source:"app.js"},
    "EVD-PROV-001":{title:"Modelo de procedencia",state:"VERIFIED",note:"Cada artefacto del paquete se vincula a hash y procedencia de compilación.",evidenceId:"EVD-FILE-001",source:"index.html"},
    "EVD-HASH-001":{title:"Hashes SHA-256 del paquete",state:"VERIFIED",note:"Hashes calculados sobre los artefactos distribuidos en v1.1.",evidenceId:"EVD-FILE-002",source:"styles.css"},
    "EVD-AUDIT-001":{title:"Registro de auditoría local",state:"VERIFIED",note:"Eventos de compilación y gates incluidos en el dataset local.",evidenceId:"EVD-FILE-003",source:"app.js"}
  },
  c2: {
    gateState:"HOLD",
    gateReason:"No existe todavía un conector satelital operacional validado ni observaciones live incorporadas al repositorio.",
    sections:[
      {id:"constellations",label:"Constelaciones",code:"M00-SAT.01",state:"DEFINED",description:"Catálogo de fuentes satelitales previstas y su estado de integración.",records:[
        {id:"SAT-CONST-001",name:"Sentinel-2 L2A",state:"DEFINED",source:"Copernicus / fuente prevista",evidence:"Arquitectura definida; sin escena operacional incorporada.",kpi:"NOT AVAILABLE",gate:"HOLD"},
        {id:"SAT-CONST-002",name:"Sentinel-3 SLSTR",state:"DEFINED",source:"Copernicus / fuente prevista",evidence:"Arquitectura térmica definida; sin ingestión operacional.",kpi:"NOT AVAILABLE",gate:"HOLD"},
        {id:"SAT-CONST-003",name:"NASA FIRMS VIIRS/MODIS",state:"DEFINED",source:"NASA FIRMS / fuente prevista",evidence:"Fuente objetivo definida; conector no validado en esta versión.",kpi:"NOT AVAILABLE",gate:"HOLD"}
      ]},
      {id:"observations",label:"Observaciones",code:"M00-SAT.02",state:"HOLD",description:"Registros de adquisición, timestamp, cobertura y producto.",records:[
        {id:"SAT-OBS-001",name:"Última observación territorial",state:"NOT AVAILABLE",source:"Conector satelital",evidence:"No se inventa timestamp, órbita, producto ni cobertura.",kpi:"NOT AVAILABLE",gate:"HOLD"}
      ]},
      {id:"hotspots",label:"Hotspots",code:"M00-SAT.03",state:"HOLD",description:"Puntos calientes normalizados con confianza y procedencia.",records:[
        {id:"SAT-HOT-001",name:"Hotspots activos",state:"NOT AVAILABLE",source:"NASA FIRMS / térmico",evidence:"Sin feed operacional validado; no se declara fuego activo.",kpi:"NOT AVAILABLE",gate:"HOLD"}
      ]},
      {id:"scenes",label:"Escenas",code:"M00-SAT.04",state:"HOLD",description:"Escenas e imágenes asociadas a observaciones e incidentes.",records:[
        {id:"SAT-SCN-001",name:"Escena pre/post territorio",state:"NOT AVAILABLE",source:"Sentinel-2 / Sentinel-3",evidence:"Pendiente de selección y evidencia de producto real.",kpi:"NOT AVAILABLE",gate:"HOLD"}
      ]},
      {id:"incidents",label:"Incidentes",code:"M00-SAT.05",state:"HOLD",description:"Agrupación operacional de observaciones, hotspots, escenas y decisiones.",records:[
        {id:"SAT-INC-001",name:"Incidente FIREWATCH",state:"NOT AVAILABLE",source:"M00 FIREWATCH",evidence:"No existe incidente live registrado en esta versión estática.",kpi:"NOT AVAILABLE",gate:"HOLD"}
      ]},
      {id:"evidence",label:"Evidencia",code:"M00-SAT.06",state:"DEFINED",description:"Puente probatorio entre M00-SAT y M02 Evidence Engine.",records:[
        {id:"SAT-EVD-001",name:"Contrato de evidencia satelital",state:"DEFINED",source:"M00-SAT → M02",evidence:"Esquema previsto: source_id, acquired_at, geometry, product_id, checksum, confidence, truth_state.",kpi:"Schema coverage",gate:"DEFINED"}
      ]}
    ]
  }
};