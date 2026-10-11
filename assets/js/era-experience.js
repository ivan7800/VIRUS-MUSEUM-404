/* MuseumOS Time Machine. Fictional history-led incident investigations, no malware execution. */
export const eraCases=Object.freeze({
 dos:{year:'1988',title:'DOS · EL DISQUETE DESCONOCIDO',incident:'Brain / Cascade',intro:'Un disquete de procedencia incierta aparece en el laboratorio. Investiga el arranque de un PC de los ochenta.',files:[['A:> DIR','COMMAND.COM   25307 bytes\nAUTOEXEC.BAT  128 bytes\nREADME.TXT   512 bytes'],['A:> TYPE README.TXT','Disquete de intercambio. Procedencia: no documentada.'],['C:> BOOT STATUS','Sector de arranque virtual: modificación sospechosa.\nFirma didáctica: alerta BOOT-86']],choices:[['Arrancar desde un soporte fiable y aislar el disquete',true,'Has protegido el arranque y preservado el soporte para su análisis.'],['Ejecutar todos los programas del disquete',false,'Ejecutar archivos desconocidos dificulta el análisis. El incidente queda contenido en la maqueta.'],['Ignorar los avisos de arranque',false,'La alerta seguiría sin investigarse; es necesario identificar el soporte.']]},
 classic:{year:'1999',title:'WINDOWS 98 · CORREO SOSPECHOSO',incident:'Melissa / CIH',intro:'Una oficina de los noventa recibe un documento no solicitado. Busca indicios antes de abrirlo.',files:[['BANDEJA DE ENTRADA','Asunto: Documento urgente\nRemitente: contacto externo\nAdjunto: INFORME.DOC'],['EXPLORADOR C:\\DOCUMENTOS','INFORME.DOC   Fecha inesperada\nCOPIA.BAK   Copia limpia'],['CENTRO DE SEGURIDAD','Las macros del documento no han sido verificadas.\nEl sistema requiere comprobaciones.']],choices:[['No habilitar macros y verificar el origen del adjunto',true,'Decisión segura: se evita activar contenido no confiable.'],['Habilitar todas las macros para ver el archivo',false,'Una macro desconocida supone un riesgo. La maqueta no ejecuta ninguna.'],['Reenviar el documento a toda la oficina',false,'Se incrementaría la exposición de otros usuarios.']]},
 xp:{year:'2003',title:'WINDOWS XP · ALERTA DE RED',incident:'Blaster / Sasser',intro:'Un equipo XP de un cibercafé comienza a reiniciarse. Investiga los síntomas de un incidente de red.',files:[['VISOR DE EVENTOS','Servicio de red: error repetido\nReinicio inesperado: 14:32'],['CONEXIONES LOCALES','LAN-A  Equipo 01  Alerta\nLAN-B  Equipo 02  Sin alerta'],['PANEL DE ACTUALIZACIONES','Actualizaciones críticas: pendientes\nEstado de cortafuegos: revisar']],choices:[['Aislar el equipo y aplicar parches desde fuente confiable',true,'Has limitado el incidente y priorizado la recuperación segura.'],['Desactivar el cortafuegos y continuar conectado',false,'La superficie de exposición aumentaría.'],['Ignorar los reinicios y seguir trabajando',false,'El equipo seguiría sin diagnóstico ni contención.']]},
 modern:{year:'2017',title:'CENTRO DE RESPUESTA · 2017',incident:'WannaCry / NotPetya',intro:'Un centro de operaciones observa cambios sospechosos en archivos virtuales y tráfico de red.',files:[['CONSOLA EDR','Estación LAB-07: archivos de prueba bloqueados\nIndicador: simulación de ransomware'],['PANEL DE RED','Segmento LAB-07: tráfico anómalo\nSegmento LAB-08: operativo'],['COPIAS DE SEGURIDAD','Punto de restauración offline disponible\nÚltima comprobación de integridad: correcta']],choices:[['Aislar LAB-07 y restaurar desde copia comprobada',true,'Has contenido el alcance y planteado una recuperación verificable.'],['Pagar un rescate simulado',false,'El pago no garantiza recuperación y no sustituye la contención.'],['Conectar más unidades compartidas para seguir trabajando',false,'La exposición de otros recursos podría aumentar.']]}
});
const labels={dos:'DOS 1988',classic:'Windows 98',xp:'Windows XP',modern:'SOC moderno'};
function elem(tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e;}
export function initEraExperience(){
 const root=document.getElementById('eraExperience'), selector=document.getElementById('mosEra');
 if(!root||!selector)return;
 const launch=document.getElementById('eraLaunch');
 launch?.addEventListener('click',()=>{const hide=!root.hidden;root.hidden=hide;launch.setAttribute('aria-expanded',String(!hide));if(!hide)root.scrollIntoView({behavior:'smooth',block:'nearest'});});
 let choice=-1,inspected=new Set(),current='';
 const progress=()=>{try{return JSON.parse(localStorage.getItem('vm404:era-progress')||'{}')}catch{return {}}};
 const save=(p)=>{try{localStorage.setItem('vm404:era-progress',JSON.stringify(p))}catch{}};
 function render(){
  const id=eraCases[selector.value]?selector.value:'classic',caseData=eraCases[id];
  if(current!==id){current=id;choice=-1;inspected=new Set();}
  root.replaceChildren();root.dataset.era=id;
  const head=elem('div','era-head');head.append(elem('span','era-kicker','ARCHIVO RECREADO · '+caseData.year),elem('h2','',caseData.title),elem('p','',caseData.intro));
  const terminal=elem('div','era-terminal'),trace=elem('div','era-trace');
  const tabs=elem('div','era-tabs');tabs.setAttribute('aria-label','Pistas del caso');
  caseData.files.forEach(([label,body],idx)=>{
   const btn=elem('button','era-tab',label);btn.type='button';btn.setAttribute('aria-pressed',String(inspected.has(idx)));
   btn.addEventListener('click',()=>{inspected.add(idx);trace.textContent=body;btn.setAttribute('aria-pressed','true');refreshChoices();});
   tabs.append(btn);
  });
  terminal.append(tabs,trace);
  const step=elem('p','era-hint','Abre las tres pistas y decide cómo responder.');
  const actions=elem('div','era-decisions');const result=elem('div','era-result');
  result.setAttribute('role','status');result.setAttribute('aria-live','polite');
  function refreshChoices(){
   step.textContent='Pistas examinadas: '+inspected.size+'/3 · '+(inspected.size===3?'Puedes resolver el incidente.':'Examina las tres antes de decidir.');
   actions.replaceChildren();
   caseData.choices.forEach(([text,ok,feedback],idx)=>{
    const button=elem('button','era-decision',text);
    button.type='button';button.disabled=inspected.size<3||choice!==-1;
    button.addEventListener('click',()=>{
     choice=idx;const passed=ok===true;
     result.textContent=(passed?'✓ INVESTIGACIÓN RESUELTA — ':'⚠ RESPUESTA MEJORABLE — ')+feedback;
     result.dataset.outcome=passed?'pass':'retry';
     if(passed){const p=progress();p[id]=true;save(p);}
     refreshChoices();restart.hidden=false;refreshStatus();
    });actions.append(button);
   });
  }
  const restart=elem('button','era-restart','↺ Reiniciar investigación');restart.hidden=true;
  restart.addEventListener('click',()=>{choice=-1;inspected=new Set();renderReset();});
  const badge=elem('p','era-progress');
  function refreshStatus(){badge.textContent='EXPEDIENTES COMPLETADOS: '+Object.keys(progress()).filter(k=>eraCases[k]&&progress()[k]).length+'/4';}
  function renderReset(){current='';render();}
  refreshStatus();refreshChoices();
  const foot=elem('p','era-disclaimer','SIMULACIÓN EDUCATIVA · DATOS, ARCHIVOS Y RED TOTALMENTE FICTICIOS');
  root.append(head,badge,terminal,step,actions,result,restart,foot);
 }
 selector.addEventListener('change',()=>{render();root.hidden=false;if(launch)launch.setAttribute('aria-expanded','true');});
 render();
}
