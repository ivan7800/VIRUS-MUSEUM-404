import assert from 'node:assert/strict';
import fs from 'node:fs';
const js=fs.readFileSync(new URL('../assets/js/museum-os.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../assets/css/styles.css',import.meta.url),'utf8');
for(const app of ['browser','calendar']){
  assert.match(js,new RegExp(`else if\\(type==='${app}'\\)`));
  assert.match(html,new RegExp(`data-mos-app="${app}"`));
}
assert.match(js,/museum:\/\//);
assert.match(js,/calendarNotes\[agendaSelected\]/);
assert.match(js,/uptime===18&&!dailyEventShown/);
assert.match(js,/openApp\('mail'\)/);
assert.match(css,/\.mos-browser-page/);
assert.match(css,/\.mos-agenda-editor/);
// Pages are internal only: no external fetch or redirects in the module.
assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|WebSocket|window\.open\s*\(/);
console.log('FASE 19: apps, navegación local, agenda y aislamiento estructural OK');
