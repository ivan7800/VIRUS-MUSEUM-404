/* Living History 3.4: fictional state only. No system, file, or network APIs. */
export const initialEraState=()=>({phase:'idle',files:'Íntegros',network:'Supervisada',alerts:'Ninguna',recovery:'Disponible',history:[]});
export function reduceEraState(state,event){
 const s={...state,history:[...state.history].slice(-11)};
 if(event.type==='reset')return initialEraState();
 if(event.type==='step'){
  s.phase='Simulación en curso';
  if(event.index>=1){s.alerts='Anomalía virtual detectada';}
  if(event.index>=2){s.files=event.era==='modern'?'Archivos ficticios bloqueados':'Revisión recomendada';s.network=event.era==='dos'?'Sin conexión (1988)':'Tráfico bajo observación';}
  s.history.push('Escena '+(event.index+1)+' · '+event.era);
 }
 if(event.type==='decision'){
  s.phase=event.correct?'Contenida':'Requiere revisión';
  s.alerts=event.correct?'Controlada':'Pendiente';
  s.files=event.correct?'Protegidos':'Posible afectación ficticia';
  s.network=event.correct?'Aislada de forma segura':'Exposición simulada';
  s.recovery=event.correct?'Restauración preparada':'Pendiente de decisión';
  s.history.push((event.correct?'Respuesta defensiva acertada':'Decisión de riesgo')+' · '+event.era);
 }
 return s;
}
export function initEraState(){
 const era=document.getElementById('mosEra'),work=document.getElementById('mosWork');
 if(!era||!work)return;
 const stateByEra=new Map();
 const wrapper=document.createElement('section');wrapper.className='era-state-panel';wrapper.setAttribute('aria-label','Estado del equipo ficticio');
 const heading=document.createElement('strong');heading.textContent='ESTADO VIRTUAL DEL INCIDENTE';
 const entries=document.createElement('dl'),log=document.createElement('p'),reset=document.createElement('button');
 log.className='era-state-log';log.setAttribute('role','status');log.setAttribute('aria-live','polite');
 reset.type='button';reset.textContent='↺ Restaurar escenario virtual';
 wrapper.append(heading,entries,log,reset);
 const drawer=work.querySelector('#eraMonitorDrawer'),console=work.querySelector('.era-incident-console');
 if(console)console.insertAdjacentElement('afterend',wrapper);
 else if(drawer)drawer.append(wrapper);
 else work.prepend(wrapper);
 const state=()=>stateByEra.get(era.value)||initialEraState();
 function render(){
  const s=state();entries.replaceChildren();
  for(const [label,key] of [['FASE','phase'],['ARCHIVOS','files'],['RED','network'],['ALERTAS','alerts'],['RECUPERACIÓN','recovery']]){
   const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=s[key];entries.append(dt,dd);
  }
  log.textContent=s.history.at(-1)||'Escenario limpio · sin cambios en el equipo real';
 }
 document.addEventListener('vm404:era-event',e=>{
  const d=e.detail||{};if(d.era!==era.value||!['step','decision','reset'].includes(d.type))return;
  stateByEra.set(d.era,reduceEraState(state(),d));render();
 });
 era.addEventListener('change',()=>{
   stateByEra.set(era.value,initialEraState());
   render();
   document.dispatchEvent(new CustomEvent('vm404:era-event',{detail:{type:'reset',era:era.value}}));
 });
 reset.addEventListener('click',()=>{document.dispatchEvent(new CustomEvent('vm404:era-event',{detail:{type:'reset',era:era.value}}));});
 render();
}
