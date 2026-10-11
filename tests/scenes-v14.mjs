import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const js=readFileSync(new URL('../assets/js/museum-os.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/css/styles.css',import.meta.url),'utf8');
for(const id of ['cascade','iloveyou','blaster','wannacry']){
 assert.match(js,new RegExp("showScene\\('"+id+"'"));
 assert.ok(css.includes('.mos-scene-'+(id==='iloveyou'?'mail':id==='blaster'?'rpc':id==='wannacry'?'ransom':'dos')));
}
for(const word of ['clearScene();','Cancelar reinicio virtual','↻ Ver escena','mos-falling-glyphs'])assert.ok(js.includes(word));
assert.match(js,/clearEffects=\(\)=>\{clearScene\(\)/);
console.log('OK: cuatro escenas, controles y limpieza presentes');
