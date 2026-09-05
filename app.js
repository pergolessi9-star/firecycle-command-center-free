const truth = {
  VERIFIED: 'verified', OBSERVED: 'observed', CALCULATED: 'calculated',
  ESTIMATED: 'estimated', DEFINED: 'defined', HOLD: 'hold', 'NOT AVAILABLE': 'na'
};

const modules = [
  {code:'C1', title:'Executive Command Center', short:'Command Center', desc:'Vista ejecutiva, gates, evidencia y estado transversal.', state:'DEFINED'},
  {code:'C2', title:'FIREWATCH / M00-SAT', short:'FIREWATCH / M00-SAT', desc:'Constelaciones, observaciones, hotspots, escenas e incidentes.', state:'HOLD'},
  {code:'C3', title:'Territory / M01', short:'Territory / M01', desc:'Territorios, parcelas, rodales, capas GIS y ficha territorial.', state:'DEFINED'},
  {code:'C4', title:'Evidence Engine / M02', short:'Evidence Engine / M02', desc:'Procedencia, evidencia individual, SHA-256, timestamps y auditoría local.', state:'VERIFIED'},
  {code:'C5', title:'Risk & Priority / M03', short:'Risk & Priority / M03', desc:'Motor explicable R1–R10 preparado para evidencia territorial.', state:'HOLD'},
  {code:'C6', title:'Intervention / M04', short:'Intervention / M04', desc:'Cartera de actuaciones vinculada a riesgo, coste y gates.', state:'HOLD'},
  {code:'C7', title:'Biomass & Operations', short:'Biomass & Operations', desc:'Biomasa, operaciones, recursos y trazabilidad de ejecución.', state:'DEFINED'},
  {code:'C8', title:'Economics & Logistics', short:'Economics & Logistics', desc:'Costes, logística, financiación y escenarios económicos.', state:'DEFINED'},
  {code:'C9', title:'MRV & Monitoring / M08', short:'MRV & Monitoring / M08', desc:'Medición, reporte, verificación y evolución temporal.', state:'HOLD'},
  {code:'C10', title:'Bioeconomy', short:'Bioeconomy', desc:'Cadenas de valor, circularidad y valorización territorial.', state:'DEFINED'},
  {code:'C11', title:'Database & Provenance', short:'Database & Provenance', desc:'Estado de base de datos, conectores y linaje de datos.', state:'HOLD'},
  {code:'C12', title:'AI, Security & Assurance / M16', short:'AI / Security / M16', desc:'Gobernanza IA, seguridad defensiva y assurance evaluable.', state:'DEFINED'}
];

const moduleData = {
  C2: {
    flow:['Constelaciones','Observaciones','Hotspots','Escenas','Incidentes','Evidencia'],
    records:[
      ['SAT-CONST-001','Sentinel-2 L2A','DEFINED','Fuente prevista; conector operacional no declarado.'],
      ['SAT-CONST-002','Sentinel-3 SLSTR','DEFINED','Fuente térmica prevista; sin telemetría activa en esta demo.'],
      ['SAT-CONST-003','NASA FIRMS VIIRS/MODIS','HOLD','Requiere validación del conector y credenciales/uso.'],
      ['SAT-OBS-001','Última observación territorial','NOT AVAILABLE','No se inventa timestamp ni producto satelital.']
    ]
  },
  C3: {
    flow:['Territorios','Parcelas','Rodales','Capas','GIS','Ficha territorial'],
    records:[
      ['TER-001','Pinofranqueado–Las Hurdes','DEFINED','Contexto de proyecto: 3.765,34 ha.'],
      ['TER-DEMO-001','DEMO-100HA-01','DEFINED','Unidad demostrativa de 100 ha.'],
      ['GIS-LAYER-001','Perímetro administrativo','HOLD','Pendiente de geometría administrativa definitiva.'],
      ['GIS-LAYER-002','Severidad / cicatriz','HOLD','Pendiente de evidencia raster/vector validada.']
    ]
  },
  C4: {
    flow:['Fuente','Ingesta','Provenance','Evidence record','Verificación','Audit trail'],
    records:[
      ['EVD-SCHEMA-001','Esquema de evidencia individual','VERIFIED','Esquema local activo: ID, fuente, timestamp, SHA-256, estado y relación funcional.'],
      ['EVD-PROV-001','Modelo de procedencia','VERIFIED','Linaje local activo para artefactos incluidos en v1.1.'],
      ['EVD-HASH-001','Hashes SHA-256 del paquete','VERIFIED','Manifest de integridad generado durante la compilación de v1.1.'],
      ['EVD-AUDIT-001','Registro de auditoría local','VERIFIED','Eventos de compilación y verificación incluidos en el paquete.']
    ]
  },
  C5: {
    flow:['Territorio M01','Evidencia M02','R1–R10','Score','Prioridad','Gate'],
    records:[
      ['RISK-RULESET-001','Motor R1–R10','DEFINED','Reglas deterministas y explicables; entradas reales pendientes.'],
      ['RISK-DEMO-001','Score DEMO-100HA-01','NOT AVAILABLE','No se calcula sin baseline territorial verificable.'],
      ['RISK-GATE-001','Gate de entrada territorial','HOLD','Exige polígono, capas y evidencia mínima.']
    ]
  },
  C6: {
    flow:['Riesgo','Alternativas','Actuación','Coste','Evidencia','Aprobación'],
    records:[
      ['INT-CATALOG-001','Catálogo de actuaciones','DEFINED','Estructura de intervención preparada.'],
      ['INT-DEMO-001','Actuación DEMO-100HA-01','HOLD','No se declara ejecución sin expediente/evidencia.'],
      ['INT-GATE-001','GO / HOLD / NO-GO','DEFINED','Gate formal de decisión humana.']
    ]
  },
  C7: {
    flow:['Recurso','Operación','Equipo','Logística','Evidencia','Resultado'],
    records:[
      ['OPS-GRAPH-001','Operations Graph','DEFINED','Relaciones operativas definidas conceptualmente.'],
      ['BIO-INV-001','Inventario de biomasa','HOLD','Pendiente de inventario/LiDAR/campo verificable.'],
      ['OPS-EXEC-001','Ejecución registrada','NOT AVAILABLE','No se declara una operación material ejecutada.']
    ]
  },
  C8: {
    flow:['Medición','Precio','Coste','Financiador','Anualidad','Certificación'],
    records:[
      ['ECO-STRUCT-001','Modelo económico territorial','DEFINED','Estructura de costes e ingresos prevista.'],
      ['ECO-REAL-001','Coste ejecutado DEMO','NOT AVAILABLE','Sin certificación de ejecución no existe coste real.'],
      ['LOG-001','Modelo logístico','DEFINED','Preparado para rutas, maquinaria y rendimientos.']
    ]
  },
  C9: {
    flow:['Baseline','Indicador','Medición','Reporte','Verificación','Evolución'],
    records:[
      ['MRV-SCHEMA-001','Marco MRV','DEFINED','Modelo de indicadores, evidencias y periodicidad.'],
      ['MRV-BASE-001','Baseline territorial definitivo','HOLD','Debe fijarse antes de reportar cambio.'],
      ['MRV-RESULT-001','Resultado post-intervención','NOT AVAILABLE','No existe resultado sin intervención verificada.']
    ]
  },
  C10: {
    flow:['Recurso','Transformación','Producto','Mercado','Ingreso','Circularidad'],
    records:[
      ['BIOECO-MODEL-001','Modelo de cadena de valor','DEFINED','Arquitectura conceptual preparada.'],
      ['BIOECO-MKT-001','Mercado REDBIOMASA','HOLD','No se activa antes de evidencia, territorio y operaciones.'],
      ['BIOECO-REV-001','Ingresos realizados','NOT AVAILABLE','Sin transacciones verificadas.']
    ]
  },
  C11: {
    flow:['Fuente','Conector','Ingesta','Base de datos','Linaje','Health'],
    records:[
      ['DB-SCHEMA-001','Esquema de datos FIRECYCLE','DEFINED','Modelo lógico de continuidad.'],
      ['DB-CONN-001','Base PostgreSQL/PostGIS','HOLD','Esta versión estática no declara conexión activa.'],
      ['DB-HEALTH-001','Health check operacional','NOT AVAILABLE','Requiere backend desplegado y verificable.']
    ]
  },
  C12: {
    flow:['Activo','Riesgo','Control','Evidencia','Assurance','Decisión humana'],
    records:[
      ['M16-IR-001','Incident Response','DEFINED','Subpanel funcional definido.'],
      ['M16-BC-001','Business Continuity','DEFINED','Subpanel funcional definido.'],
      ['M16-SC-001','Supply-Chain Assurance','DEFINED','Subpanel funcional definido.'],
      ['M16-AI-001','AI Security & Human Oversight','DEFINED','Control de IA y autoridad humana definidos.']
    ]
  }
};

function badge(state){ return `<span class="truth-badge ${truth[state]}">${state}</span>`; }

function renderNav(){
  const nav=document.getElementById('mainNav');
  nav.innerHTML=modules.map(m=>`<button class="nav-item" data-code="${m.code}"><span class="nav-code">${m.code}</span><span class="nav-label">${m.short}</span><span class="nav-arrow">›</span></button>`).join('');
  nav.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.code)));
}

function navigate(code){
  location.hash=code;
  render(code);
}

function setHeader(code){
  const m=modules.find(x=>x.code===code)||modules[0];
  document.getElementById('pageTitle').textContent=m.title;
  document.getElementById('breadcrumb').textContent=`FIRECYCLE / ${m.code} / ${m.short}`;
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.code===m.code));
}

function render(code){
  if(!modules.some(m=>m.code===code)) code='C1';
  setHeader(code);
  document.getElementById('content').innerHTML = code==='C1' ? renderC1() : renderModule(code);
  bindDetails();
}

function renderC1(){
  return `
  <div class="hero">
    <section class="hero-card">
      <span class="eyebrow">C1 · EXECUTIVE COMMAND CENTER</span>
      <h2>De la observación a la decisión verificable</h2>
      <p>FIRECYCLE organiza territorio, evidencia, riesgo, intervención y seguimiento bajo una arquitectura explícita de verdad. La v1.1 activa un Evidence Engine local verificable para los artefactos del propio paquete. Los datos territoriales, satelitales, de riesgo, intervención y MRV continúan sujetos a gates hasta disponer de fuentes operacionales verificables.</p>
      <div class="chain"><span>DATO</span><b>→</b><span>PROCEDENCIA</span><b>→</b><span>EVIDENCIA</span><b>→</b><span>KPI</span><b>→</b><span>GATE</span><b>→</b><span>DECISIÓN</span><b>→</b><span>ACCIÓN</span><b>→</b><span>RESULTADO</span><b>→</b><span>NUEVA EVIDENCIA</span></div>
    </section>
    <section class="hero-card hero-side">
      <h3>Gates prioritarios</h3>
      <div class="gate-list">
        <div class="gate-row"><span>Baseline territorial</span>${badge('HOLD')}</div>
        <div class="gate-row"><span>Conectores satelitales</span>${badge('HOLD')}</div>
        <div class="gate-row"><span>Evidence Engine local</span>${badge('VERIFIED')}</div>
        <div class="gate-row"><span>MRV operacional</span>${badge('HOLD')}</div>
      </div>
    </section>
  </div>
  <div class="metrics">
    <div class="metric"><div class="label">Contexto territorial</div><div class="value">3.765,34 ha</div><div class="note">Dato de proyecto · no equivale a superficie validada GIS</div></div>
    <div class="metric"><div class="label">Unidad demostrativa</div><div class="value">100 ha</div><div class="note">DEMO-100HA-01 · alcance definido</div></div>
    <div class="metric"><div class="label">Módulos C1–C12</div><div class="value">12</div><div class="note">Navegación funcional en esta versión</div></div>
    <div class="metric"><div class="label">Evidence Engine</div><div class="value">LOCAL VERIFIED</div><div class="note">SHA-256 + provenance del paquete v1.1; sin backend externo</div></div>
  </div>
  <div class="grid-2">
    <section class="panel">
      <h3>Territorio</h3><p class="panel-sub">Representación conceptual — no sustituye geometría GIS validada.</p>
      <div class="map-placeholder"><span class="map-label context">Contexto · 3.765,34 ha · DEFINED</span><span class="map-label demo">DEMO-100HA-01 · 100 ha · DEFINED</span></div>
    </section>
    <section class="panel">
      <h3>Estado transversal</h3><p class="panel-sub">Cada tarjeta abre continuidad funcional y evidencia asociada.</p>
      <div class="records">
        ${modules.slice(1).map(m=>`<div class="record-card"><div><strong>${m.code} · ${m.short}</strong><p>${m.desc}</p></div><button class="record-link" data-nav="${m.code}">${badge(m.state)} &nbsp; Abrir</button></div>`).join('')}
      </div>
    </section>
  </div>
  <div style="height:16px"></div>
  <section class="panel">
    <h3>Evidence & Audit Activity</h3><p class="panel-sub">Registro demostrativo de estados; no representa actividad de backend.</p>
    ${recordsTable([
      ['EVT-001','Arquitectura C1–C12 cargada','DEFINED','Interfaz local','Continuidad de navegación'],
      ['EVT-002','Evidence Engine local verificado','VERIFIED','FIRECYCLE v1.1','Manifest SHA-256 y procedencia del paquete activos'],
      ['EVT-003','Baseline territorial','HOLD','Gate territorial','Pendiente de evidencia GIS verificable'],
      ['EVT-004','Conectores satelitales live','NOT AVAILABLE','M00-SAT','No declarados en esta versión estática']
    ])}
  </section>`;
}

function renderModule(code){
  const m=modules.find(x=>x.code===code);
  const d=moduleData[code] || {flow:['Página','Subpágina','Módulo','Submódulo','Registro','Evidencia','KPI','Gate','Decisión'],records:[[`${code}-001`,'Estructura funcional',m.state,m.desc]]};
  return `
  <div class="section-head"><div><span class="eyebrow">${m.code} · FIRECYCLE MODULE</span><h2>${m.title}</h2><p>${m.desc}</p></div>${badge(m.state)}</div>
  <section class="panel">
    <h3>Continuidad funcional</h3><p class="panel-sub">Ningún nodo termina en decoración: cada elemento se proyecta hacia registro y evidencia.</p>
    <div class="flow-strip">${d.flow.map((x,i)=>`${i?'<span class="flow-arrow">→</span>':''}<span class="flow-node">${x}</span>`).join('')}</div>
  </section>
  <div style="height:16px"></div>
  <div class="module-grid">
    ${d.flow.map((x,i)=>`<article class="module-card" data-detail='${JSON.stringify({module:code,stage:x,index:i}).replaceAll("'","&#39;")}'><span class="module-code">${code}.${String(i+1).padStart(2,'0')}</span><h3>${x}</h3><p>Vista funcional de ${x.toLowerCase()} con continuidad hacia procedencia, evidencia, KPI, gate y decisión.</p><div class="module-meta"><span>Continuidad activa</span>${badge(i<2?'DEFINED':m.state)}</div></article>`).join('')}
  </div>
  <div style="height:16px"></div>
  <section class="panel">
    <h3>Registros y evidencia</h3><p class="panel-sub">Los registros sin fuente operacional suficiente permanecen en HOLD o NOT AVAILABLE.</p>
    ${recordsTable(d.records.map(r=>[r[0],r[1],r[2],code,r[3]]))}
  </section>
  ${code==='C4' ? renderEvidenceManifest() : ''}`;
}

function recordsTable(rows){
  return `<div class="table-wrap"><table><thead><tr><th>ID</th><th>Registro</th><th>Estado</th><th>Origen / módulo</th><th>Evidencia / condición</th></tr></thead><tbody>${rows.map(r=>`<tr><td><button class="record-link" data-record="${r[0]}">${r[0]}</button></td><td>${r[1]}</td><td>${badge(r[2])}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}</tbody></table></div>`;
}


function renderEvidenceManifest(){
  const rows=(window.FIRECYCLE_DATA?.evidenceManifest||[]).map(e=>`<tr><td><button class="record-link" data-evidence-id="${e.id}">${e.id}</button></td><td>${e.file}</td><td>${badge(e.state)}</td><td><code>${e.sha256}</code></td><td>${e.provenance}</td></tr>`).join('');
  return `<div style="height:16px"></div><section class="panel"><div class="section-head"><div><h3>Manifest de integridad v1.1</h3><p>Artefactos incluidos en este paquete y verificados mediante SHA-256 durante la compilación.</p></div>${badge('VERIFIED')}</div><div class="table-wrap"><table><thead><tr><th>ID</th><th>Archivo</th><th>Estado</th><th>SHA-256</th><th>Procedencia</th></tr></thead><tbody>${rows}</tbody></table></div><div class="manifest-actions"><button id="downloadManifest" class="ghost-btn">Descargar manifest JSON</button><span class="small-muted">Verificación local de integridad; no implica validación de datos territoriales externos.</span></div></section>`;
}

function downloadManifest(){
  const payload={version:'1.1', generatedAt:window.FIRECYCLE_DATA.generatedAt, evidenceManifest:window.FIRECYCLE_DATA.evidenceManifest, auditTrail:window.FIRECYCLE_DATA.auditTrail};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='FIRECYCLE_EVIDENCE_MANIFEST_v1.1.json'; a.click(); URL.revokeObjectURL(a.href);
}

function bindDetails(){
  document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.nav)));
  document.querySelectorAll('[data-detail]').forEach(card=>card.addEventListener('click',()=>{
    const d=JSON.parse(card.dataset.detail); openDetail(`${d.module}.${String(d.index+1).padStart(2,'0')}`, d.stage, 'DEFINED', 'Submódulo funcional demostrativo. Requiere datos y evidencia reales antes de elevar su estado de certeza.');
  }));
  document.querySelectorAll('[data-record]').forEach(b=>b.addEventListener('click',()=>openRecordDetail(b.dataset.record)));
  document.querySelectorAll('[data-evidence-id]').forEach(b=>b.addEventListener('click',()=>openEvidenceDetail(b.dataset.evidenceId)));
  const dm=document.getElementById('downloadManifest'); if(dm) dm.addEventListener('click',downloadManifest);
}


function openRecordDetail(id){
  const ev=(window.FIRECYCLE_DATA?.recordEvidence||{})[id];
  if(ev){
    openDetail(id,ev.title,ev.state,`${ev.note} | Evidence: ${ev.evidenceId} | Source: ${ev.source}`);
  } else {
    const state=id.startsWith('EVD-')?'VERIFIED':'DEFINED';
    openDetail(id,'Registro FIRECYCLE',state,state==='VERIFIED'?'Registro respaldado por el manifest local v1.1.':'El estado mostrado pertenece a esta interfaz y no sustituye evidencia operacional externa.');
  }
}
function openEvidenceDetail(id){
  const ev=(window.FIRECYCLE_DATA?.evidenceManifest||[]).find(x=>x.id===id);
  if(!ev) return;
  const dialog=document.getElementById('detailDialog');
  document.getElementById('dialogContent').innerHTML=`<span class="eyebrow">M02 / EVIDENCIA VERIFICADA LOCAL</span><h2>${ev.file}</h2>${badge(ev.state)}<div class="detail-kv"><div>ID</div><div>${ev.id}</div><div>SHA-256</div><div><code>${ev.sha256}</code></div><div>Procedencia</div><div>${ev.provenance}</div><div>Generado</div><div>${window.FIRECYCLE_DATA.generatedAt}</div><div>Alcance</div><div>Integridad del artefacto local incluido en v1.1. No valida por sí mismo datos GIS, satelitales o de campo.</div><div>Gate</div><div>GO para integridad del artefacto; HOLD para cualquier afirmación externa no respaldada por fuente.</div></div>`;
  dialog.showModal();
}

function openDetail(id,title,state,note){
  const dialog=document.getElementById('detailDialog');
  document.getElementById('dialogContent').innerHTML=`<span class="eyebrow">EVIDENCIA INDIVIDUAL / CONTINUIDAD</span><h2>${title}</h2>${badge(state)}<div class="detail-kv"><div>ID</div><div>${id}</div><div>Procedencia</div><div>FIRECYCLE_COMMAND_CENTER_FREE_v1.1 · demo local</div><div>Evidencia</div><div>${note}</div><div>KPI</div><div>NOT AVAILABLE — no se inventa un indicador sin fuente</div><div>Gate</div><div>HOLD cuando dependa de datos externos no conectados</div><div>Decisión</div><div>Reservada a usuario/autoridad humana con evidencia suficiente</div></div>`;
  dialog.showModal();
}

document.getElementById('truthLegendBtn').addEventListener('click',()=>document.getElementById('truthLegend').classList.toggle('hidden'));
document.getElementById('closeDialog').addEventListener('click',()=>document.getElementById('detailDialog').close());
document.getElementById('detailDialog').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
window.addEventListener('hashchange',()=>render(location.hash.slice(1)||'C1'));
renderNav(); render(location.hash.slice(1)||'C1');
