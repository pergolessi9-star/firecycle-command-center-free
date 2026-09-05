(()=>{
const WMS='https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi';
// Centro del AOI de descubrimiento actual de FIRECYCLE. NO es una coordenada oficial del incendio ni de DEMO-100HA-01.
const DISCOVERY_CENTER=[40.325,-6.35];
const DISCOVERY_ZOOM=10;
const BASES={
  'NOAA-20 VIIRS True Color':'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
  'Terra MODIS True Color':'MODIS_Terra_CorrectedReflectance_TrueColor'
};
const OVERLAYS={
  'NOAA-20 VIIRS Thermal Anomalies':'VIIRS_NOAA20_Thermal_Anomalies_375m_All'
};
function mount(el){
  if(!el||el.dataset.eoMounted==='1'||!window.L)return;
  el.dataset.eoMounted='1';
  const date=el.dataset.eoDate;
  const map=L.map(el,{zoomControl:true,attributionControl:true}).setView(DISCOVERY_CENTER,DISCOVERY_ZOOM);
  const baseLayers={};
  Object.entries(BASES).forEach(([label,layer])=>{
    baseLayers[label]=L.tileLayer.wms(WMS,{layers:layer,format:'image/jpeg',transparent:false,time:date,version:'1.3.0',crs:L.CRS.EPSG3857,attribution:'NASA EOSDIS GIBS'});
  });
  const overlayLayers={};
  Object.entries(OVERLAYS).forEach(([label,layer])=>{
    overlayLayers[label]=L.tileLayer.wms(WMS,{layers:layer,format:'image/png',transparent:true,time:date,version:'1.3.0',crs:L.CRS.EPSG3857,opacity:.86,attribution:'NASA LANCE / FIRMS via GIBS'});
  });
  baseLayers['NOAA-20 VIIRS True Color'].addTo(map);
  overlayLayers['NOAA-20 VIIRS Thermal Anomalies'].addTo(map);
  L.control.layers(baseLayers,overlayLayers,{collapsed:true}).addTo(map);
  const note=L.control({position:'bottomleft'});
  note.onAdd=()=>{const d=L.DomUtil.create('div','eo-map-note');d.innerHTML=`<strong>${date}</strong><br>AOI discovery · no perímetro oficial`;return d;};
  note.addTo(map);
  setTimeout(()=>map.invalidateSize(),80);
}
function mountAll(){document.querySelectorAll('[data-eo-date]').forEach(mount);}
const observer=new MutationObserver(()=>setTimeout(mountAll,0));
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',()=>setTimeout(mountAll,30));
window.addEventListener('load',()=>setTimeout(mountAll,50));
setTimeout(mountAll,50);
window.FIRECYCLE_REAL_EO={wms:WMS,center:DISCOVERY_CENTER,zoom:DISCOVERY_ZOOM,mountAll};
})();