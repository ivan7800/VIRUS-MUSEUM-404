# VIRUS MUSEUM 404

Museo interactivo **educativo y seguro** de la historia del malware. Incluye 30 fichas históricas, demostraciones visuales y **MuseumOS**, un escritorio ficticio con aplicaciones, investigaciones y cuatro épocas recreadas. No contiene ni ejecuta malware real.

## Qué encontrarás

- **Archivo histórico**: 30 amenazas representativas con cronología y explicaciones.
- **MuseumOS**: escritorio ficticio con Explorador, Procesos, Eventos, NetWatch, Centro de seguridad, correo, terminal y más.
- **Living History 3.5**: investigaciones de DOS (1988), Windows 98 (1999), Windows XP (2003) y centro de respuesta (2017).
- **Simulaciones con estado**: las pistas, la reproducción y las decisiones generan un informe virtual, procesos didácticos, eventos, avisos de red y señales en el Centro de seguridad.
- **Temas**: Archivo 404, Matrix Terminal, Ámbar CRT, Laboratorio Polar y Noir Violeta. Cambia el tema con el botón **🎨 SKINS**. MuseumOS tiene además cuatro apariencias de época.
- **Sin servidor de datos**: HTML, CSS y módulos JavaScript locales, sin cuentas, telemetría ni peticiones a servicios externos.

### Jugar una investigación

1. Entra en **MuseumOS 404**, elige una época y enciende el ordenador virtual.
2. Abre el **Panel del incidente** desde la parte superior derecha del escritorio.
3. Usa **Reproducir / Pausar / Paso siguiente / Reiniciar** para inspeccionar la escena.
4. Abre las **tres pistas** de la investigación histórica y toma una decisión.
5. Abre **Archivos**, **Procesos**, **NetWatch**, **Eventos** o **Seguridad** para ver el resultado *exclusivamente simulado*. El informe generado es de solo lectura. **Restaurar** vuelve al estado limpio.

Las investigaciones usan datos inventados con fines didácticos, y sus resultados no equivalen a análisis reales de malware o redes.

## Ejecutar localmente

Python 3 es suficiente. El servidor escucha solo en `127.0.0.1` y utiliza un puerto libre.

- **Windows:** doble clic en `INICIAR-WINDOWS.bat`.
- **Linux Mint:** ejecuta `bash INICIAR-LINUX.sh`.
- Alternativamente: `python3 servidor.py`.

El inicio directo mediante `file://` puede estar limitado por los módulos ES; utiliza el servidor si el navegador los bloquea.

## GitHub Pages

La web se publica desde **Settings → Pages → Deploy from a branch → main → /(root)**. El flujo automático de GitHub, **pages build and deployment**, publica la web.

**QA es independiente del despliegue**: el workflow `.github/workflows/pages.yml` comprueba sintaxis, tests de lógica e integración con Chromium, pero no duplica el proceso de publicación. Se puede consultar en la pestaña **Actions**.

## Pruebas

Con Node.js 22+ y Python 3:

```bash
for file in assets/js/*.js; do node --check "$file" || exit 1; done
for test in tests/*.mjs; do node "$test" || exit 1; done
python3 -m py_compile servidor.py tests/*.py
python3 tests/repository_integrity.py
```

Pruebas end-to-end opcionales (necesitan Playwright y Chromium):

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
python3 tests/browser_http_smoke.py
```

Las pruebas de navegador usan HTTP local y comprueban navegación, skins, cuatro épocas, cambios en MuseumOS, restauración y vista móvil.

## Seguridad y privacidad

- Todos los archivos, procesos, alertas, redes y adjuntos del escritorio son representaciones internas.
- No se accede al sistema de archivos real, no se ejecutan comandos del host ni hay propagación o llamadas externas.
- El progreso y las preferencias se almacenan localmente en el navegador. No se envían datos a servidores.
- No es un antivirus ni una máquina virtual ejecutando sistemas operativos reales.

## Estructura

- `index.html`: entrada para GitHub Pages.
- `assets/css/styles.css`: estilos y temas.
- `assets/js/museum-os.js`: escritorio virtual y sus aplicaciones.
- `assets/js/era-experience.js`: investigaciones.
- `assets/js/era-incidents.js`: escenas ilustrativas.
- `assets/js/era-state.js`: estado virtual didáctico.
- `assets/js/skins.js`: selector de temas.
- `tests/`: pruebas unitarias, regresión e integración.
- `docs/`: diseño y auditorías.

## Licencia

MIT, consulta [LICENSE](LICENSE).
