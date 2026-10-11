import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {incidentScenes} from '../assets/js/era-incidents.js';
const ids=['dos','classic','xp','modern'];
assert.deepEqual(Object.keys(incidentScenes).sort(),[...ids].sort());
for(const id of ids){assert.ok(incidentScenes[id].title);assert.equal(incidentScenes[id].steps.length,4);assert.ok(incidentScenes[id].steps.every(v=>typeof v==='string'&&v.length>10));}
const app=readFileSync(new URL('../assets/js/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/css/styles.css',import.meta.url),'utf8');
assert.ok(app.includes("import {initEraIncidents} from './era-incidents.js'"));
assert.ok(app.includes('initEraIncidents();'));
assert.ok(css.includes('.era-incident-console'));
console.log('PASS: Four fictional incident scenes, integration and controls');
