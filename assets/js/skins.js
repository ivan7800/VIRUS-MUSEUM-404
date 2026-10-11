/* VIRUS MUSEUM 404 - safe, local-only visual skin controller */
const museumSkins = new Set(['archive','matrix','amber','ice','noir']);
const eras = new Set(['classic','dos','xp','modern']);
function stored(key, valid, fallback) {
  try { const value = localStorage.getItem(key); return valid.has(value) ? value : fallback; }
  catch { return fallback; }
}
function save(key,value){try{localStorage.setItem(key,value);}catch{}}
export function initSkins(){
  const museum = document.getElementById('vmSkin');
  const era = document.getElementById('mosEra');
  const os = document.getElementById('museumOS');
  if(!museum || !era || !os)return;
  const applyMuseum = value => {
    const id=museumSkins.has(value)?value:'archive';
    document.documentElement.dataset.vmSkin=id;
    museum.value=id;
    save('vm404:skin',id);
  };
  const applyEra = value => {
    const id=eras.has(value)?value:'classic';
    os.classList.toggle('mos-modern',id==='modern');
    os.classList.toggle('mos-xp',id==='xp');
    os.classList.toggle('mos-dos',id==='dos');
    era.value=id;
    save('museumos-theme',id);
  };
  applyMuseum(stored('vm404:skin',museumSkins,'archive'));
  applyEra(stored('museumos-theme',eras,'classic'));
  const trigger=document.getElementById('openSkinPanel');
  const panel=document.getElementById('skinPanel');
  const setOpen=open=>{
    panel.classList.toggle('skin-open',open);
    trigger?.setAttribute('aria-expanded',String(open));
  };
  trigger?.addEventListener('click',()=>{
    setOpen(!panel.classList.contains('skin-open'));
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
  document.addEventListener('pointerdown',e=>{
    if(panel.classList.contains('skin-open')&&!panel.contains(e.target)&&!trigger?.contains(e.target))setOpen(false);
  });
  museum.addEventListener('change',()=>{applyMuseum(museum.value);setOpen(false);});
  era.addEventListener('change',()=>applyEra(era.value));
  // Keep exterior selector in sync when changing a skin inside MuseumOS settings.
  os.addEventListener('click',()=>queueMicrotask(()=>{
    const current=stored('museumos-theme',eras,'classic');
    if(era.value!==current){applyEra(current);era.dispatchEvent(new Event('change',{bubbles:true}));}
  }));
}
