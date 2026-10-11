import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {records} from '../assets/js/data.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const script=readFileSync(new URL('../assets/js/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/css/styles.css',import.meta.url),'utf8');
for(const view of ['inicio','archivo','laboratorio','sistema','acerca']){assert.match(html,new RegExp(`id="view-${view}"`));assert.match(html,new RegExp(`data-view="${view}"`));}
for(const id of ['search','eraFilter','catalog','featured','recordDialog','closeDialog','demoStart','demoReset','soundToggle','motionToggle'])assert.ok(html.includes(`id="${id}"`),id);
assert.equal(new Set(records.map(x=>x.id)).size,records.length,'IDs duplicados');
assert.ok(records.length>=10);
for(const record of records){for(const field of ['id','name','year','type','platform','description','effect'])assert.ok(record[field]!==undefined,`${record.name}: ${field}`);assert.ok(record.year>=1980&&record.year<=2026);}
assert.ok(!script.includes('fetch('));assert.ok(!script.includes('eval('));assert.ok(!html.includes('https://'));assert.ok(!css.includes('https://'));
console.log(`OK: 5 vistas, controles básicos, ${records.length} fichas, sin recursos remotos.`);
