from playwright.sync_api import sync_playwright
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
mods=['data','engine','visuals','virtual','forensics','forensics-ui','progression','campaign-ui','museum-os','app']
bundle='const __mods={};\n'
for n in mods:
 s=(root/'assets/js'/f'{n}.js').read_text()
 imports=re.findall(r"^import \{([^}]+)\} from '\./([^']+)';?",s,re.M)
 s=re.sub(r'^import .*?;\s*$', '',s,flags=re.M)
 exports=re.findall(r'^export (?:const|class|function) (\w+)',s,re.M)
 s=re.sub(r'^export ', '',s,flags=re.M)
 pre=''.join('const {'+names+'}=__mods["'+file[:-3]+'"];\n' for names,file in imports)
 bundle+='__mods["'+n+'"]=(function(){\n'+pre+s+'\nreturn {'+','.join(exports)+'};\n})();\n'
html=(root/'index.html').read_text();html=re.sub(r'<script type="module" src="assets/js/app.js"></script>','',html)
css=(root/'assets/css/styles.css').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000});errs=[]
 page.on('pageerror',lambda e:errs.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded')
 page.add_style_tag(content=css)
 page.evaluate("Object.defineProperty(window, 'localStorage', { configurable: true, value: {getItem(){return null},setItem(){},removeItem(){}} })")
 page.add_script_tag(content=bundle)
 page.locator('[data-view="museumos"]').first.click()
 print('INIT ERRORS',errs, 'museum vis',page.locator('#view-museumos').get_attribute('class'),'off hidden',page.locator('#mosOff').get_attribute('hidden'))
 def click(sel):page.locator(sel).first.click(timeout=2000)
 click('#mosPower');click('#mosContinue');click('#mosEnter')
 outcome={}
 for app in ['files','notepad','mail','browser','calendar','terminal','tasks','network','events','security','trash','settings','backup','cases']:
  try:
   click('#mosStart');click('#mosStartMenu [data-mos-app="'+app+'"]'); assert page.locator('.mos-window[data-app="'+app+'"]').count()==1
   outcome[app]='PASS'
  except Exception as ex: outcome[app]='FAIL '+str(ex).splitlines()[0]
 print('APPS',outcome)
 print('PAGE ERRORS',errs)
 # Repeated open should focus a single window, rather than duplicate it.
 page.locator('#mosStart').click();page.locator('#mosStartMenu [data-mos-app=\"files\"]').click()
 print('SINGLE EXPLORER',page.locator('.mos-window[data-app=\"files\"]').count()==1)
 # Reset must dismiss windows, return clean incident UI and allow reopening.
 page.locator('#mosReset').click()
 print('RESET WINDOWS',page.locator('.mos-window').count()==0)
 page.locator('#mosStart').click();page.locator('#mosStartMenu [data-mos-app=\"files\"]').click()
 print('REOPEN FILES',page.locator('.mos-window[data-app=\"files\"]').count()==1)
 assert not errs, errs
 assert all(v=='PASS' for v in outcome.values()),outcome
 print('FINAL ERRORS',errs)

 
 b.close()
