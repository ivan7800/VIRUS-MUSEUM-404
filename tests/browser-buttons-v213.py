"""Compatibility launcher: runs the maintained HTTP Chromium interaction suite."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name("browser_http_smoke.py")),run_name="__main__")
