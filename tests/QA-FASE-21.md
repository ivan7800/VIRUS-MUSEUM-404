# Auditoría de controles — MuseumOS v2.1.3

## Defectos corregidos

- Menú Inicio con z-index fijo inferior al de ventanas abiertas: después de varias ventanas, el menú quedaba cubierto y los clics fallaban. Se eleva sobre las ventanas al abrirlo.
- Se abrían varias instancias de la misma aplicación sin control: ahora se enfoca la instancia ya abierta.
- Apagado no limpiaba el gestor de ventanas ni las entradas de la barra de tareas: ahora las retira.
- Restauración no cerraba el menú Inicio ni ocultaba el panel de cronología: normaliza ambos estados.
- El filtrado del Explorador se perdía al actualizar el contenido: ahora se mantiene hasta cambiar de carpeta o restaurar.
- Algunas aplicaciones estaban siendo redibujadas durante la actualización del incidente, perdiendo campos introducidos: no se redibujan automáticamente Terminal, Agenda y navegador sin necesidad.

## Pruebas reales ejecutadas

En Chromium, con carga HTML/CSS/JS en memoria y almacenamiento local simulado:
- Encender, continuar BIOS e iniciar sesión.
- Abrir, desde el menú Inicio y en secuencia, estas 14 aplicaciones: Explorador, Bloc de notas, Correo, MuseumNet, Agenda, Terminal, Procesos, NetWatch, Eventos, Seguridad, Papelera, Panel de control, Copias y Misiones.
- Volver a abrir el Explorador: conserva una sola instancia.
- Restaurar estado inicial: todas las ventanas se cierran; Explorador puede abrirse nuevamente.
- Cero excepciones JavaScript durante el recorrido.

## Límites

No equivale a una auditoría exhaustiva de cada botón secundario ni prueba todos los escenarios temporizados. El entorno bloquea navegar directamente a URL locales incluso con Playwright, por eso se valida una carga en memoria. Se requiere una prueba en Windows y Linux Mint desde sus lanzadores antes de publicar.
