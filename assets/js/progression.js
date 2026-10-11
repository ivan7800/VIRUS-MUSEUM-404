// Progreso local y determinista: nunca inspecciona archivos del usuario.
export const MISSIONS = Object.freeze([
 {id:'m1',caseId:'mail',name:'El adjunto invisible',tier:'RECLUTA',minScore:40,xp:100,description:'Identifica y aísla el adjunto del correo sospechoso.'},
 {id:'m2',caseId:'ransom',name:'Última copia',tier:'RECLUTA',minScore:40,xp:125,description:'Recupera un equipo tras una alerta de ransomware ficticio.'},
 {id:'m3',caseId:'network',name:'Señal anómala',tier:'ANALISTA',minScore:60,xp:150,description:'Localiza el proceso de red anómalo con precisión.'},
 {id:'m4',caseId:'mail',name:'Correo sin errores',tier:'ANALISTA',minScore:100,xp:175,description:'Resuelve el incidente de correo sin falsos positivos.'},
 {id:'m5',caseId:'ransom',name:'Restauración impecable',tier:'EXPERTO',minScore:100,xp:200,description:'Restaura los documentos sin falsos positivos.'},
 {id:'m6',caseId:'network',name:'Red bajo control',tier:'EXPERTO',minScore:100,xp:250,description:'Cierra la investigación de red con puntuación perfecta.'}
]);
export const BADGES = Object.freeze([
 {id:'first',name:'Primer caso',description:'Completa tu primera misión.'},
 {id:'three',name:'Investigador',description:'Completa tres misiones.'},
 {id:'all',name:'Maestro del museo',description:'Completa las seis misiones.'},
 {id:'perfect',name:'Sin falsos positivos',description:'Completa una misión con 100 puntos.'},
 {id:'veteran',name:'Veterano 404',description:'Alcanza 500 puntos de experiencia.'}
]);
export class Campaign {
 constructor(storage=null){this.storage=storage;this.state={best:{},history:[]};this.load();}
 load(){if(!this.storage)return;try{const raw=JSON.parse(this.storage.getItem('v404.campaign.v1')||'null');if(raw&&typeof raw==='object'&&raw.best&&typeof raw.best==='object'&&Array.isArray(raw.history)){for(const mission of MISSIONS){const n=raw.best[mission.id];if(Number.isInteger(n)&&n>=40&&n<=100&&n>=mission.minScore)this.state.best[mission.id]=n;}this.state.history=raw.history.filter(h=>MISSIONS.some(m=>m.id===h.id)&&Number.isInteger(h.score)&&h.score>=40&&h.score<=100&&typeof h.date==='string').slice(-50);}}catch{/* almacenamiento no disponible o datos corruptos */}}
 persist(){try{this.storage?.setItem('v404.campaign.v1',JSON.stringify(this.state));}catch{/* modo privado: sesión en memoria */}}
 available(id){const index=MISSIONS.findIndex(m=>m.id===id);return index>=0&&(index===0||this.state.best[MISSIONS[index-1].id]!==undefined);}
 record(id,score){const mission=MISSIONS.find(m=>m.id===id);if(!mission)throw Error('Misión desconocida');if(!this.available(id))return {ok:false,message:'Esta misión sigue bloqueada.'};if(!Number.isInteger(score)||score<40||score>100)return {ok:false,message:'Puntuación no válida.'};if(score<mission.minScore)return {ok:false,message:`Necesitas ${mission.minScore} puntos; has obtenido ${score}. Puedes repetir el caso.`};const old=this.state.best[id];const improved=old===undefined||score>old;if(improved)this.state.best[id]=score;this.state.history.push({id,score,date:new Date().toISOString()});this.state.history=this.state.history.slice(-50);this.persist();return {ok:true,first:old===undefined,improved,message:old===undefined?'¡Misión superada!':improved?'¡Nueva marca personal!':'Misión repetida; se conserva tu mejor marca.'};}
 get completed(){return MISSIONS.filter(m=>this.state.best[m.id]!==undefined).length;}
 get xp(){return MISSIONS.reduce((sum,m)=>sum+(this.state.best[m.id]===undefined?0:m.xp),0);}
 get level(){return Math.floor(this.xp/250)+1;}
 get badges(){return BADGES.filter(b=>b.id==='first'&&this.completed>=1||b.id==='three'&&this.completed>=3||b.id==='all'&&this.completed===MISSIONS.length||b.id==='perfect'&&Object.values(this.state.best).some(v=>v===100)||b.id==='veteran'&&this.xp>=500);}
 reset(){this.state={best:{},history:[]};this.persist();}
}
