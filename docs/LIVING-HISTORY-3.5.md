# Living History 3.5 — integración y verificación

## Cambios

- Sincronización de eventos educativos entre las escenas, decisiones y MuseumOS.
- Archivos virtuales: `C:/Users/Operator/Documents/INCIDENTE-HISTORICO-404.txt` es un informe ficticio y de solo lectura.
- Procesos: el proceso ficticio PID 4404 solo aparece al recrear una anomalía; se elimina al contener o restaurar.
- Visor de eventos: registro de decisiones y eventos simulado.
- Centro de seguridad y NetWatch: muestran un resumen de la época y fase del caso sin confundir el estado con amenazas reales.
- Drawer plegable para no bloquear los iconos o la barra de tareas.
- Reiniciar escenario, cambiar de época o restaurar MuseumOS limpia su estado temporal; los expedientes completados siguen almacenados localmente.
- Corrección del cambio de época cuando se selecciona desde Configuración de MuseumOS.

## Criterios de aceptación

1. El `index.html` carga con código de estado 200 en localhost.
2. El cambio entre secciones espera `hashchange` (no es instantáneo).
3. El botón SKINS cambia la apariencia y la guarda para la siguiente carga.
4. Al cambiar una época aparecen sus pistas correctas.
5. DOS, Windows 98, XP y SOC disponen de escenas diferenciadas.
6. La escena permite pausa, avance y reinicio sin desbordar procesos o registros.
7. Tras dos pasos de un escenario de 2017, el archivo de informe aparece y el proceso histórico se ve en Tareas.
8. Resolver el caso modifica el estado y muestra la contención en Seguridad.
9. Restaurar devuelve el estado temporal a limpio.
10. Chromium no informa errores JavaScript inesperados y el acceso a SKINS sigue visible en móvil.

## Despliegue

GitHub Pages usa la publicación nativa desde `main`. La acción QA no es el motor de publicación: las pruebas pueden fallar sin bloquear el sitio público y un fallo de QA debe investigarse antes de declarar la release validada.

## Límites

Los historiales del escritorio son ficticios y no intentan reproducir internamente vulnerabilidades reales. La verificación automatizada no reemplaza pruebas visuales manuales en navegadores, sistemas operativos y dispositivos físicos.
