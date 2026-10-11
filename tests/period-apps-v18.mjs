import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const js=readFileSync(new URL('../assets/js/museum-os.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/css/styles.css',import.meta.url),'utf8');
for(const token of ["notepad:['📝','Bloc de notas']","type==='notepad'","files[notepadPath]=editor.value","notepadPath=path;openApp('notepad')","case 'OPEN'","locked&&notepadPath.includes('/Documents/')","mos-xp", "retroTheme==='xp'"] ) assert.ok(js.includes(token),`Falta ${token}`);
for(const token of ['data-mos-app="notepad"','.mos-notepad-editor','.mos-xp .mos-desktop']) assert.ok((html+css).includes(token),`Falta ${token}`);
assert.ok(!/\bfetch\s*\(|\bWebSocket\b|\beval\s*\(/.test(js),'No debe cargar contenido remoto ni ejecutar código externo');
console.log('PERIOD APPS V18 PASS: notepad, file handoff, XP theme, no network execution');
