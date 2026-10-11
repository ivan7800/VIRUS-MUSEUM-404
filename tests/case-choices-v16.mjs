import assert from 'node:assert/strict';
import fs from 'node:fs';
const js=fs.readFileSync(new URL('../assets/js/museum-os.js',import.meta.url),'utf8');
for(const fn of ['recordEvidence','recordAction','finishCase'])assert.ok(js.includes(`function ${fn}(`));
for(const label of ['Cerrar expediente y evaluar','RESULTADO','Aislar equipo','Cuarentena','Finalizar proceso'])assert.ok(js.includes(label));
assert.match(js,/if\(scenario==='none'\|\|caseResolved\|\|quarantined\|\|!infected\)return/);
assert.match(js,/lastCaseOutcome=caseOutcome/);
assert.ok(!/fetch\s*\(|WebSocket|eval\s*\(|new Function\s*\(/.test(js));
console.log('Case choices v16: structural checks PASS');
