# Índice

- [1. Diagramas MVC](#1-Diagramas-MVC)
- [2. MVC Completo](#2-MVC-Completo)
- [3. Análisis Tecnológico](#3-Análisis-Tecnológico)
- [4. Diagramas de Secuencia](#4-Diagramas-de-Secuencia)
- [5. Solución en base al análisis](#5-Solución-en-base-al-análisis)

---



# 1. Diagramas MVC
Diagramas de ejemplo de los casos de uso más destacables

| ID | Caso de uso | Diagrama | Código |
|----|-------------|----------|--------|
| CdU-01 | Asignar actividad | ![d1](Análisis/Diagramas%20MVC/CdU01%20AsignarActividad.svg) | [PUML](Análisis/Diagramas%20MVC/CdU01%20AsignarActividad.puml) |
| CdU-02 | Publicar actividad | ![d2](Análisis/Diagramas%20MVC/CdU02%20PublicarActividad.svg) | [PUML](Análisis/Diagramas%20MVC/CdU02%20PublicarActividad.puml) |
| CdU-03 | Realizar actividad | ![d3](Análisis/Diagramas%20MVC/CdU03%20RealizarActividad.svg) | [PUML](Análisis/Diagramas%20MVC/CdU03%20RealizarActividad.puml) |
| CdU-04 | Recomendar actividad | ![d4](Análisis/Diagramas%20MVC/CdU04%20RecomendarActividad.svg) | [PUML](Análisis/Diagramas%20MVC/CdU04%20RecomendarActividad.puml) |
| CdU-05 | Registrar sesión | ![d5](Análisis/Diagramas%20MVC/CdU05%20RegistrarSesion.svg) | [PUML](Análisis/Diagramas%20MVC/CdU05%20RegistrarSesion.puml) |
| CdU-06 | Ver progreso paciente | ![d6](Análisis/Diagramas%20MVC/CdU06%20VerProgresoPaciente.svg) | [PUML](Análisis/Diagramas%20MVC/CdU06%20VerProgresoPaciente.puml)|

# 2. MVC Completo
Diagrama con todas las vistas, modelos y controladores de la aplicación:
| Diagrama | Código |
|----------|--------|
| ![d1](Análisis/Diagramas%20MVC/MVC/MVC.svg) | [PUML](Análisis/Diagramas%20MVC/MVC/MVC.puml) |

## 3. Análisis tecnológico

La elección del stack tecnológico responde directamente a los requisitos no funcionales identificados: accesibilidad universal desde cualquier navegador, coste cero para las familias, compatibilidad multiplataforma y arquitectura extensible que permita incorporar nuevos tipos de actividad sin reescribir componentes existentes.

| Capa | Tecnología | Versión | Justificación principal |
|------|------------|---------|------------------------|
| Interfaz de usuario | React | 18 | SPA accesible desde cualquier navegador, componentes reutilizables por rol (Logopeda / Familia) |
| Estilos | Tailwind CSS | 3 | Responsive nativo sin CSS personalizado, compatible con todos los dispositivos |
| Backend / API | Node.js + Express | 18 / 4 | Mismo lenguaje que el frontend, API REST stateless, bajo tiempo de respuesta |
| Autenticación | JWT | RFC 7519 | Control de acceso por rol sin estado de sesión en el servidor |
| Base de datos | MongoDB + Mongoose | 7 / 7 | Esquemas flexibles para distintos tipos de actividad, extensibilidad sin migraciones |

**React** permite desarrollar una Single Page Application accesible desde cualquier navegador sin necesidad de instalación (RNF02). La separación de la interfaz en vistas por rol —`VistaLogopeda` y `VistaFamilia`— refleja directamente la dualidad de la plataforma y facilita el mantenimiento independiente de cada flujo de trabajo.

**Node.js + Express** proporciona una API REST asíncrona y orientada a eventos especialmente adecuada para servir múltiples peticiones concurrentes con tiempos de respuesta bajos (RNF03). El uso del mismo lenguaje en frontend y backend reduce la fricción del desarrollo unipersonal.

**MongoDB + Mongoose** ofrece un modelo de datos flexible basado en documentos que permite acomodar los distintos tipos de actividad (pictograma, audio, texto) sin alterar el esquema de la base de datos ni migrar datos existentes (RNF06). Mongoose aporta la capa de validación y la API de consulta expresiva.

**JWT** implementa la autenticación stateless: el token firmado incluye el identificador del usuario y su rol, permitiendo al servidor verificar la identidad y controlar el acceso a los endpoints de cada actor sin mantener estado de sesión. Esto satisface el requisito de seguridad y control de acceso por rol (RNF04).

**Tailwind CSS** facilita el desarrollo de interfaces responsive adaptadas a diferentes tamaños de pantalla, sin imponer una estética predefinida, lo que permite diseñar elementos de gran tamaño, navegación clara y feedback visual inmediato, adaptados tanto al logopeda como a la familia y al perfil del paciente (RNF01, RNF02).

# 4. Diagramas de Secuencia
Análisis y diseño/Diseño/Diagramas Secuencia/CdU01 Asignar Actividad.svg
| ID | Caso de uso | Diagrama | Código |
|----|-------------|----------|--------|
| CdU-01 | Asignar actividad | ![d1](Diseño/Diagramas%20Secuencia/CdU01-AsignarActividad.svg) | [PUML](Diseño/Diagramas%20Secuencia/CdU01-AsignarActividad.puml) |
| CdU-02 | Publicar actividad | ![d2](Diseño/Diagramas%20Secuencia/CdU02-PublicarActividad.svg) | [PUML](Diseño/Diagramas%20Secuencia/CdU02-PublicarActividad.puml) |
| CdU-03 | Realizar actividad | ![d3](Diseño/Diagramas%20Secuencia/CdU03-RealizarActividad.svg) | [PUML](Diseño/Diagramas%20Secuencia/CdU03-RealizarActividad.puml) |
| CdU-04 | Recomendar actividad | ![d4](Diseño/Diagramas%20Secuencia/CdU04-RecomendarActividad.svg) | [PUML](Diseño/Diagramas%20Secuencia/CdU04-RecomendarActividad.puml) |
| CdU-05 | Registrar sesión | ![d5](Diseño/Diagramas%20Secuencia/CdU05-RegistrarSesion.svg) | [PUML](Diseño/Diagramas%20Secuencia/CdU05-RegistrarSesion.puml) |
| CdU-06 | Ver progreso paciente | ![d6](Diseño/Diagramas%20Secuencia/CdU06-VerProgresoPaciente.svg) | [PUML](Diseño/Diagramas%20Secuencia/CdU06-VerProgresoPaciente.puml)|

# 5. Solución en base al análisis

|  README  | Código | Vistas |
|----------|--------|--------|
| [rdmd](Diseño) | [Código](/src) | [Vistas](/views) |
