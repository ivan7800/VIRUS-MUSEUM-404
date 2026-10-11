from playwright.sync_api import sync_playwright
from threading import Thread
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import os
os.chdir(os.path.dirname(os.path.dirname(__file__)))
server=ThreadingHTTPServer(('127.0.0.1',0),SimpleHTTPRequestHandler)
Thread(target=server.serve_forever,daemon=True).start()
errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1280,'height':900})
 page.on('pageerror',lambda err:errors.append(str(err)))
 from pathlib import Path
 from urllib.parse import urlparse
 root=Path(__file__).resolve().parents[1]
 def serve(route):
  path=urlparse(route.request.url).path.lstrip('/') or 'index.html'
  file=(root/path).resolve()
  if not file.is_relative_to(root) or not file.is_file():return route.fulfill(status=404,body='Not found')
  mime='text/javascript' if file.suffix=='.js' else 'text/css' if file.suffix=='.css' else 'text/html'
  route.fulfill(status=200,body=file.read_bytes(),content_type=mime)
 page.route('**/*',serve)
 page.goto('https://museum.test/')
 page.locator('[data-view="sistema"]').click()
 assert page.locator('#dosMachine').is_visible()
 page.locator('#dosInput').fill('HELP');page.locator('#dosForm button').click()
 assert 'CASCADE' in page.locator('#dosOutput').inner_text()
 page.locator('#dosInput').fill('DIR');page.locator('#dosInput').press('Enter')
 assert 'AUTOEXEC.BAT' in page.locator('#dosOutput').inner_text()
 page.locator('#dosInput').fill('CD DOS');page.locator('#dosInput').press('Enter')
 page.locator('#dosInput').fill('TYPE HISTORY.TXT');page.locator('#dosInput').press('Enter')
 assert 'Cascade' in page.locator('#dosOutput').inner_text()
 page.locator('#dosCascade').click(); assert page.locator('#cascadeLayer').is_visible()
 page.locator('#cascadeStop').click();assert page.locator('#cascadeLayer').is_hidden()
 page.locator('#dosReset').click();assert 'RESTABLECIDO' in page.locator('#dosOutput').inner_text()
 page.locator('[data-os="win"]').click();assert page.locator('#retroMachine').is_visible()
 page.locator('[data-retro-app="computer"]').first.click();assert page.locator('.retro-window').count()==1
 page.locator('.retro-window-bar button[aria-label^="Minimizar"]').click();assert page.locator('.retro-window.minimized').count()==1
 page.locator('.retro-window-bar button[aria-label^="Minimizar"]').click()
 page.locator('.retro-window-bar button[aria-label^="Cerrar"]').click();assert page.locator('.retro-window').count()==0
 page.locator('#startButton').click();assert page.locator('#startMenu').is_visible()
 page.locator('#startMenu [data-retro-app="about"]').click();assert page.locator('.retro-window').count()==1
 page.locator('#retroReset').click();assert page.locator('.retro-window').count()==0
 page.locator('[data-view="archivo"]').click();assert page.locator('#catalog .record-card').count()==30
 page.locator('#search').fill('Cascade');assert page.locator('#catalog .record-card').count()==1
 page.locator('.record-card .card-action').click();assert page.locator('#recordDialog').is_visible()
 page.locator('#closeDialog').click()
 page.locator('[data-view="laboratorio"]').click();page.locator('#demoStart').click();page.locator('#demoReset').click()
 assert not errors,errors
 print('BROWSER OK: DOS commands, Cascade, reset, retro windows, start menu, catalog, modal, lab. Errors:',errors)
 browser.close()
server.shutdown()
