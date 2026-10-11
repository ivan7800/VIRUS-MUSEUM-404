import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const s=readFileSync(new URL('../assets/js/museum-os.js',import.meta.url),'utf8');
for(const marker of ["uptime===25)deliverEvent('mail')","uptime===48)deliverEvent('warning')","deliveredEvents.has(key)","for(const m of inboxMail)","Analizar sin abrir","Ignorar mensaje","window.confirm(","incidentDecision='opened'","decision:incidentDecision","refresh('mail')"]){assert.ok(s.includes(marker),`missing: ${marker}`)}
assert.ok(s.includes("inboxMail=starterMail.map(m=>({...m}))"),'reset dynamic inbox');
assert.ok(s.includes("No se ejecutará ningún archivo real."),'explicit consent text');
console.log('Fase 20: invariantes estructurales OK');
