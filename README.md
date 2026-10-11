# VIRUS MUSEUM 404

Museo web interactivo sobre la historia del malware, con fichas históricas, simulaciones visuales y un escritorio ficticio para aprender conceptos de seguridad. **No incluye malware real ni ejecuta acciones sobre el equipo.**

Aplicación estática HTML, CSS y JavaScript, sin backend, cuentas, telemetría ni recursos remotos necesarios. Puede ejecutarse localmente o publicarse gratis con GitHub Pages.

## Ejecutar en local

Necesitas Python 3. El servidor escucha únicamente en `127.0.0.1` y usa un puerto libre.

- **Windows:** doble clic en `INICIAR-WINDOWS.bat`.
- **Linux Mint:** ejecuta `bash INICIAR-LINUX.sh` desde la carpeta extraída.

También puedes abrir `index.html` en un navegador moderno. Si el navegador limita módulos JavaScript en `file://`, usa uno de los lanzadores.

## Publicar en GitHub Pages

El repositorio incluye un flujo de GitHub Actions que ejecuta las pruebas Node.js y publica el contenido estático al hacer push a `main`.

1. Crea un repositorio en GitHub y sube el contenido de esta carpeta a la rama `main`.
2. En el repositorio abre **Settings → Pages** y selecciona **GitHub Actions** como origen de publicación.
3. Abre **Actions** y comprueba que el flujo **Deploy to GitHub Pages** termina correctamente.
4. Usa la URL que aparece en el entorno `github-pages` del flujo o en **Settings → Pages**.

Si la rama principal de tu repositorio no se llama `main`, cambia el nombre en `.github/workflows/pages.yml` antes de subirlo. Las rutas a CSS y JavaScript son relativas, por lo que funcionan bajo la subruta habitual de un proyecto en Pages.

## Pruebas

Requieren Node.js y Python 3. Desde la carpeta del proyecto:

```bash
for t in tests/*.mjs; do node "$t" || exit 1; done
python3 -m py_compile servidor.py tests/*.py
node --check assets/js/museum-os.js
node --check assets/js/app.js
```

La suite interactiva opcional necesita Playwright y Chromium:

```bash
python3 tests/browser-buttons-v213.py
```

El flujo de Actions ejecuta las pruebas lógicas y sintácticas. La prueba de navegador y las pruebas manuales en Windows/Linux se ejecutan aparte.

## Privacidad y seguridad

- Las amenazas, procesos, archivos, red y ventanas de MuseumOS son datos ficticios en memoria.
- No contiene muestras, exploits, ejecución de comandos del sistema, conexiones remotas ni envío de correos.
- Las notas y preferencias no se envían a servidores.
- El servidor local se limita a `127.0.0.1`; GitHub Pages sirve únicamente los archivos estáticos.

## Estructura

- `index.html`: punto de entrada.
- `assets/`: JavaScript y estilos.
- `tests/`: pruebas lógicas y herramientas de QA.
- `docs/`: arquitectura y auditorías.
- `.github/workflows/pages.yml`: pruebas y despliegue de Pages.

Consulta [CHANGELOG.md](CHANGELOG.md) y [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

## Licencia

MIT. Consulta [LICENSE](LICENSE).
