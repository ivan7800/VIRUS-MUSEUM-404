"""Simple static integrity checks for VIRUS MUSEUM 404. No external dependencies."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / 'index.html').read_text(encoding='utf-8')
missing = []
for attr in ('src', 'href'):
    for raw in re.findall(r'\b' + attr + r'\s*=\s*["\']([^"\']+)["\']', html):
        if raw.startswith(('http:', 'https:', '//', '#', 'data:', 'mailto:', 'javascript:')):
            continue
        path = raw.split('?', 1)[0].split('#', 1)[0]
        if not path or path == '/':
            continue
        if path.startswith('/') or not (ROOT / path).is_file():
            missing.append(f'{attr}={raw}')
assert not missing, 'Missing or root-absolute HTML assets: ' + ', '.join(missing)
for required in ('assets/js/app.js','assets/js/museum-os.js','assets/js/engine.js','assets/js/data.js','assets/css/styles.css'):
    assert (ROOT / required).is_file(), f'Missing {required}'
assert 'type="module"' in html, 'Expected ES module entry point'
print('PASS repository asset integrity')
