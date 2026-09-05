(function(){
  if(!window.FIRECYCLE_DATA || !window.FIRECYCLE_DATA.c3) return;
  const baseRender = render;

  function renderC3(){
    const c3 = FIRECYCLE_DATA.c3;
    return `<div class="section-head"><div><span class="eyebrow">C3 · TERRITORY / M01</span><h2>Baseline territorial verificable</h2><p>Territorio, parcelas, rodales, capas y GIS avanzan sólo cuando cada afirmación puede vincularse a fuente, geometría y evidencia M02.</p></div>${badge(c3.gateState)}</div>
    <section class="panel c2-gate"><div><strong>Gate operacional M01</strong><p>${c3.gateReason}</p></div>${badge(c3.gateState)}</section>
    <div style="height:16px"></div>
    <section class="panel"><h3>Continuidad M01</h3><p class="panel-sub">Página → Subpágina → Módulo → Submódulo → Registro → Evidencia → KPI → Gate → Decisión.</p><div class="flow-strip">${c3.sections.map((s,i)=>`${i?'<span class="flow-arrow">→</span>':''}<button class="flow-node c3-tab" data-c3="${s.id}">${s.label}</button>`).join('')}</div></section>
    <div style="height:16px"></div>
    <div class="module-grid">${c3.sections.map(s=>`<article class="module-card c3-card" data-c3="${s.id}"><span class="module-code">${s.code}</span><h3>${s.label}</h3><p>${s.description}</p><div class="module-meta"><span>${s.records.length} registro(s)</span>${badge(s.state)}</div></article>`).join('')}</div>
    <div style="height:16px"></div>
    <section id="c3Detail" class="panel">${renderC3Section(c3.sections[0])}</section>
    <div style="height:16px"></div>
    <section class="panel"><h3>Contrato de baseline territorial</h3><p class="panel-sub">El baseline sólo podrá pasar de HOLD a VERIFIED cuando esta cadena sea reproducible.</p><div class="chain">${c3.baselineContract.map((x,i)=>`${i?'<b>→</b>':''}<span>${x}</span>`).join('')}</div></section>
    <div style="height:16px"></div>
    <section class="panel"><h3>Regla de elevación de estado</h3><p class="panel-sub">DEFINED describe arquitectura; HOLD bloquea afirmaciones operacionales; VERIFIED exige evidencia incorporada y comprobable.</p><div class="gate-list"><div class="gate-row"><span>Polígono territorial definitivo</span>${badge('HOLD')}</div><div class="gate-row"><span>Parcelario mínimo verificable</span>${badge('HOLD')}</div><div class="gate-row"><span>Capas críticas con procedencia</span>${badge('HOLD')}</div><div class="gate-row"><span>Vínculo M01 → M02</span>${badge('DEFINED')}</div></div></section>`;
  }

  function renderC3Section(s){
    return `<div class="section-head"><div><span class="eyebrow">${s.code}</span><h3>${s.label}</h3><p>${s.description}</p></div>${badge(s.state)}</div>${recordsTable(s.records.map(r=>[r.id,r.name,r.state,r.source,`${r.evidence} · KPI: ${r.kpi} · Gate: ${r.gate}`]))}`;
  }

  function bindC3(){
    document.querySelectorAll('[data-c3]').forEach(el=>el.addEventListener('click',()=>{
      const section=FIRECYCLE_DATA.c3.sections.find(s=>s.id===el.dataset.c3);
      const target=document.getElementById('c3Detail');
      if(section && target){ target.innerHTML=renderC3Section(section); bindDetails(); target.scrollIntoView({behavior:'smooth',block:'start'}); }
    }));
  }

  render = function(c){
    if(c==='C3'){
      setHeader('C3');
      content.innerHTML=renderC3();
      bindDetails();
      bindC3();
      return;
    }
    baseRender(c);
  };

  if((location.hash.slice(1)||'C1')==='C3') render('C3');
})();