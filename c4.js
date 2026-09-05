(function(){
  if(!window.FIRECYCLE_DATA || !window.FIRECYCLE_DATA.c4) return;
  const baseRender=render;

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function renderC4(){
    const c4=FIRECYCLE_DATA.c4;
    return `<div class="section-head"><div><span class="eyebrow">C4 · EVIDENCE ENGINE / M02</span><h2>Registro probatorio transversal</h2><p>${esc(c4.statement)}</p></div>${badge(c4.engineState)}</div>
    <div class="metrics">
      <div class="metric"><div class="label">Evidence IDs registrados</div><div class="value">${c4.stats.total}</div><div class="note">C2 + C3</div></div>
      <div class="metric"><div class="label">Origen C2</div><div class="value">${c4.stats.c2}</div><div class="note">FIREWATCH / M00-SAT</div></div>
      <div class="metric"><div class="label">Origen C3</div><div class="value">${c4.stats.c3}</div><div class="note">Territory / M01</div></div>
      <div class="metric"><div class="label">Engine local</div><div class="value">VERIFIED</div><div class="note">La verificación del motor no valida datos externos.</div></div>
    </div>
    <section class="panel"><h3>Continuidad M02</h3><p class="panel-sub">Cada claim recibido conserva su estado de origen y obtiene un identificador probatorio estable.</p><div class="flow-strip">${c4.sections.map((s,i)=>`${i?'<span class="flow-arrow">→</span>':''}<button class="flow-node c4-tab" data-c4="${s.id}">${s.label}</button>`).join('')}</div></section>
    <div style="height:16px"></div>
    <div class="module-grid">${c4.sections.map(s=>`<article class="module-card c4-card" data-c4="${s.id}"><span class="module-code">${s.code}</span><h3>${s.label}</h3><p>${s.description}</p><div class="module-meta"><span>M02</span>${badge(s.state)}</div></article>`).join('')}</div>
    <div style="height:16px"></div>
    <section id="c4Detail" class="panel">${renderRegistry('ALL')}</section>
    <div style="height:16px"></div>
    <section class="panel"><h3>Contrato de evidencia transversal</h3><p class="panel-sub">Un evidence_id registra trazabilidad; no convierte una hipótesis, ausencia de dato o HOLD en VERIFIED.</p><div class="chain">${c4.evidenceContract.map((x,i)=>`${i?'<b>→</b>':''}<span>${x}</span>`).join('')}</div></section>
    <div style="height:16px"></div>
    <section class="panel"><h3>Reglas de verdad</h3><div class="gate-list">
      <div class="gate-row"><span>Registro M02 y evidence_id asignado</span>${badge('VERIFIED')}</div>
      <div class="gate-row"><span>Artefacto externo incorporado</span>${badge('HOLD')}</div>
      <div class="gate-row"><span>Checksum externo reproducible</span>${badge('HOLD')}</div>
      <div class="gate-row"><span>Dato C2/C3 elevado automáticamente</span>${badge('NOT AVAILABLE')}</div>
    </div></section>`;
  }

  function renderRegistry(filter){
    const c4=FIRECYCLE_DATA.c4;
    let rows=c4.registry;
    if(filter==='C2'||filter==='C3') rows=rows.filter(r=>r.sourceModule===filter);
    if(filter==='HOLD') rows=rows.filter(r=>r.evidenceState==='HOLD');
    return `<div class="section-head"><div><span class="eyebrow">M02.03 · EVIDENCE RECORDS</span><h3>Registro de evidence_id</h3><p>${rows.length} registro(s) visibles.</p></div>${badge('VERIFIED')}</div>
    <div class="flow-strip"><button class="flow-node c4-filter" data-filter="ALL">Todos</button><button class="flow-node c4-filter" data-filter="C2">C2</button><button class="flow-node c4-filter" data-filter="C3">C3</button><button class="flow-node c4-filter" data-filter="HOLD">HOLD</button></div>
    <div class="table-wrap"><table><thead><tr><th>Evidence ID</th><th>Registro fuente</th><th>Módulo</th><th>Estado fuente</th><th>Estado evidencia</th><th>Procedencia</th><th>Integridad</th></tr></thead><tbody>${rows.map(r=>`<tr><td><button class="record-link" data-c4-evidence="${esc(r.evidenceId)}">${esc(r.evidenceId)}</button></td><td>${esc(r.sourceRecordId)} · ${esc(r.title)}</td><td>${esc(r.sourceModule)} / ${esc(r.sourceSection)}</td><td>${badge(r.truthState)}</td><td>${badge(r.evidenceState)}</td><td>${esc(r.source)}</td><td>${esc(r.checksum)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderSection(id){
    const c4=FIRECYCLE_DATA.c4;
    const s=c4.sections.find(x=>x.id===id);
    if(!s) return renderRegistry('ALL');
    if(id==='records'||id==='intake'||id==='provenance') return renderRegistry('ALL');
    if(id==='integrity'){
      return `<div class="section-head"><div><span class="eyebrow">${s.code}</span><h3>${s.label}</h3><p>${s.description}</p></div>${badge(s.state)}</div>${renderEvidenceManifest()}`;
    }
    if(id==='audit'){
      const rows=(FIRECYCLE_DATA.auditTrail||[]).map(a=>[a.id,a.event,a.state,'M02 audit','Registro local de evolución']);
      return `<div class="section-head"><div><span class="eyebrow">${s.code}</span><h3>${s.label}</h3><p>${s.description}</p></div>${badge(s.state)}</div>${recordsTable(rows)}`;
    }
    return `<div class="section-head"><div><span class="eyebrow">${s.code}</span><h3>${s.label}</h3><p>${s.description}</p></div>${badge(s.state)}</div><div class="gate-list"><div class="gate-row"><span>Evidence ID existente</span>${badge('VERIFIED')}</div><div class="gate-row"><span>Artefacto fuente incorporado</span>${badge('HOLD')}</div><div class="gate-row"><span>Checksum reproducible</span>${badge('HOLD')}</div><div class="gate-row"><span>Elevación de truth_state</span>${badge('HOLD')}</div></div>`;
  }

  function bindC4(){
    document.querySelectorAll('[data-c4]').forEach(el=>el.addEventListener('click',()=>{
      const target=document.getElementById('c4Detail');
      if(target){target.innerHTML=renderSection(el.dataset.c4);bindC4();bindDetails();target.scrollIntoView({behavior:'smooth',block:'start'});}
    }));
    document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{
      const target=document.getElementById('c4Detail');
      if(target){target.innerHTML=renderRegistry(el.dataset.filter);bindC4();bindDetails();}
    }));
    document.querySelectorAll('[data-c4-evidence]').forEach(el=>el.addEventListener('click',()=>openC4Evidence(el.dataset.c4Evidence)));
  }

  function openC4Evidence(id){
    const r=FIRECYCLE_DATA.c4.registry.find(x=>x.evidenceId===id); if(!r)return;
    const dialog=document.getElementById('detailDialog');
    document.getElementById('dialogContent').innerHTML=`<span class="eyebrow">M02 / EVIDENCE RECORD</span><h2>${esc(r.evidenceId)}</h2>${badge(r.evidenceState)}<div class="detail-kv"><div>Registro fuente</div><div>${esc(r.sourceRecordId)} · ${esc(r.title)}</div><div>Módulo / sección</div><div>${esc(r.sourceModule)} / ${esc(r.sourceSection)}</div><div>Truth state origen</div><div>${badge(r.truthState)}</div><div>Procedencia</div><div>${esc(r.source)}</div><div>Claim / evidencia declarada</div><div>${esc(r.claim)}</div><div>Artefacto</div><div>${esc(r.artifact)}</div><div>Checksum</div><div>${esc(r.checksum)}</div><div>KPI</div><div>${esc(r.kpi)}</div><div>Gate</div><div>${esc(r.gate)}</div><div>Regla M02</div><div>${esc(r.verificationNote)}</div></div>`;
    dialog.showModal();
  }

  render=function(c){
    if(c==='C4'){
      setHeader('C4');
      content.innerHTML=renderC4();
      bindDetails();
      bindC4();
      return;
    }
    baseRender(c);
  };

  if((location.hash.slice(1)||'C1')==='C4') render('C4');
})();