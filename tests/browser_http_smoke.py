"""Real HTTP browser smoke test, intended for CI and local Playwright."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
url = f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1366, 'height': 768})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        response = page.goto(url, wait_until='networkidle')
        assert response and response.status == 200, 'Home failed to load'
        assert page.locator('[data-view="archivo"]').count() > 0, 'Archive navigation missing'
        for section in ('archivo', 'laboratorio', 'sistema', 'museumos', 'campana'):
            nav = page.locator(f'[data-view="{section}"]').first
            assert nav.count(), f'Missing {section} menu'
            nav.click()
            assert 'visible' in (page.locator(f'#view-{section}').get_attribute('class') or ''), f'{section} not shown'
        page.set_viewport_size({'width': 390, 'height': 844})
        page.reload(wait_until='networkidle')
        assert page.locator('body').count() == 1
        assert not errors, 'Browser JS errors: ' + '; '.join(errors)
        browser.close()
    print('PASS HTTP Chrome smoke + five navigation views + mobile reload')
finally:
    server.shutdown()
    server.server_close()
