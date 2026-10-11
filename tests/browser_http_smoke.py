"""End-to-end Chromium smoke: navigation, skins, historical cases and MuseumOS."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import re
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_port}/"
try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1366, "height": 850})
        failures = []
        page.on("pageerror", lambda error: failures.append(str(error)))
        response = page.goto(url, wait_until="networkidle")
        assert response and response.status == 200, "index.html did not load"
        for section in ("archivo", "laboratorio", "sistema", "campana", "museumos"):
            page.locator(f'[data-view="{section}"]').first.click()
            # Hash navigation is async; wait for the DOM state instead of racing hashchange.
            expect(page.locator(f"#view-{section}")).to_have_class(re.compile(r"\bvisible\b"), timeout=5000)
        page.locator("#openSkinPanel").click()
        expect(page.locator("#openSkinPanel")).to_have_attribute("aria-expanded", "true")
        page.locator("#vmSkin").select_option("matrix")
        expect(page.locator("html")).to_have_attribute("data-vm-skin", "matrix")
        page.locator("#mosPower").click()
        expect(page.locator("#mosBoot")).to_be_visible()
        page.locator("#mosContinue").click()
        page.locator("#mosEnter").click()
        expect(page.locator("#mosWork")).to_be_visible()
        page.locator("#mosEra").select_option("modern")
        expect(page.locator("#eraExperience")).to_contain_text("2017")
        next_button = page.locator(".era-incident-console .era-incident-controls button").nth(2)
        next_button.click()
        next_button.click()
        expect(page.locator(".era-state-panel")).to_contain_text("Archivos ficticios bloqueados")
        page.locator("#mosStart").click()
        page.locator('#mosStartMenu [data-mos-app="files"]').click()
        files = page.locator('.mos-window[data-app="files"]')
        expect(files).to_contain_text("INCIDENTE-HISTORICO-404.txt")
        page.locator("#mosStart").click()
        page.locator('#mosStartMenu [data-mos-app="tasks"]').click()
        expect(page.locator('.mos-window[data-app="tasks"]')).to_contain_text("history.modern.demo")
        for clue in page.locator("#eraExperience .era-tab").all():
            clue.click()
        page.locator("#eraExperience .era-decision").first.click()
        expect(page.locator(".era-state-panel")).to_contain_text("Contenida")
        page.locator("#mosStart").click()
        page.locator('#mosStartMenu [data-mos-app="security"]').click()
        expect(page.locator('.mos-window[data-app="security"]')).to_contain_text("Contenida")
        page.locator("#mosEra").select_option("dos")
        expect(page.locator("#eraExperience")).to_contain_text("1988")
        expect(page.locator("#museumOS")).to_have_class(re.compile(r"\bmos-dos\b"))
        expect(page.locator(".era-state-panel")).to_contain_text("Íntegros")
        page.locator("#mosReset").click()
        expect(page.locator(".era-state-panel")).to_contain_text("Íntegros")
        expect(page.locator(".mos-window")).to_have_count(0)
        page.set_viewport_size({"width": 390, "height": 844})
        page.reload(wait_until="networkidle")
        expect(page.locator("html")).to_have_attribute("data-vm-skin", "matrix")
        expect(page.locator("#openSkinPanel")).to_be_visible()
        assert not failures, "Uncaught browser errors: " + "; ".join(failures)
        browser.close()
    print("PASS Chromium: navigation, skins, 4-era selectors, virtual files/tasks/security, reset, mobile")
finally:
    server.shutdown()
    server.server_close()
