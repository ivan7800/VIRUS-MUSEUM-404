# Arquitectura técnica — Fase 1

## Objetivo
Museo educativo de malware histórico con recreaciones exclusivamente gráficas y en memoria. Prohibido introducir código malicioso real, cargas dinámicas desde Internet, propagación por la red o modificación de archivos del usuario.

## Capas
1. **UI**: `index.html` y CSS. Diseño adaptativo con navegación por fragmento `#vista`, controles reales, diálogo nativo y animaciones respetuosas con `prefers-reduced-motion`.
2. **Datos**: `data.js` exporta fichas curadas; contenido editable sin modificar la UI. Las futuras fichas contendrán bibliografía y nivel de confianza verificado.
3. **Controlador**: `app.js` conecta vistas, filtros, modal y diagnóstico ficticio. Renderizado de campos mediante `textContent`, evitando HTML no confiable.
4. **Motor futuro**: en fase 3, un módulo independiente recibirá escenarios declarativos con lista cerrada de eventos visuales sobre un **modelo ficticio de archivos/procesos/red**. Ni acceso a archivos reales ni peticiones externas.
5. **Pruebas**: smoke tests estáticos hoy; pruebas de interacción en navegadores reales en fase 9.

## Contrato de seguridad para el motor futuro
- Lista blanca estricta de efectos visuales, sin `eval`, `new Function`, scripts remotos o WebAssembly de procedencia externa.
- Ningún API de red y ninguna lectura/escritura de archivos del sistema. Los estados virtuales permanecen en memoria; guardar progreso es opcional y sin datos sensibles.
- Ejecutar/pausar/reiniciar son acciones deterministas que manipulan únicamente la escena virtual.
- Escapar texto de fichas y rechazar HTML arbitrario.
- Informar en todo momento de que se trata de una representación, no una máquina virtual ni un antivirus.

## Riesgos y mitigaciones
- **Fidelidad histórica**: revisar cada ficha contra fuentes antes del release; separar historia y efectos estilizados.
- **Confusión con malware real**: cartel permanente de entorno seguro y simulación ficticia.
- **A11y / movimiento**: preferencia de animación reducida y botón FX.
- **Compatibilidad `file://`**: servidores locales incluidos para pruebas de módulos ES.
- **Estado vs promesa**: sistemas y simulaciones etiquetados como previstos hasta implementarlos.

## Criterios de aceptación F1
- Inicio/archivo/laboratorio/sistemas/acerca navegables.
- Búsqueda por texto y filtro por época.
- Fichas accesibles y cerrables.
- Demo de diagnóstico con reset y sin APIs peligrosas.
- Diseño móvil y sin recursos externos.
- ZIP con lanzadores y documentación.


## Fase 2: entornos visuales

`assets/js/virtual.js` contiene dos maquetas aisladas del ordenador real:

- Consola DOS: listado de archivos inmutables en memoria, rutas permitidas y comandos didácticos limitados. No usa shell, subprocess, filesystem ni llamadas HTTP.
- Windows Retro: gestor de ventanas de DOM (arrastre por pointer events), sin acceso a procesos del ordenador.
- Cascade: letras animadas en la capa interna del monitor; el temporizador puede detenerse y se reinicia al resetear DOS.

Fase 3: motor de escenarios y estado de incidentes ficticios; nunca código malicioso real.


## Motor de simulación (fase 3)

`assets/js/engine.js` expone escenarios con una lista cerrada de eventos `{at,kind,message}` y la clase `SimulationEngine`. Su reloj es inyectable para tests deterministas. El estado observable (`snapshot`) incluye progreso, historial limitado al escenario, estado virtual y ciclo de vida. Las acciones no acceden a datos del host.
