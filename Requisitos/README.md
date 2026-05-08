
# 📌 Índice

- [1. Modelo del Dominio](#1--modelo-del-dominio)
  - [1.1. Diagrama de Entidades](#11-diagrama-de-entidades)
  - [1.2. Diagramas de Estados](#12--diagramas-de-estados)
- [2. Disciplina de Requisitos](#2-disciplina-de-requisitos)
  - [2.1. Actores del Sistema](#21--actores-del-sistema)
  - [2.2. Casos de Uso](#22--casos-de-uso)
  - [2.3 Diagramas de Contexto](#23--diagramas-de-contexto)
  - [2.4. Casos de Uso Detallados](#24--casos-de-uso-detallados)
  - [2.5. Glosario](#25--glosario)
  - [2.6. Requisitos No Funcionales](#26-%EF%B8%8F-requisitos-no-funcionales)

---

# 1. 📊 Modelo del Dominio

## 1.1. Diagrama de Entidades

Diagrama de entidades del modelo del dominio del sistema CAA.

| Diagrama | Código PlantUML |
|----------|-----------------|
| ![entidades](Modelo%20de%20dominio/v2/DDEn.svg) | [Ver código](Modelo%20de%20dominio/v2/DDEn.puml) |

---

## 1.2. 🔄 Diagramas de Estados

El sistema define cuatro máquinas de estado independientes.

**Actividad (ciclo de vida del contenido):** gestiona si la actividad está siendo editada, publicada o retirada.

| Diagrama | Código |
|----------|--------|
| ![actividadc](Modelo%20de%20dominio/DDEs%20Actividad(Contenido).png) | [PUML](Modelo%20de%20dominio/DDEs%20Actividad(Contenido).puml) |

**Actividad (progreso del paciente):** gestiona si el paciente ha completado, abandonado o no iniciado la actividad asignada.

| Diagrama | Código |
|----------|--------|
| ![actividadp](Modelo%20de%20dominio/v2/DDEs%20Actividad(Progreso).svg) | [PUML](Modelo%20de%20dominio/v2/DDEs%20Actividad(Progreso).puml) |

**Sesión de práctica:** estados internos durante la ejecución de una actividad por parte de la familia. La sesión comienza cuando el usuario pulsa "Iniciar" en la pantalla de detalle de actividad.

| Diagrama | Código |
|----------|--------|
| ![sesion](Modelo%20de%20dominio/v2/DDEs%20Sesion.svg) | [PUML](Modelo%20de%20dominio/v2/DDEs%20Sesion.puml) |

**Registro clínico:** ciclo de vida de una nota, recordatorio o recomendación creada por el logopeda.

| Diagrama | Código |
|----------|--------|
| ![nota](Modelo%20de%20dominio/DDEs%20Registro.png) | [PUML](Modelo%20de%20dominio/DDEs%20Registro.puml) |

> **Nota sobre nomenclatura:** la *Sesión de práctica* (ejecución de una actividad) y el *Registro de sesión clínica* (anotación del logopeda sobre una consulta presencial) son entidades distintas con ciclos de vida propios.

---

# 2. Disciplina de Requisitos

## 2.1. 👥 Actores del Sistema

El diagrama muestra la jerarquía de actores mediante relaciones de herencia. Solo se permiten relaciones de herencia entre actores; no se representan aquí sus interacciones con el sistema.

| Diagrama | Código |
|----------|--------|
| ![actores](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v2/DDAc.svg) | [PUML](Disciplina%20de%20requisitos/v2/Actores%20y%20casos%20de%20uso/DDAc.puml) |

Los tres actores del sistema son:

**UsuarioNoAutenticado** — cualquier visitante antes de identificarse. Es el único que puede ejecutar los casos de uso de autenticación (Login / Signin).

**Logopeda** — especialización de UsuarioNoAutenticado. Profesional clínico con permisos de escritura completos sobre pacientes, actividades, sesiones y registros.

**Familia** — especialización de UsuarioNoAutenticado. Usuario con permisos de lectura y ejecución: consulta el progreso del paciente y realiza las actividades asignadas.

---

## 2.2. 🎯 Casos de Uso

Los casos de uso están agrupados por actor y por paquete funcional.

### 👩‍⚕️ Logopeda

| Diagrama 1 | Diagrama 2 | Código |
|------------|------------|--------|
| ![cuL](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v4/DDCdU%20Logopeda%201.svg) | ![cuL2](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v4/DDCdU%20Logopeda%202.svg) |[PUML](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v4/) |

### 👨‍👩‍👧 Familia

| Diagrama | Código |
|----------|--------|
| ![cuF](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v3/DDCdU%20Familia.svg) | [PUML](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v3/DDCdU%20Familia.puml) |

### Usuario no Autenticado

| Diagrama | Código |
|----------|--------|
| ![cuUnA](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso//DDCdU%20UsuarioNoAutenticado.svg) | [PUML](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/DDCdU%20UsuarioNoAutenticado.puml) |

---

## 2.3. 🧭 Diagramas de Contexto

Los diagramas de contexto modelan la navegación del sistema como una máquina de estados. Los nombres de estado siguen la convención `ENTIDAD_ESTADO` (p. ej. `PACIENTES_ABIERTO`, `PACIENTE_ABIERTO`). Las transiciones corresponden a los casos de uso.

| Actor | Diagrama | Código |
|-------|----------|--------|
| Logopeda | ![ctx1](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/v2/DDCtx%20Logopeda.svg) | [PUML](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Logopeda.puml) |
| Familia | ![ctx2](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/v2/DDCtx%20Familia.svg) | [PUML](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Familia.puml) |
| Usuario no Autenticado | ![ctx2](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Usuario%20no%20Autenticado.svg) | [PUML](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Usuario%20no%20Autenticado.puml) |

---

## 2.4. 🧩 Casos de Uso Detallados

Cada caso de uso se describe con: actor principal, precondiciones, flujo principal, postcondiciones y flujos alternativos (con identificador FA-n).

| ID | Caso de uso | Diagrama | Código |
|----|-------------|----------|--------|
| CdU-01 | Asignar actividad | ![d1](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Asignar%20Actividad.svg) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Asignar%20Actividad.puml) |
| CdU-02 | Publicar actividad | ![d5](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Publicar%20Actividad.svg) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Publicar%20Actividad.puml) |
| CdU-03 | Realizar actividad | ![d2](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Realizar%20Actividad.svg) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Realizar%20Actividad.puml) |
| CdU-04 | Recomendar actividad | ![d4](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Recomendar%20Actividad.svg) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Recomendar%20Actividad.puml) |
| CdU-05 | Registrar sesión | ![d6](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Registrar%20Sesion.svg) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Registrar%20Sesion.puml) |
| CdU-06 | Ver progreso paciente | ![d3](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Ver%20Progreso%20Paciente.svg) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v2/Ver%20Progreso%20Paciente.puml) |

---

## 2.5. 📚 Glosario

| Término | Definición |
|--------|------------|
| Paciente | Persona que realiza las actividades terapéuticas. |
| Logopeda | Profesional clínico que supervisa, diseña actividades y realiza el seguimiento. |
| Familia | Usuario que ejecuta actividades y consulta el progreso del paciente. |
| UsuarioNoAutenticado | Visitante del sistema antes de completar el proceso de login. |
| Actividad | Ejercicio terapéutico basado en pictogramas, diseñado por el logopeda. |
| Sesión de práctica | Ejecución de una actividad por parte de la familia o el paciente. |
| Sesión clínica | Registro de una consulta presencial introducido por el logopeda. |
| Registro | Entrada en la bitácora clínica: nota, recordatorio o recomendación. |
| AsignacionActividad | Relación entre un paciente y una actividad, con estado de progreso. |
| CAA | Comunicación Aumentativa y Alternativa basada en pictogramas. |

> Para evitar ambigüedad con el término *registro* (bitácora clínica vs. creación de cuenta), el proceso de creación de cuenta se denomina *sign in* y la autenticación *login / logout*.

---

## 2.6. ⚙️ Requisitos No Funcionales

Los siguientes requisitos no funcionales han sido definidos por el cliente.

### 2.6.1 Rendimiento

El tiempo de respuesta del sistema deberá ser inferior a 2 segundos en condiciones de carga normal. El sistema deberá soportar múltiples usuarios concurrentes sin degradación perceptible.

### 2.6.2 Seguridad

El control de acceso se realizará por roles: Logopeda y Familia tienen permisos distintos y mutuamente excluyentes. La obligatoriedad de autenticación queda recogida en los diagramas de contexto: ambos actores parten del estado `INICIO` y solo acceden al sistema tras ejecutar el caso de uso *Login*.

### 2.6.3 Usabilidad

La interfaz deberá ser comprensible para usuarios sin conocimientos técnicos, en particular para el actor Familia. El sistema deberá ser compatible con dispositivos móviles y tabletas.

### 2.6.4 Mantenibilidad

La arquitectura será modular, permitiendo añadir nuevos tipos de actividad sin modificar los módulos existentes. El código estará documentado.

### 2.6.5 Disponibilidad

La disponibilidad mínima del sistema será del 99 %.

### 2.6.6 Escalabilidad

El sistema estará preparado para crecer en número de usuarios y volumen de datos sin degradación del rendimiento.
