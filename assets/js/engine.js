// Motor de escenarios educativos: solo eventos y estado en memoria; sin ejecuciones reales.
import {records} from './data.js';
const specs = records.map(r=>({id:r.id,name:`${r.name} · ${r.year}`,visual:r.visual,
 description:`${r.description} Defensa histórica: ${r.mitigation}.`,
 events:Object.freeze([
 {at:0,kind:'boot',message:`Entorno virtual ${r.platform} preparado`},
 {at:900,kind:'observe',message:`Observación histórica: ${r.name}`},
 {at:1900,kind:'visual',message:`Recreación ilustrativa: ${r.effect}`},
 {at:3200,kind:'detect',message:'Anomalía ficticia identificada'},
 {at:4700,kind:'contain',message:`Respuesta defensiva: ${r.mitigation}`},
 {at:5900,kind:'finish',message:'Simulación terminada; ningún archivo o equipo real afectado.'}
 ])}));
export const scenarios=Object.freeze(specs.map(s=>Object.freeze({...s,events:s.events.map(e=>Object.freeze(e))})));
const allowed=new Set(['boot','observe','visual','detect','contain','finish']);
export class SimulationEngine{
  constructor(onChange=()=>{},clock={now:()=>performance.now(),schedule:(fn,delay)=>setTimeout(fn,delay),cancel:id=>clearTimeout(id)}){
    this.onChange=onChange;this.clock=clock;this.reset();
  }
  reset(){this._cancel?.();this.scenario=null;this.status='idle';this.cursor=0;this.elapsed=0;this.startedAt=0;this.history=[];this.virtual={screen:'normal',documents:'disponibles',message:'ninguno',alert:'sin alertas'};this.emit();}
  emit(){this.onChange(this.snapshot());}
  snapshot(){return {status:this.status,scenario:this.scenario?.id??null,cursor:this.cursor,total:this.scenario?.events.length??0,history:this.history.map(x=>({...x})),virtual:{...this.virtual}};}
  load(id){const scenario=scenarios.find(s=>s.id===id);if(!scenario)throw Error('Escenario desconocido');this.reset();this.scenario=scenario;this.emit();}
  start(){if(!this.scenario)throw Error('Selecciona un escenario');if(this.status==='running')return;if(this.status==='completed'){this.load(this.scenario.id);}this.status='running';this.startedAt=this.clock.now()-this.elapsed;this.emit();this._next();}
  pause(){if(this.status!=='running')return;this.elapsed=this.clock.now()-this.startedAt;this._cancel();this.status='paused';this.emit();}
  resume(){if(this.status!=='paused')return;this.start();}
  _cancel(){if(this.timer!==undefined){this.clock.cancel(this.timer);this.timer=undefined;}}
  _next(){this._cancel();if(this.status!=='running')return;if(this.cursor>=this.scenario.events.length){this.status='completed';this.emit();return;}
    const ev=this.scenario.events[this.cursor];const delay=Math.max(0,ev.at-(this.clock.now()-this.startedAt));this.timer=this.clock.schedule(()=>{this.timer=undefined;if(this.status!=='running')return;this.elapsed=this.clock.now()-this.startedAt;this._apply(ev);this.cursor++;if(this.cursor===this.scenario.events.length){this.status='completed';this.emit();}else{this.emit();this._next();}},delay);
  }
  _apply(ev){if(!allowed.has(ev.kind))throw Error('Evento no permitido');if(ev.kind==='visual'){if(['fall','bootsector','poem','industrial','countdown'].includes(this.scenario.visual))this.virtual.screen='efecto visual ficticio: '+this.scenario.visual;if(this.scenario.visual==='inbox')this.virtual.message='mensaje ilustrativo sospechoso';if(this.scenario.visual==='ransom')this.virtual.documents='3 documentos virtuales bloqueados';if(this.scenario.visual==='network')this.virtual.screen='nodos simulados marcados';}if(ev.kind==='detect')this.virtual.alert='incidente detectado';if(ev.kind==='contain'){this.virtual.screen='normal';this.virtual.documents='disponibles';this.virtual.message='en cuarentena';this.virtual.alert='contenido';}this.history.push({at:ev.at,kind:ev.kind,message:ev.message});}
}
