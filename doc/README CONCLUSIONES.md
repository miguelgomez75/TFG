# Conclusiones, Discusión y Futuras Líneas de Actuación

---

## 1. Conclusiones

El presente Trabajo de Fin de Grado ha dado como resultado el diseño e implementación de un sistema web de apoyo a la terapia de Comunicación Aumentativa y Alternativa (CAA), orientado a facilitar la coordinación entre el logopeda y el entorno familiar del paciente. El desarrollo se ha articulado en torno a los objetivos planteados al inicio del proyecto: en la fase de requisitos se identificaron y documentaron las necesidades funcionales del logopeda y la familia a partir de consultas directas con la profesional responsable del caso, cubriendo así el objetivo (i); en la fase de análisis se definió la arquitectura del software y de la interfaz, priorizando la separación de roles entre logopeda y familia, la accesibilidad y la comunicación mediante pictogramas, dando respuesta al objetivo (ii); y en la fase de diseño se concretó la implementación del producto mínimo viable, integrando la gestión y realización de actividades junto con el módulo de seguimiento del progreso, completando el objetivo (iii). A lo largo del proyecto se han aplicado de forma integrada los conocimientos adquiridos durante la carrera —análisis y diseño de sistemas, ingeniería del software, bases de datos y desarrollo web— y los adquiridos durante el periodo de beca, donde la exposición a entornos de desarrollo reales aportó una perspectiva práctica difícilmente alcanzable en el aula.

El sistema desarrollado cubre los seis casos de uso principales identificados en la fase de requisitos: asignar actividades, publicar actividades, realizar actividades, recomendar actividades, registrar sesiones y consultar el progreso del paciente. Estos casos de uso no son abstracciones académicas, sino flujos de trabajo directamente extraídos de la práctica clínica, lo que dota al sistema de una utilidad real desde el primer momento de uso.

Desde el punto de vista técnico, la solución ha permitido poner en práctica el proceso RUP como marco metodológico, recorriendo sus fases de análisis, diseño e implementación de forma ordenada. La aplicación de los principios SOLID ha resultado especialmente valiosa: el sistema es extensible sin necesidad de modificar código existente —añadir un nuevo tipo de actividad no toca ningún controlador— y los canales de notificación son intercambiables sin afectar a la lógica de negocio. Estos no son logros menores en un proyecto de esta escala; demuestran que los principios de diseño orientado a objetos tienen impacto tangible incluso en sistemas de tamaño moderado.

La experiencia de probar la solución con un usuario real —en este caso un profesional logopeda— ha sido uno de los aprendizajes más significativos del proyecto. La validación con usuario puso de manifiesto que la comprensión de un sistema por parte del desarrollador y la comprensión del mismo sistema por parte del usuario final son cosas distintas, y que el diseño de interfaces debe partir de los flujos de trabajo reales del usuario, no de la comodidad técnica del desarrollador.

En definitiva, el proyecto ha conseguido su objetivo principal: desarrollar una herramienta funcional, estructuralmente sólida y con potencial de crecimiento, que da respuesta a una necesidad real en el ámbito terapéutico.

---

## 2. Discusión de resultados

### 2.1 Valoración del proceso de desarrollo

El desarrollo del proyecto no estuvo exento de dificultades. El cambio de tutor a mediados del proyecto supuso una discontinuidad significativa en la dirección del trabajo: las decisiones de diseño tomadas durante la primera etapa debieron ser revisadas y en algunos casos reformuladas para alinearse con los nuevos criterios y el enfoque metodológico del nuevo tutor. Este hecho, aunque supuso un coste en tiempo y esfuerzo, tuvo también una consecuencia positiva no prevista: obligó a revisar en profundidad las decisiones ya tomadas, lo que llevó a identificar y corregir problemas de diseño que de otro modo habrían permanecido ocultos hasta fases más tardías.

La transición entre la versión V3 —centrada en los principios SOLID— y la versión V4 —alineada con los diagramas RUP— es un ejemplo concreto de este proceso: la refactorización no fue únicamente cosmética, sino que implicó renombrar entidades, añadir controladores que faltaban, corregir colisiones de rutas y proteger el sistema frente a estados inconsistentes. El resultado final es un sistema más robusto precisamente porque fue cuestionado a mitad de camino.

### 2.2 Validación con usuario

La prueba con un usuario real aportó información que ningún análisis de requisitos habría podido anticipar. En particular, el logopeda participante señaló la posibilidad de utilizar el sistema no solo como herramienta de apoyo entre sesiones presenciales, sino como plataforma para la realización de sesiones telemáticas. Esta observación abre una dimensión del sistema que no estaba contemplada en el diseño inicial: la sesión de práctica, hasta ese momento concebida como una actividad que la familia realiza de forma autónoma en casa, podría convertirse en un espacio de interacción en tiempo real entre logopeda y paciente a través de la plataforma.

Este hallazgo es relevante porque no requiere rediseñar el sistema desde cero, sino añadir sobre una base ya sólida, lo que valida retroactivamente las decisiones de diseño tomadas: la separación de actores, la segregación de rutas y la arquitectura orientada a casos de uso son precisamente los elementos que hacen viable esa extensión.

### 2.3 Utilidad de los conocimientos adquiridos

El proyecto ha funcionado como punto de síntesis de conocimientos procedentes de dos fuentes complementarias. Por un lado, los conocimientos adquiridos en la carrera —especialmente en las asignaturas de Análisis y Diseño de Sistemas, Ingeniería del Software y Bases de Datos— proporcionaron el marco metodológico y los patrones de diseño que estructuran la solución. Por otro lado, la experiencia adquirida durante la beca aportó el criterio práctico para tomar decisiones de implementación: qué tecnologías son adecuadas para el problema, cómo organizar el código para que sea mantenible por otras personas, y cómo anticipar los problemas que surgen al llevar un diseño a producción.

La combinación de ambas fuentes ha resultado más valiosa que cualquiera de ellas por separado. El diseño sin la práctica tiende a producir sistemas elegantes pero frágiles ante la realidad; la práctica sin el diseño tiende a producir sistemas funcionales pero difícilmente mantenibles. Este proyecto ha sido la oportunidad de integrar ambas perspectivas en un producto concreto.

---

## 3. Recomendaciones

A partir de la experiencia acumulada durante el desarrollo y la validación del sistema, se plantean las siguientes recomendaciones para cualquier proyecto que tome esta solución como punto de partida o que afronte un desarrollo de naturaleza similar:

**Involucrar al usuario clínico desde el análisis de requisitos.** La validación tardía con el logopeda reveló necesidades que un análisis más temprano y participativo habría incorporado desde el principio. En sistemas con un dominio especializado —salud, educación, derecho— el usuario experto en el dominio no puede ser un validador al final del proceso; debe ser un colaborador durante el análisis.

**Mantener la trazabilidad entre requisitos, diagramas y código.** Uno de los beneficios concretos del enfoque RUP aplicado en este proyecto fue la posibilidad de rastrear cada endpoint del sistema hasta el caso de uso que lo motivó, y cada caso de uso hasta el requisito que lo originó. Esta trazabilidad facilita enormemente la gestión del cambio, como se demostró durante la refactorización posterior al cambio de tutor.

**No subestimar el coste de un cambio de dirección a mitad del proyecto.** El cambio de tutor es un ejemplo de un cambio de contexto que el equipo de desarrollo no puede controlar. La recomendación no es evitarlos —a menudo son inevitables— sino gestionarlos con una revisión formal que identifique explícitamente qué decisiones anteriores siguen siendo válidas y cuáles necesitan ser revisadas, en lugar de asumir que todo lo hecho está bien o que todo debe rehacerse.

**Documentar las decisiones de diseño, no solo el diseño resultante.** Los diagramas y el README describen qué se construyó. Igual de valioso, y mucho menos frecuente, es documentar por qué se tomaron ciertas decisiones: qué alternativas se consideraron y por qué se descartaron. Esta documentación es la que más valor aporta a quien mantiene o extiende el sistema en el futuro.

---

## 4. Futuras Líneas de Actuación

El estado actual del sistema constituye una base funcional y estructuralmente sólida sobre la que es posible crecer de forma ordenada. Las siguientes líneas de actuación se plantean en orden aproximado de prioridad e impacto:

### 4.1 Sesiones telemáticas en tiempo real

La observación realizada por el logopeda durante la validación abre la línea de mayor impacto inmediato. La incorporación de **comunicación en tiempo real** mediante WebSockets o WebRTC permitiría que el logopeda y el paciente realizaran una sesión de forma conjunta y sincrónica a través de la plataforma, con el logopeda guiando la actividad en vivo. Esta funcionalidad transformaría el sistema de una herramienta de seguimiento asíncrono a una plataforma de intervención terapéutica directa, con un potencial de impacto clínico considerablemente mayor.

### 4.2 Aplicación móvil nativa

La familia practica las actividades en casa, con frecuencia desde un teléfono móvil. Una aplicación nativa para iOS y Android —o una Progressive Web App (PWA)— mejoraría significativamente la experiencia de uso en dispositivos táctiles, que es precisamente el contexto en el que los pacientes con dificultades de comunicación interactúan con más naturalidad con la tecnología.

### 4.3 Banco de pictogramas integrado

Actualmente el contenido de las actividades de tipo PICTOGRAMA se introduce manualmente mediante URL. La integración con un banco de pictogramas estándar como **ARASAAC** (Centro Aragonés para la Comunicación Aumentativa y Alternativa) permitiría al logopeda buscar y seleccionar pictogramas directamente desde la plataforma, reduciendo el tiempo de creación de actividades y garantizando el uso de materiales validados clínicamente.

### 4.4 Sistema de notificaciones push

El sistema ya tiene una abstracción de notificaciones (`INotificador`) diseñada específicamente para ser extensible. El siguiente paso natural es implementar `NotificadorPush` para enviar notificaciones al dispositivo de la familia cuando el logopeda publica un nuevo registro o asigna una actividad. El coste de implementación es bajo gracias a la arquitectura existente; el impacto en la adherencia al tratamiento puede ser significativo.

### 4.5 Analítica avanzada del progreso

Las métricas actuales —promedio de aciertos y evolución por sesión— son un punto de partida. Una línea de evolución natural es incorporar análisis de tendencias, detección de estancamientos y comparativas entre periodos. En un horizonte más ambicioso, la incorporación de técnicas de aprendizaje automático podría permitir al sistema sugerir actividades adaptadas al ritmo de progreso individual de cada paciente.

### 4.6 Multitenancy y gestión de centros

El sistema está diseñado actualmente para un logopeda individual. Una evolución natural para su uso en centros terapéuticos sería la incorporación de una capa de gestión de organizaciones que permita a varios logopedas trabajar en el mismo sistema con sus respectivos pacientes, con roles de administrador de centro y control de acceso entre profesionales.

### 4.7 Accesibilidad

Por su naturaleza, el sistema CAA debe ser accesible para usuarios con diversas capacidades. La adecuación a los estándares **WCAG 2.1** (niveles A y AA), la optimización para lectores de pantalla y el soporte para navegación por teclado son líneas de trabajo que deben abordarse antes de cualquier despliegue en un entorno clínico real.

---

*El conjunto de estas líneas de actuación dibuja una hoja de ruta coherente que parte de un sistema funcional y bien estructurado, y avanza hacia una plataforma de intervención terapéutica completa, accesible y adaptada a las necesidades reales de los profesionales y las familias que trabajan en el ámbito de la Comunicación Aumentativa y Alternativa.*
