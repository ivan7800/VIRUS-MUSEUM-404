import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const js=readFileSync(new URL('../assets/js/museum-os.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/css/styles.css',import.meta.url),'utf8');
for (const value of ['AGENDA.txt','diario.txt','README-DESCARGAS.txt','mailDrafts.push','mailRead.add(m.subject)','Ver adjunto en Descargas','Abrir adjunto en entorno aislado','runIncident(\'iloveyou\')','fileIcon','mos-mail-compose']) assert.ok(js.includes(value),value);
for (const value of ['.mos-mail-layout','.mos-mail-detail','.mos-mail-compose','.mos-mail-inbox']) assert.ok(css.includes(value),value);
assert.ok(!/\bfetch\s*\(|\bWebSocket\b|\beval\s*\(/.test(js));
console.log('PERIOD APPS V17 PASS: inbox, drafts, file identities, incident handoff');
