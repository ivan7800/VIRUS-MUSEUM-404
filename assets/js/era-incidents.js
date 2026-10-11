/* Living History 3.3 — visual-only incident theatre, deterministic scripted scenes. */
export const incidentScenes=Object.freeze({
 dos:{title:'1988 · BOOT ALERT',steps:['A:\\> DIR — inspección del disquete ficticio','Aviso: sector de arranque virtual alterado','Caracteres de la pantalla caen (efecto ilustrativo)','Respuesta: retirar el medio y arrancar desde soporte fiable']},
 classic:{title:'1999 · MACRO WARNING',steps:['Nuevo mensaje: DOCUMENTO URGENTE','Adjunto .DOC simulado detectado','Aviso de macros: procedencia no verificada','Respuesta: mantener macros deshabilitadas y verificar remitente']},
 xp:{title:'2003 · NETWORK INCIDENT',steps:['Visor de sucesos: reinicio inesperado','Conexión LAN: tráfico anómalo ilustrativo','Equipo XP ficticio: parche crítico pendiente','Respuesta: aislar estación y aplicar actualización fiable']},
 modern:{title:'2017 · RANSOMWARE EXERCISE',steps:['Sensor: actividad anómala en LAB-07','Archivos ficticios: estado bloqueado','Alerta del segmento: actividad contenida','Respuesta: aislamiento y restauración desde copia verificada']}
});
export function initEraIncidents(){
 const os=document.getElementById('museumOS'),work=document.getElementById('mosWork'),era=document.getElementById('mosEra');
 if(!os||!work||!era)return;
 const panel=document.createElement('section');
 panel.className='era-incident-console';panel.setAttribute('aria-label','Recreación de incidente histórico');
 const heading=document.createElement('strong'),display=document.createElement('div'),status=document.createElement('span');
 display.className='era-incident-screen';status.className='era-incident-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const controls=document.createElement('div');controls.className='era-incident-controls';
 const mk=(label,callback)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',callback);controls.append(b);return b};
 let index=0,running=false,timer=null;
 const get=()=>incidentScenes[era.value]||incidentScenes.classic;
 const stop=()=>{if(timer!==null){clearInterval(timer);timer=null;}running=false;};
 const update=()=>{
   const scene=get();heading.textContent='◈ SIMULACIÓN AISLADA · '+scene.title;
   display.textContent=scene.steps[index]||'Ejercicio completado.';
   display.dataset.step=String(index);display.dataset.period=era.value;
   status.textContent='EVENTO '+(index+1)+' / '+scene.steps.length+(running?' · REPRODUCIENDO':' · EN PAUSA');
   play.disabled=running||index>=scene.steps.length-1;
   pause.disabled=!running;next.disabled=running||index>=scene.steps.length-1;
 };
 const advance=()=>{if(index<get().steps.length-1){index++;document.dispatchEvent(new CustomEvent('vm404:era-event',{detail:{type:'step',era:era.value,index}}));update();}else{stop();update();}};
 const play=mk('▶ Reproducir',()=>{if(running||index>=get().steps.length-1)return;running=true;update();timer=setInterval(()=>{advance();if(index>=get().steps.length-1){stop();update();}},1900);});
 const pause=mk('Ⅱ Pausar',()=>{stop();update();});
 const next=mk('→ Paso siguiente',advance);
 mk('↺ Reiniciar',()=>{stop();index=0;update();});
 panel.append(heading,display,status,controls);
 const drawer=work.querySelector('#eraMonitorDrawer'),toggle=work.querySelector('#eraPanelToggle');
 if(drawer)drawer.append(panel);else work.prepend(panel);
 if(drawer&&toggle){
   toggle.addEventListener('click',()=>{
     drawer.hidden=!drawer.hidden;
     toggle.setAttribute('aria-expanded',String(!drawer.hidden));
   });
 }
 era.addEventListener('change',()=>{stop();index=0;update();});
 document.addEventListener('vm404:era-event',event=>{
   if(event.detail?.type==='reset'&&event.detail.era===era.value){stop();index=0;update();}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();update();}});
 update();
}
