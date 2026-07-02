# Guión de defensa — Sistema CAA
## TFG · Ingeniería Informática

> **Duración total:** 15 minutos de presentación + preguntas del tribunal.
> Este guión está pensado para leerse en voz alta durante los ensayos. El tiempo indicado en cada sección es orientativo; practica con un cronómetro.

---

## SECCIÓN 1 — Puesta en contexto
### ⏱ 3 minutos · Elemento clave: Modelo del dominio

---

**[Abre el repositorio. Navega a la sección "Contexto" del README. Ten el diagrama de entidades visible.]**

Buenos días. Voy a presentar el sistema CAA: un sistema web para la complementación de la logopedia en el entorno familiar.

El punto de partida es este: el desarrollo del lenguaje en la infancia es uno de los hitos más determinantes para la integración social y el aprendizaje. Existe una parte significativa de la población infantil —niños con TEA, discapacidades intelectuales u otras alteraciones del desarrollo— que requiere atención logopédica continuada.

El problema concreto que aborda este proyecto es la **discontinuidad** entre la consulta y el hogar. Las sesiones clínicas tienen una duración y frecuencia limitadas, y los aprendizajes no se consolidan si no se refuerzan en el día a día. Esta discontinuidad tiene dos caras:

- El **logopeda** carece de herramientas para diseñar actividades estructuradas, asignarlas a sus pacientes y hacer un seguimiento real de lo que ocurre fuera de consulta.
- Las **familias** no tienen un canal claro para recibir esas actividades, registrar la práctica y compartir el progreso con el profesional.

**[Señala el diagrama de entidades.]**

Las entidades principales del dominio son: el **Paciente**, la **Actividad** terapéutica, la **Sesión** de práctica, la **AsignacionActividad** que conecta ambas, y el **RegistroClínico** donde el logopeda documenta la evolución. Sobre estas entidades giran todos los casos de uso del sistema.

---

## SECCIÓN 2 — Requisitos
### ⏱ 2 minutos · Elemento clave: Actores, casos de uso y diagrama de contexto

---

**[Navega a la sección "Requisitos" del README. Muestra el diagrama de actores.]**

El sistema tiene dos actores principales: el **Logopeda** y la **Familia**. Hay un tercer actor, el **Usuario no autenticado**, cuyo único caso de uso es el acceso al sistema mediante login.

**[Muestra los diagramas de casos de uso del Logopeda.]**

El logopeda gestiona el ciclo de vida completo de las actividades: las crea, las publica, las asigna a pacientes y puede recomendar cómo practicarlas en casa. También registra sesiones presenciales y consulta el progreso del paciente.

**[Muestra los diagramas de casos de uso de la Familia.]**

La familia recibe las actividades asignadas, las practica con el paciente en casa registrando aciertos y errores, y puede consultar los registros del logopeda y la evolución del paciente.

**[Muestra el diagrama de contexto.]**

El diagrama de contexto delimita los límites del sistema: qué entra, qué sale y qué actores interactúan con él. El sistema actúa como intermediario entre el logopeda y la familia, eliminando la dependencia del teléfono o el papel como canal de comunicación.

---

## SECCIÓN 3 — Detalle de casos de uso representativos
### ⏱ 3 minutos · Elemento clave: Cascada completa de uno o dos CdU

---

**[Navega a la sección "Detalle de casos de uso" del README.]**

He seleccionado dos casos de uso que representan bien la complejidad del sistema: **CdU-03 Realizar Actividad** y **CdU-05 Registrar Sesión**. Los elijo porque uno pertenece al flujo de la familia y el otro al del logopeda, y juntos cubren el ciclo completo de la herramienta.

### CdU-03 — Realizar Actividad *(~90 segundos)*

**[Muestra el diagrama detallado del CdU-03.]**

La familia inicia una sesión de práctica seleccionando una actividad asignada. El sistema crea la sesión, la familia registra cada respuesta del paciente como acierto o error, y al finalizar el sistema calcula el porcentaje de aciertos y marca la asignación como completada.

**[Muestra el prototipo de interfaz.]**

Así se ve en la interfaz: el paciente se identifica mediante un código de acceso corto —formato PAC-XXXX— que el logopeda le proporciona. La familia va registrando cada apartado de la actividad con dos botones: acierto o error. Al terminar el último apartado, el sistema redirige automáticamente a la pantalla de resultado.

**[Muestra el diagrama MVC de análisis.]**

En el análisis, este caso de uso involucra a `PracticaController`, que coordina tres operaciones en secuencia: crear sesión, registrar respuesta y finalizar sesión. Al finalizar, también actualiza el estado de la asignación a COMPLETADA.

**[Muestra el diagrama de secuencia.]**

El diagrama de secuencia muestra esa orquestación: la vista llama al controlador, el controlador opera sobre el modelo `Sesion` y sobre `AsignacionActividad`, y devuelve el porcentaje de aciertos calculado por el propio modelo —aplicando el Patrón Experto en Información.

---

### CdU-05 — Registrar Sesión *(~90 segundos)*

**[Muestra el diagrama detallado del CdU-05.]**

El logopeda registra a posteriori una sesión presencial: selecciona el paciente, introduce la fecha, tipo, aciertos, errores y notas. La sesión se guarda directamente con estado FINALIZADA porque se registra después de realizarse, no en tiempo real.

**[Muestra el prototipo de interfaz.]**

**[Muestra el diagrama MVC y de secuencia.]**

Este caso de uso ilustra la separación de responsabilidades: `SesionController` solo gestiona sesiones del logopeda. Las sesiones de práctica de la familia tienen su propio controlador —`PracticaController`— con una razón de cambio completamente distinta. Esto es la aplicación del principio de Responsabilidad Única.

---

## SECCIÓN 4 — Demostración de la solución
### ⏱ 5 minutos · Elemento clave: Sistema funcionando

---

**[Abre el navegador con el sistema corriendo. Ten los datos de prueba preparados de antemano.]**

Voy a mostrar el sistema en funcionamiento recorriendo el mismo flujo que acabo de explicar.

**Flujo logopeda *(~2 min 30 s):***

1. **[Login como logopeda]** — `logopeda@caa.es`
2. **[Dashboard]** — señala brevemente los módulos disponibles.
3. **[Pacientes]** — muestra el listado. Señala el **código de acceso** `PAC-XXXX` en la columna. *"Este es el código que el logopeda comparte con la familia. Evita exponer el identificador interno de la base de datos."*
4. **[Actividades]** — muestra una actividad DISPONIBLE. Abre el modal de asignación, asigna al paciente de prueba. Muestra el toast de confirmación.
5. **[Registros]** — crea una recomendación vinculada a la actividad. *"Este registro de tipo RECOMENDACION es el que la familia verá en su panel con instrucciones de cómo practicar."*
6. **[Cierre sesión logopeda.]**

**Flujo familia *(~2 min 30 s):***

1. **[Login como familia]** — `familia@caa.es`
2. **[Dashboard familia]** — introduce el código PAC-XXXX. Se muestra el banner con el nombre del paciente.
3. **[Actividades recomendadas]** — muestra la actividad asignada con estado PENDIENTE. Muestra también la recomendación del logopeda.
4. **[Realizar actividad]** — pulsa "Practicar". Recorre los apartados registrando aciertos y errores. Al terminar el último apartado, el sistema redirige automáticamente.
5. **[Resultado]** — muestra el porcentaje de aciertos y el mensaje adaptativo.
6. **[Progreso]** — muestra las métricas actualizadas: sesión finalizada, actividad completada, gráfico de evolución.

---

## SECCIÓN 5 — Conclusiones
### ⏱ 2 minutos · Elemento clave: Objetivos cumplidos y líneas futuras

---

**[Vuelve al README, sección "Conclusiones".]**

Para cerrar, el sistema logra cubrir la necesidad que planteaba el problema inicial:

- El logopeda tiene una herramienta para **diseñar, publicar y asignar actividades** estructuradas y hacer seguimiento real de su práctica en casa.
- La familia tiene un canal claro para **recibir, practicar y registrar** esas actividades, y consultar la evolución del paciente.
- El sistema ha sido **probado con un profesional logopeda**, cuyo feedback fue determinante. Entre otras cosas, señaló la posibilidad de realizar **sesiones telemáticas** a través de la plataforma, lo que abre una línea de trabajo futura muy relevante que implicaría incorporar comunicación en tiempo real mediante WebSockets.

Desde el punto de vista técnico, el diseño modular permite **escalar el sistema** sin modificar componentes existentes: añadir un nuevo tipo de actividad implica únicamente crear una nueva clase de estrategia y registrarla, sin tocar ningún controlador. Esto es la aplicación práctica del principio Abierto/Cerrado.

El sistema queda como base funcional y bien estructurada sobre la que construir las líneas de trabajo futuro identificadas: sesiones telemáticas, aplicación móvil, banco de pictogramas integrado con ARASAAC y notificaciones push.

Muchas gracias.

---

## NOTAS DE ENSAYO

### Lista de comprobación técnica antes de la defensa

- [ ] El servidor está corriendo (`npm run dev` en la carpeta del proyecto)
- [ ] MongoDB Atlas accesible (verificar conexión en la terminal)
- [ ] Usuarios de prueba creados (`node seed.js`)
- [ ] Datos de prueba listos: al menos un paciente, una actividad DISPONIBLE asignada y una recomendación
- [ ] El navegador tiene las pestañas pre-abiertas en el orden de la demostración
- [ ] El README está abierto en el repositorio (GitHub o local)
- [ ] Los diagramas de los CdU-03 y CdU-05 están localizados en el repositorio

### Plan de contingencia

Si el servidor falla durante la demostración:
> *"Tengo capturas de pantalla del sistema en funcionamiento."* → Ten el documento `DESCRIPCION-SOLUCION.md` abierto con las capturas.

Si MongoDB Atlas no conecta:
> Abre MongoDB Atlas en el navegador, ve a Network Access y verifica que tu IP está permitida. Ten la IP añadida de antemano.

### Tiempos de ensayo

| Ensayo | Fecha | Tiempo total | Sección más larga | Notas |
|--------|-------|-------------|------------------|-------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Frases de transición entre secciones

- *Del contexto a los requisitos:* "Una vez entendido el problema, veamos cómo lo hemos delimitado formalmente."
- *De los requisitos al detalle:* "Sobre estos casos de uso, voy a profundizar en los dos que mejor representan la complejidad del sistema."
- *Del detalle a la demo:* "Y ahora vamos a ver todo esto funcionando."
- *De la demo a conclusiones:* "Para cerrar, conectemos lo que acabamos de ver con los objetivos que planteábamos al inicio."
