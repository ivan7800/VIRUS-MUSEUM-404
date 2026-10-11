#!/usr/bin/env python3
"""Servidor local seguro para VIRUS MUSEUM 404, sin dependencias externas."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import threading
import webbrowser

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, max-age=0')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

def main():
    index = ROOT / 'index.html'
    if not index.is_file():
        print(f'ERROR: index.html no existe en {ROOT}', file=sys.stderr)
        return 1
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    except OSError as exc:
        print(f'ERROR: No se puede arrancar servidor: {exc}', file=sys.stderr)
        return 1
    url = f'http://127.0.0.1:{server.server_port}/'
    print(f'VIRUS MUSEUM 404: {url}', flush=True)
    print(f'Carpeta publicada: {ROOT}', flush=True)
    print('Para detener: Ctrl+C. Deja esta ventana abierta mientras juegas.', flush=True)
    threading.Timer(0.35, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServidor detenido.')
    finally:
        server.server_close()
    return 0

if __name__ == '__main__':
    sys.exit(main())
