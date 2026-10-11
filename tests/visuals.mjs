import assert from 'node:assert/strict';
import {scenarios} from '../assets/js/engine.js';
assert.equal(scenarios.length,30);assert.equal(new Set(scenarios.map(s=>s.id)).size,30);
for(const s of scenarios){assert.equal(s.events.length,6);assert.deepEqual(s.events.map(e=>e.kind),['boot','observe','visual','detect','contain','finish']);assert.ok(s.visual);assert.equal(s.events.at(-1).at,5900)}
const code=await (await import('node:fs/promises')).readFile(new URL('../assets/js/visuals.js',import.meta.url),'utf8');
assert.doesNotMatch(code,/\b(?:eval|fetch|innerHTML|WebSocket|localStorage)\s*[(=]/);
console.log('OK: treinta escenarios distintos, eventos válidos y visualizador declarativo sin ejecución de amenazas.');
