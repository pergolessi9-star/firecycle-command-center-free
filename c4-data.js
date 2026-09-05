(function(){
  if(!window.FIRECYCLE_DATA) return;

  const registry=[];
  const links={};
  let seq=1;
  const pad=n=>String(n).padStart(3,'0');

  function ingest(moduleCode, moduleName, sections){
    (sections||[]).forEach(section=>{
      (section.records||[]).forEach(record=>{
        const evidenceId=`EVD-${moduleCode}-${pad(seq++)}`;
        record.evidenceId=evidenceId;
        links[record.id]=evidenceId;
        registry.push({
          evidenceId,
          sourceModule:moduleCode,
          sourceModuleName:moduleName,
          sourceSection:section.code,
          sourceRecordId:record.id,
          title:record.name,
          truthState:record.state,
          evidenceState:record.state==='VERIFIED'?'VERIFIED':(record.state==='NOT AVAILABLE'?'HOLD':record.state),
          source:record.source,
          claim:record.evidence,
          kpi:record.kpi,
          gate:record.gate,
          artifact:'NOT AVAILABLE',
          checksum:'NOT AVAILABLE',
          observedAt:'NOT AVAILABLE',
          geometryRef:moduleCode==='C3'?'PENDING / M01':'N/A',
          verificationNote: record.state==='VERIFIED'
            ? 'Registro fuente marcado VERIFIED; requiere conservar artefacto y checksum para verificación reproducible.'
            : 'Evidence ID registrado por M02. No eleva el estado de verdad del dato fuente.'
        });
      });
    });
  }

  ingest('C2','FIREWATCH / M00-SAT',window.FIRECYCLE_DATA.c2?.sections);
  ingest('C3','Territory / M01',window.FIRECYCLE_DATA.c3?.sections);

  window.FIRECYCLE_DATA.c4={
    version:'1.4-c4',
    engineState:'VERIFIED',
    intakeState:'DEFINED',
    statement:'M02 verifica el funcionamiento local del registro y la trazabilidad interna. Los datos externos conservan el estado de verdad de su módulo de origen.',
    evidenceContract:['SOURCE RECORD','EVIDENCE ID','PROVENANCE','ARTIFACT','CHECKSUM','TRUTH STATE','KPI','GATE','DECISION'],
    sections:[
      {id:'intake',label:'Ingesta',code:'M02.01',state:'DEFINED',description:'Recepción formal de registros C2 y C3 y asignación estable de evidence_id.'},
      {id:'provenance',label:'Procedencia',code:'M02.02',state:'DEFINED',description:'Vínculo entre módulo, sección, registro fuente, origen declarado y claim.'},
      {id:'records',label:'Evidence records',code:'M02.03',state:'VERIFIED',description:'Registro local normalizado de evidencias y estados de verdad.'},
      {id:'integrity',label:'Integridad',code:'M02.04',state:'VERIFIED',description:'Manifest local de artefactos FIRECYCLE y espacio reservado para checksum de evidencia externa.'},
      {id:'verification',label:'Verificación',code:'M02.05',state:'DEFINED',description:'Reglas para impedir que un evidence_id eleve por sí solo una afirmación no verificada.'},
      {id:'audit',label:'Audit trail',code:'M02.06',state:'VERIFIED',description:'Trazabilidad local de eventos de arquitectura, gates y evolución de módulos.'}
    ],
    registry,
    links,
    stats:{
      total:registry.length,
      c2:registry.filter(x=>x.sourceModule==='C2').length,
      c3:registry.filter(x=>x.sourceModule==='C3').length,
      verified:registry.filter(x=>x.evidenceState==='VERIFIED').length,
      hold:registry.filter(x=>x.evidenceState==='HOLD').length
    }
  };

  window.FIRECYCLE_DATA.auditTrail.push({id:'AUD-008',event:`M02 cross-module registry created with ${registry.length} evidence_id links from C2/C3`,state:'VERIFIED'});
})();