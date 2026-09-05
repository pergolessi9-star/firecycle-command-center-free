window.FIRECYCLE_DATA = {
  version: "1.3-c3",
  generatedAt: "2026-09-06T00:05:00+02:00",
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
    {id:"AUD-006",event:"C2 FIREWATCH / M00-SAT deep navigation materialized",state:"DEFINED"},
    {id:"AUD-007",event:"C3 Territory / M01 deep navigation materialized",state:"DEFINED"}
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
  },
  c3: {
    gateState:"HOLD",
    gateReason:"El baseline territorial no puede elevarse a VERIFIED hasta incorporar geometría administrativa y catastral verificable, CRS explícito, fuente, fecha, checksum y vínculo M02.",
    baselineContract:["GEOMETRÍA","CRS","FUENTE","FECHA","CHECKSUM","EVIDENCIA M02","KPI","GATE","DECISIÓN HUMANA"],
    sections:[
      {id:"territories",label:"Territorios",code:"M01.01",state:"DEFINED",description:"Ámbitos territoriales y unidades de proyecto con identidad, alcance y estado de verificación.",records:[
        {id:"TER-001",name:"Pinofranqueado–Las Hurdes",state:"DEFINED",source:"Contexto de proyecto",evidence:"Ámbito nominal y superficie de contexto declarada: 3.765,34 ha; geometría GIS aún no validada.",kpi:"Cobertura geométrica: NOT AVAILABLE",gate:"HOLD"},
        {id:"TER-DEMO-001",name:"DEMO-100HA-01",state:"DEFINED",source:"FIRECYCLE project scope",evidence:"Unidad demostrativa definida en 100 ha; falta polígono administrativo definitivo.",kpi:"Superficie GIS validada: NOT AVAILABLE",gate:"HOLD"}
      ]},
      {id:"parcels",label:"Parcelas",code:"M01.02",state:"HOLD",description:"Parcelas administrativas/catastrales vinculadas a titularidad, referencia y evidencia documental.",records:[
        {id:"PAR-001",name:"Inventario parcelario DEMO",state:"NOT AVAILABLE",source:"Catastro / expediente territorial",evidence:"No se declaran referencias catastrales, titulares ni superficies sin fuente incorporada.",kpi:"Parcelas verificadas: 0",gate:"HOLD"},
        {id:"PAR-SCHEMA-001",name:"Contrato de ficha parcelaria",state:"DEFINED",source:"M01 schema",evidence:"Campos previstos: referencia, titularidad, superficie, municipio, MUP, ZAU, Natura 2000, restricciones y evidence_id.",kpi:"Schema coverage",gate:"DEFINED"}
      ]},
      {id:"stands",label:"Rodales",code:"M01.03",state:"HOLD",description:"Unidades de gestión forestal derivadas de geometría verificada y atributos de campo/teledetección.",records:[
        {id:"ROD-001",name:"Rodalización DEMO-100HA-01",state:"NOT AVAILABLE",source:"M01 / campo / LiDAR",evidence:"No se inventan rodales, especies, densidad, FCC, edad o biomasa.",kpi:"Rodales verificados: 0",gate:"HOLD"},
        {id:"ROD-SCHEMA-001",name:"Contrato de rodal",state:"DEFINED",source:"M01 schema",evidence:"Campos previstos: geometry_id, forest_type, species, slope, aspect, canopy, biomass, severity, treatment_class, evidence_id.",kpi:"Schema coverage",gate:"DEFINED"}
      ]},
      {id:"layers",label:"Capas",code:"M01.04",state:"HOLD",description:"Catálogo de capas temáticas con procedencia, fecha, CRS, resolución y checksum.",records:[
        {id:"GIS-LAYER-001",name:"Perímetro administrativo definitivo",state:"HOLD",source:"Administración competente",evidence:"Pendiente de geometría oficial incorporada y hash de artefacto.",kpi:"NOT AVAILABLE",gate:"HOLD"},
        {id:"GIS-LAYER-002",name:"Parcelario / Catastro",state:"HOLD",source:"Catastro / fuente administrativa",evidence:"Pendiente de dataset o referencias verificables incorporadas.",kpi:"NOT AVAILABLE",gate:"HOLD"},
        {id:"GIS-LAYER-003",name:"Natura 2000 / condicionantes ambientales",state:"HOLD",source:"Fuente oficial",evidence:"Pendiente de intersección GIS reproducible.",kpi:"NOT AVAILABLE",gate:"HOLD"},
        {id:"GIS-LAYER-004",name:"Severidad / cicatriz de incendio",state:"HOLD",source:"M00-SAT / producto EO",evidence:"Pendiente de producto raster/vector real con procedencia M02.",kpi:"NOT AVAILABLE",gate:"HOLD"}
      ]},
      {id:"gis",label:"GIS",code:"M01.05",state:"DEFINED",description:"Contrato técnico para geometrías, CRS, validación topológica, intersecciones y servicios geoespaciales.",records:[
        {id:"GIS-CRS-001",name:"CRS territorial",state:"DEFINED",source:"M01 technical contract",evidence:"Debe declararse explícitamente en cada dataset; esta versión no fija uno sin geometría real.",kpi:"CRS compliance",gate:"DEFINED"},
        {id:"GIS-TOPO-001",name:"Validación topológica",state:"DEFINED",source:"M01 technical contract",evidence:"Reglas previstas: geometría válida, no self-intersections, superficie reproducible y linaje de transformación.",kpi:"Topology pass rate",gate:"DEFINED"},
        {id:"GIS-SERVICE-001",name:"PostGIS / Geo service",state:"HOLD",source:"C11 backend",evidence:"La versión GitHub Pages es estática y no declara PostGIS activo.",kpi:"Health: NOT AVAILABLE",gate:"HOLD"}
      ]},
      {id:"record",label:"Ficha territorial",code:"M01.06",state:"DEFINED",description:"Ficha maestra que consolida territorio, parcela, rodal, capas, restricciones, evidencia, KPI y gate.",records:[
        {id:"TER-FICHA-001",name:"Ficha territorial DEMO-100HA-01",state:"DEFINED",source:"M01 → M02",evidence:"Estructura preparada; contenido operativo pendiente de polígono, parcelas, capas y evidencias verificables.",kpi:"Completitud baseline: 0% VERIFIED",gate:"HOLD"},
        {id:"TER-GATE-001",name:"Baseline territorial GO/HOLD",state:"HOLD",source:"M01 governance",evidence:"GO solo cuando geometría, superficie, parcelario mínimo, capas críticas, procedencia y checksums estén vinculados a M02.",kpi:"Gate readiness",gate:"HOLD"}
      ]}
    ]
  }
};