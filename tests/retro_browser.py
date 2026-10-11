from pathlib import Path
from playwright.sync_api import sync_playwright
import threading,http.server,socketserver
root=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root),**kwargs)
 def log_message(self,*args):pass
class Server(socketserver.ThreadingTCPServer):allow_reuse_address=True
srv=Server(('127.0.0.1',0),Handler);threading.Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
 page=browser.new_page(viewport={'width':1440,'height':900})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(f'http://127.0.0.1:{srv.server_address[1]}/',wait_until='domcontentloaded',timeout=15000)
 page.locator('[data-view="museumos"]').click()
 page.locator('#mosPower').click();page.locator('#mosContinue').click();page.locator('#mosEnter').click()
 assert page.locator('#mosWork').is_visible()
 page.locator('[data-mos-app="files"]').first.click()
 win=page.locator('.mos-window[data-app="files"]').last
 assert win.is_visible()
 win.locator('.mos-filebar button').click()
 assert win.get_by_text('nuevo-documento1.txt').count()>0
 win.get_by_text('nuevo-documento1.txt').click()
 win.get_by_text('Mover a papelera').click()
 assert win.get_by_text('nuevo-documento1.txt').count()==0
 page.locator('[data-mos-app="trash"]').first.click()
 trash=page.locator('.mos-window[data-app="trash"]').last
 trash.get_by_text('Restaurar').click()
 assert win.get_by_text('nuevo-documento1.txt').count()>0
 page.locator('[data-mos-app="settings"]').first.click()
 page.locator('.mos-window[data-app="settings"]').last.get_by_text('MuseumOS · azul contemporáneo').click()
 assert page.locator('#museumOS').evaluate('(e)=>e.classList.contains("mos-modern")')
 page.locator('#mosStart').click();assert page.locator('#mosStartMenu').is_visible()
 page.keyboard.press('Escape');assert not page.locator('#mosStartMenu').is_visible()
 page.locator('[data-mos-incident="wannacry"]').click()
 assert page.locator('#mosTimeline').is_visible()
 page.locator('#mosReset').click()
 page.screenshot(path=str(root/'tests'/'museumos-retro-preview.png'),full_page=False)
 assert not errors,errors
 print('BROWSER PASS: boot, login, explorer, create, delete, trash restore, theme, start, escape, scenario, reset; console=',errors)
 browser.close()
srv.shutdown()
