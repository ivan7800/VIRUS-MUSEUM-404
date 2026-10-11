import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {eraCases} from '../assets/js/era-experience.js';
const cases=Object.keys(eraCases);
assert.deepEqual(cases.sort(),['classic','dos','modern','xp']);
for(const [id,item] of Object.entries(eraCases)){
 assert.ok(item.year && item.title && item.intro,id);
 assert.equal(item.files.length,3,id+' must have three investigation clues');
 assert.equal(item.choices.length,3,id+' must have three defensive responses');
 assert.equal(item.choices.filter(option=>option[1]===true).length,1,id+' needs exactly one best decision');
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../assets/js/app.js',import.meta.url),'utf8');
assert.ok(html.includes('id="eraExperience"'));
assert.ok(html.includes('id="mosEra"'));
assert.ok(app.includes('initEraExperience()'));
console.log('PASS 4 independent eras, clues, choices and UI integration');
