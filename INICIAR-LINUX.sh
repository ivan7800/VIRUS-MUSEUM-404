#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$(readlink -f -- "$0")")"
if ! command -v python3 >/dev/null 2>&1; then
  echo 'ERROR: Instala Python 3 (sudo apt install python3)' >&2
  read -r -p 'Pulsa Intro para cerrar...' _ || true
  exit 1
fi
exec python3 "$(pwd)/servidor.py"
