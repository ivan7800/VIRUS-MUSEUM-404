import {Campaign,MISSIONS,BADGES} from './progression.js';
export function initCampaign(){
 const campaign=new Campaign(window.localStorage),$=id=>document.getElementById(id);
 const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
 let activeMission=null;
 function render(){
  $('campaignStats').textContent=`NIVEL ${campaign.level} · ${campaign.xp} XP · ${campaign.completed}/${MISSIONS.length} MISIONES`;
  const root=$('missionList');root.replaceChildren();
  for(const m of MISSIONS){const unlocked=campaign.available(m.id),best=campaign.state.best[m.id];const article=node('article','campaign-mission'),content=node('div','');content.append(node('span','eyebrow',m.tier+' / '+m.xp+' XP'),node('h3','',m.name),node('p','',m.description),node('small','',best!==undefined?`COMPLETADA · MEJOR NOTA ${best}/100`:unlocked?`DISPONIBLE · MÍNIMO ${m.minScore}/100`:'BLOQUEADA · TERMINA LA MISIÓN ANTERIOR'));const button=node('button','btn '+(unlocked?'primary':'ghost'),best!==undefined?'↻ REPETIR':unlocked?'▶ INICIAR':'🔒 BLOQUEADA');button.type='button';button.disabled=!unlocked;button.addEventListener('click',()=>{activeMission=m.id;$('caseSelect').value=m.caseId;$('caseSelect').dispatchEvent(new Event('change'));$('campaignCurrent').textContent=`MISIÓN ACTIVA: ${m.name} · PUNTUACIÓN MÍNIMA ${m.minScore}/100`;location.hash='laboratorio';document.querySelector('.forensic')?.scrollIntoView({behavior:'smooth',block:'start'});});article.append(content,button);root.append(article);}
  $('badgeList').replaceChildren(...BADGES.map(b=>{const got=campaign.badges.some(x=>x.id===b.id);const element=node('div','campaign-badge'+(got?' earned':''));element.append(node('strong','',`${got?'◆':'◇'} ${b.name}`),node('span','',b.description));return element;}));
  $('missionHistory').replaceChildren(...[...campaign.state.history].reverse().slice(0,10).map(h=>node('li','',`${MISSIONS.find(m=>m.id===h.id).name} · ${h.score}/100 · ${new Date(h.date).toLocaleDateString('es-ES')}`)));
 }
 document.addEventListener('v404:forensic-restored',event=>{if(!activeMission)return;const m=MISSIONS.find(m=>m.id===activeMission);if(!m||m.caseId!==event.detail.id)return;const result=campaign.record(m.id,event.detail.score);$('campaignCurrent').textContent=result.message;activeMission=null;render();});
 document.addEventListener('v404:forensic-case-selected',event=>{if(activeMission&&MISSIONS.find(m=>m.id===activeMission)?.caseId!==event.detail.id){activeMission=null;$('campaignCurrent').textContent='Misión cancelada: se ha cambiado de caso.';}});
 $('campaignReset').addEventListener('click',()=>{if(window.confirm('¿Borrar todo el progreso, medallas e historial local de esta campaña?')){campaign.reset();activeMission=null;$('campaignCurrent').textContent='Progreso local reiniciado.';render();}});
 render();
}
