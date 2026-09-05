(()=>{
const AOI={west:-6.70,south:40.05,east:-5.95,north:40.60,label:'AOI de descubrimiento Las Hurdes / Pinofranqueado'};
const START='2026-08-18';
const DAYS=4;
const SOURCES=['VIIRS_NOAA20_NRT','VIIRS_NOAA21_NRT','VIIRS_SNPP_NRT','MODIS_NRT'];
let records=[],layerGroup=null,mapRef=null,currentDay='2026-08-18';
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function parseCSV(text,source='CSV'){
 const lines=text.trim().split(/\r?\n/); if(lines.length<2)return [];
 const headers=lines[0].split(',').map(x=>x.trim().replace(/^"|"$/g,''));
 return lines.slice(1).filter(Boolean).map(line=>{
   const cols=[];let cur='',q=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){q=!q;continue}if(c===','&&!q){cols.push(cur);cur=''}else cur+=c}cols.push(cur);
   const o={};headers.forEach((h,i)=>o[h]=cols[i]);o._source=source;
   o.latitude=Number(o.latitude);o.longitude=Number(o.longitude);o.frp=Number(o.frp);
   o.acq_time=String(o.acq_time||'').padStart(4,'0');
   o.utc=`${o.acq_date||''}T${o.acq_time.slice(0,2)}:${o.acq_time.slice(2,4)}:00Z`;
   return o;
 }).filter(o=>Number.isFinite(o.latitude)&&Number.isFinite(o.longitude));
}
function dedupe(arr){const m=new Map();arr.forEach(r=>{const k=[r.latitude.toFixed(5),r.longitude.toFixed(5),r.acq_date,r.acq_time,r.satellite,r.instrument].join('|');if(!m.has(k))m.set(k,r)});return [...m.values()].sort((a,b)=>a.utc.localeCompare(b.utc));}
function panel(){return `<section id="firmsHotspotPanel" class="panel" style="margin-top:16px"><div class="section-head"><div><span class="eyebrow">M00-SAT · NASA FIRMS HISTÓRICO</span><h3>Hotspots individuales · cronología horaria</h3><p>Ingesta de detecciones reales FIRMS con latitud, longitud, UTC, sensor, confidence y FRP. La MAP_KEY se usa solo en memoria del navegador y no se guarda en GitHub ni en localStorage.</p></div>${typeof badge==='function'?badge('HOLD'):''}</div><div class="visual-note"><strong>AOI de consulta:</strong> ${AOI.west}, ${AOI.south}, ${AOI.east}, ${AOI.north} · ${AOI.label}. Es un bbox de descubrimiento, no el perímetro oficial del incendio.</div><div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin:12px 0"><input id="firmsKey" type="password" autocomplete="off" placeholder="NASA FIRMS MAP_KEY (solo esta sesión)" style="padding:10px;border-radius:8px;border:1px solid var(--line);background:#07110d;color:#fff"><button id="firmsFetch" class="ghost-btn">Cargar 18–21 AGO desde FIRMS</button></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px"><label class="ghost-btn" style="cursor:pointer">Importar CSV FIRMS<input id="firmsFile" type="file" accept=".csv,text/csv" style="display:none"></label><span id="firmsStatus" class="panel-sub">Sin hotspots cargados.</span></div><div id="firmsHourly"></div><div id="firmsTable"></div></section>`}
function confidenceLabel(r){const c=String(r.confidence||'').toLowerCase();if(['h','high'].includes(c))return 'HIGH';if(['n','nominal'].includes(c))return 'NOMINAL';if(['l','low'].includes(c))return 'LOW';const n=Number(c);return Number.isFinite(n)?`${n}%`:String(r.confidence||'N/A')}
function markerRadius(r){const f=Number(r.frp);return Math.max(4,Math.min(13,Number.isFinite(f)?4+Math.sqrt(Math.max(0,f)):5))}
function refreshMap(){
 const timeline=window.FIRECYCLE_FIRE_TIMELINE; if(!timeline)return;
 const el=document.getElementById('fireTimelineMap'); if(!el||!window.L)return;
 // Locate Leaflet map instance created by fire-timeline-viewer.js through DOM internals is unsafe; create a synchronized mini-map instead.
 let mini=document.getElementById('firmsMiniMap');
 if(!mini){const host=document.getElementById('firmsHourly');if(!host)return;host.insertAdjacentHTML('afterend','<div id="firmsMiniMap" style="height:460px;border:1px solid var(--line);border-radius:12px;margin:12px 0"></div>');mini=document.getElementById('firmsMiniMap');mapRef=L.map(mini).setView([40.325,-6.35],10);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(mapRef);layerGroup=L.layerGroup().addTo(mapRef)}
 if(!layerGroup)return;layerGroup.clearLayers();
 const dayRecords=records.filter(r=>r.acq_date===currentDay);
 dayRecords.forEach(r=>{const m=L.circleMarker([r.latitude,r.longitude],{radius:markerRadius(r),weight:1,fillOpacity:.72});m.bindPopup(`<strong>${esc(r.utc)}</strong><br>${esc(r.satellite)} · ${esc(r.instrument)}<br>Confidence: ${esc(confidenceLabel(r))}<br>FRP: ${Number.isFinite(r.frp)?esc(r.frp)+' MW':'N/A'}<br>${esc(r.latitude.toFixed(5))}, ${esc(r.longitude.toFixed(5))}`);m.addTo(layerGroup)});
 if(dayRecords.length){const g=L.latLngBounds(dayRecords.map(r=>[r.latitude,r.longitude]));mapRef.fitBounds(g.pad(.15),{maxZoom:13})}
}
function render(){
 const st=document.getElementById('firmsStatus');if(st)st.textContent=records.length?`${records.length} hotspots reales cargados · ${new Set(records.map(r=>r.acq_date)).size} días · ${new Set(records.map(r=>r.satellite)).size} satélites`:'Sin hotspots cargados.';
 const hourly=document.getElementById('firmsHourly');if(hourly){const hours=[...new Set(records.map(r=>r.utc.slice(0,13)+':00Z'))];hourly.innerHTML=records.length?`<div class="ftv-controls">${['2026-08-18','2026-08-19','2026-08-20','2026-08-21'].map(d=>`<button class="ftv-date${d===currentDay?' active':''}" data-firms-day="${d}">${d.slice(8,10)} AGO · ${records.filter(r=>r.acq_date===d).length}</button>`).join('')}</div><div class="panel-sub">Ventanas horarias observadas: ${hours.length}. Cada punto conserva timestamp UTC; no se interpola un frente entre detecciones.</div>`:'';}
 const t=document.getElementById('firmsTable');if(t){const rows=records.filter(r=>r.acq_date===currentDay);t.innerHTML=rows.length?`<div class="table-wrap"><table><thead><tr><th>UTC</th><th>Lat</th><th>Lon</th><th>Satélite</th><th>Sensor</th><th>Confidence</th><th>FRP MW</th><th>Estado</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.utc)}</td><td>${esc(r.latitude.toFixed(5))}</td><td>${esc(r.longitude.toFixed(5))}</td><td>${esc(r.satellite)}</td><td>${esc(r.instrument)}</td><td>${esc(confidenceLabel(r))}</td><td>${Number.isFinite(r.frp)?esc(r.frp.toFixed(2)):'N/A'}</td><td>${typeof badge==='function'?badge('OBSERVED'):'OBSERVED'}</td></tr>`).join('')}</tbody></table></div>`:'';}
 document.querySelectorAll('[data-firms-day]').forEach(b=>b.onclick=()=>{currentDay=b.dataset.firmsDay;render();refreshMap()});
 refreshMap();
}
async function fetchSource(key,source){const area=[AOI.west,AOI.south,AOI.east,AOI.north].join(',');const url=`https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(key)}/${source}/${area}/${DAYS}/${START}`;const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${source}: HTTP ${r.status}`);return parseCSV(await r.text(),source)}
async function fetchAll(){const key=document.getElementById('firmsKey')?.value.trim();const st=document.getElementById('firmsStatus');if(!key){if(st)st.textContent='Introduzca una MAP_KEY FIRMS para esta sesión o importe un CSV histórico.';return}if(st)st.textContent='Consultando NASA FIRMS…';const out=[],errs=[];for(const s of SOURCES){try{out.push(...await fetchSource(key,s))}catch(e){errs.push(e.message)}}records=dedupe(out);if(st&&errs.length)st.textContent=`${records.length} detecciones cargadas. Avisos: ${errs.join(' · ')}`;render()}
function bind(){document.getElementById('firmsFetch')?.addEventListener('click',fetchAll);document.getElementById('firmsFile')?.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;records=dedupe(parseCSV(await f.text(),f.name));render()})}
function mount(){const c=(location.hash||'#C1').slice(1).toUpperCase();if(!['C2','C3'].includes(c))return;const host=document.getElementById('content');if(!host||document.getElementById('firmsHotspotPanel'))return;host.insertAdjacentHTML('beforeend',panel());bind();render()}
const mo=new MutationObserver(()=>setTimeout(mount,0));mo.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('hashchange',()=>setTimeout(mount,30));window.addEventListener('load',()=>setTimeout(mount,50));setTimeout(mount,50);window.FIRECYCLE_FIRMS={get records(){return records},AOI,START,DAYS};
})();