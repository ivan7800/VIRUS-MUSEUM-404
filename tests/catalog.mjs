import assert from 'node:assert/strict';
import {records} from '../assets/js/data.js';
import {scenarios} from '../assets/js/engine.js';
assert.equal(records.length,30);
assert.equal(scenarios.length,30);
assert.equal(new Set(records.map(x=>x.id)).size,30);
assert.deepEqual(new Set(scenarios.map(x=>x.id)),new Set(records.map(x=>x.id)));
for(const r of records){assert(r.description.length>30);assert(r.mitigation.length>6);assert(r.year>=1980 && r.year<=2026);}
for(const s of scenarios){assert.equal(s.events.length,6);assert(s.events.every(x=>typeof x.message==='string'));}
console.log('OK: 30 fichas, 30 simulaciones, ids unívocos, datos completos.');
