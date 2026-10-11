// Visualizador educativo autocontenido. Solo dibuja sobre Canvas y DOM local.
// No ejecuta código externo ni accede a archivos, procesos o redes.
let frameId=0, currentCanvas=null, currentKey='', tick=0;
const el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text!==undefined)n.textContent=text;return n;};
const special={fall:'DOS / CHARACTER CASCADE',ransom:'WINDOWS / INCIDENT RESPONSE',network:'NETWORK / TOPOLOGY',industrial:'ICS / CONTROL ROOM',inbox:'OUTLOOK / INBOX',countdown:'WINDOWS / SYSTEM ALERT',bootsector:'DOS / BOOT SECTOR',poem:'APPLE II / DISPLAY',files:'DOS / FILE MANAGER',document:'OFFICE / DOCUMENT',server:'WEB / SERVER',iot:'NETWORK / CONNECTED DEVICES',disk:'STORAGE / SECTOR MAP',calendar:'DOS / CALENDAR'};
const palettes={fall:['#0a120e','#8bffa1'],ransom:['#24090d','#ff6c71'],network:['#071422','#42dbff'],industrial:['#141b19','#ffbc61'],inbox:['#101b29','#72b8ff'],countdown:['#112339','#85c3ff']};
function box(ctx,x,y,w,h,fill,r=0){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function txt(ctx,t,x,y,size=15,color='#e8fff2',font='monospace'){ctx.font=`${size}px ${font}`;ctx.fillStyle=color;ctx.fillText(t,x,y);}
function line(ctx,x,y,X,Y,color='#348777',width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.stroke();}
function scene(ctx,w,h,s,active,t,reduced){let kind=s.visual,theme=palettes[kind]||['#091615','#83f5b8'];ctx.fillStyle=theme[0];ctx.fillRect(0,0,w,h);
const shift=reduced?0:t;
// Background glows and CRT scan lines.
const glow=ctx.createRadialGradient(w*.5,h*.36,4,w*.5,h*.36,w*.72);glow.addColorStop(0,kind==='ransom'?'#661a2d':'#17423c');glow.addColorStop(1,'#0000');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
for(let y=0;y<h;y+=4)line(ctx,0,y,w,y,'#ffffff09');
const pad=30;
if(kind==='fall'){
 txt(ctx,'C:\\> DIR',pad,65,18,'#c6e9c7');let seed=['VIRUS MUSEUM 404','COMMAND.COM     54,645','AUTOEXEC.BAT      132','CONFIG.SYS        211','C:\\>_'];for(let i=0;i<seed.length;i++)txt(ctx,seed[i],pad,102+i*25,16,'#a3e4ac');
 if(active){for(let i=0;i<130;i++){let col=i%27,row=Math.floor(i/27);let x=pad+col*Math.min(24,(w-50)/27),base=80+row*26,drop=(shift*.08+(i*37)%h)%h;txt(ctx,'DOS404X#@$!?/\\'[(i*7)%13],x,drop,17,i%7===0?'#f7fff7':'#86eaa1');}}
} else if(kind==='ransom'){
 box(ctx,pad,38,w-2*pad,54,'#851b2b',8);txt(ctx,'!  INCIDENTE DE RANSOMWARE · RECREACIÓN',pad+15,73,Math.max(12,Math.min(19,w/35)),'#fff');
 txt(ctx,'ARCHIVOS VIRTUALES MARCADOS',pad,136,Math.min(19,w/32),'#ffe9ea');
 const files=['proyecto_404.doc','fotografias.zip','notas_personales.txt'];files.forEach((f,i)=>{box(ctx,pad,159+i*46,w-2*pad,38,'#361d29',5);txt(ctx,'▣  '+f,pad+14,184+i*46,15,'#f1d2d8');txt(ctx,active?'LOCKED':'READY',w-124,184+i*46,14,active?'#ff6868':'#79e3a2');});
 box(ctx,pad,h-67,w-2*pad,34,'#67212c',4);txt(ctx,active?'SIMULACIÓN: ALERTA ACTIVA':'SIMULACIÓN: ENTORNO EN ESPERA',pad+13,h-44,13,'#ffe0e0');
} else if(kind==='network'||kind==='iot'||kind==='server'){
 txt(ctx,kind==='network'?'TOPOLOGÍA DE PROPAGACIÓN':kind==='iot'?'DISPOSITIVOS AISLADOS':'TELEMETRÍA DE SERVIDORES',pad,55,19,theme[1]);
 const nodes=Array.from({length:16},(_,i)=>({x:60+(i%4)*(w-120)/3,y:100+Math.floor(i/4)*(h-160)/3}));nodes.forEach((n,i)=>{if(i%4!==3)line(ctx,n.x,n.y,nodes[i+1].x,nodes[i+1].y,'#426c80',2);if(i<12)line(ctx,n.x,n.y,nodes[i+4].x,nodes[i+4].y,'#294557');});nodes.forEach((n,i)=>{let hit=active&&(i%4===0||i%7===0);ctx.beginPath();ctx.arc(n.x,n.y,Math.max(8,Math.min(15,w/45)),0,Math.PI*2);ctx.fillStyle=hit?'#ff727a':'#66d7e0';ctx.fill();txt(ctx,String(i+1).padStart(2,'0'),n.x-8,n.y+4,10,'#08121b');if(hit&&!reduced){ctx.beginPath();ctx.arc(n.x,n.y,18+8*Math.abs(Math.sin(shift/420+i)),0,Math.PI*2);ctx.strokeStyle='#ff727a66';ctx.stroke();}});
} else if(kind==='industrial'){
 txt(ctx,'PLANTA VIRTUAL  /  PANEL DE CONTROL',pad,54,17,'#ffd18c');['PRESIÓN','CAUDAL','FRECUENCIA'].forEach((label,i)=>{let y=92+i*90;txt(ctx,label,pad,y,13,'#aacac1');box(ctx,pad,y+13,w-2*pad,52,'#142e2b',6);for(let k=0;k<15;k++){let v=(Math.sin(shift/530+k*.8+i*2)+1)/2;box(ctx,pad+16+k*(w-2*pad-32)/15,y+24,Math.max(4,(w-2*pad-44)/18),Math.max(5,v*24),active&&i===1?'#ff8b55':'#65e4bd',2);}});
} else if(kind==='inbox'||kind==='document'){
 box(ctx,pad,40,w-2*pad,40,'#244869',5);txt(ctx,kind==='inbox'?'CORREO / BANDEJA DE ENTRADA':'DOCUMENTOS / VISOR SEGURO',pad+14,67,17,'#e3f5ff');(kind==='inbox'?['De: contacto@example.invalid','Asunto: Mensaje inesperado','Adjunto: ejemplo.txt (NO EJECUTABLE)']:['INFORME_HISTORICO.doc','Contenido documental ficticio','Macros bloqueadas por política']).forEach((str,i)=>{box(ctx,pad,100+i*65,w-2*pad,53,active&&i===2?'#643b40':'#19344b',5);txt(ctx,str,pad+15,133+i*65,Math.max(12,Math.min(16,w/37)),active&&i===2?'#ffb2a7':'#cce6fc');});
} else if(kind==='countdown'){
 box(ctx,w*.13,h*.17,w*.74,h*.64,'#164470',9);box(ctx,w*.13,h*.17,w*.74,44,'#3770aa',8);txt(ctx,'SYSTEM NOTICE (VIRTUAL)',w*.16,h*.17+29,16,'#fff');txt(ctx,'REINICIO SIMULADO',w*.2,h*.48,Math.min(26,w/22),'#fff');txt(ctx,active?'00:00:45':'--:--:--',w*.36,h*.66,31,'#ffed9c');
} else if(kind==='bootsector'||kind==='disk'||kind==='files'||kind==='calendar'){
 txt(ctx,'DISK UTILITY / SIMULADOR DE ARCHIVOS',pad,48,18,theme[1]);for(let i=0;i<9;i++){let y=69+i*34;box(ctx,pad,y,w-2*pad,28,i%2?'#112e29':'#173b31',3);txt(ctx,`0x${(4096+i*64).toString(16).toUpperCase()}    ${'█'.repeat(8)}${active&&i===5?' ░░▒▒░░':' ████'}`,pad+12,y+20,Math.min(16,w/34),active&&i===5?'#ffbd78':'#8ce4bd');}
} else if(kind==='poem'){
 txt(ctx,'APPLE ][    © 1982     DISK II',pad,59,20,'#9dffad');['ELK CLONER','A VIRTUAL COMPUTER POEM','A RETRO DEMONSTRATION','NO DATA IS CHANGED'].forEach((v,i)=>txt(ctx,v,pad+15,120+i*53,Math.min(21,w/28),i===0?'#f8ffe5':'#b0e5ba'));
} else {txt(ctx,'INCIDENTE EN ENTORNO CONTROLADO',pad,70,19,theme[1]);for(let i=0;i<7;i++){let y=100+i*38;box(ctx,pad,y,w-2*pad,29,'#12302b',4);txt(ctx,`[${String(i+1).padStart(2,'0')}]  RECURSO VIRTUAL ${i+1}     ${active&&i%3===0?'ALERTA':'MONITORIZADO'}`,pad+10,y+19,14,active&&i%3===0?'#ffb187':'#91e4ba');}}
// Vignette and fictitious-environment watermark.
const vignette=ctx.createRadialGradient(w/2,h/2,w*.2,w/2,h/2,w*.8);vignette.addColorStop(0,'#0000');vignette.addColorStop(1,'#0009');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
box(ctx,w-163,h-31,149,22,'#000b',3);txt(ctx,'● ENTORNO FICTICIO',w-155,h-16,10,'#a7edc1');
}
export function renderScenarioVisual(root,name,phase,state,scenarios,reduced=false){
 const s=scenarios.find(x=>x.id===state.scenario);cancelAnimationFrame(frameId);root.replaceChildren();currentCanvas=null;
 name.textContent=s?.name.toUpperCase()??'V404 / SIMULATION DISPLAY';phase.textContent=state.status.toUpperCase();
 if(!s){root.append(el('p','remaster-empty','Selecciona un escenario para entrar en el entorno virtual.'));return;}
 const shell=el('div','immersive-shell');const chrome=el('div','immersive-chrome');const leds=el('span','immersive-leds','●  ●  ●');const label=el('span','immersive-label',special[s.visual]||'VIRTUAL / WORKSTATION');const status=el('span','immersive-status',state.status==='running'?'● LIVE':state.status==='paused'?'Ⅱ PAUSADO':state.status==='completed'?'✓ RESTAURADO':'○ STANDBY');chrome.append(leds,label,status);
 const canvas=document.createElement('canvas');canvas.className='immersive-display';canvas.width=960;canvas.height=480;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',`${s.name}: recreación gráfica educativa de ${s.visual}`);
 const footer=el('div','immersive-footer');footer.append(el('span','',`${s.name.toUpperCase()} / HISTORICAL RECONSTRUCTION`),el('span','',`ETAPA ${state.cursor}/${state.total}`));shell.append(chrome,canvas,footer);root.append(shell);
 const active=state.history.some(ev=>ev.kind==='visual')&&!state.history.some(ev=>ev.kind==='contain');
 const ctx=canvas.getContext('2d');if(!ctx)return;let localTick=0;
 function draw(){if(!canvas.isConnected)return;scene(ctx,canvas.width,canvas.height,s,active,localTick,reduced);if(!reduced&&state.status==='running'&&active){localTick+=16;frameId=requestAnimationFrame(draw);}}
 draw();
}
