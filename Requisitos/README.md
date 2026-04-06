
# 📌 Índice

- [1. Diagrama de Entidades](#1--diagrama-de-entidades)
- [2. Diagramas de Estados](#2--diagramas-de-estados)
- [3. Actores del Sistema](#-3-actores-del-sistema)
- [4. Casos de Uso](#4--casos-de-uso)
- [5. Diagramas de Contexto](#5--diagramas-de-contexto)
- [6. Casos de Uso Detallados](#6--casos-de-uso-detallados)
- [7. Glosario](#7--glosario)
- [8. Requisitos Suplementarios](#8-%EF%B8%8F-requisitos-suplementarios-no-funcionales)

---

# 1. 📊 Diagrama de Entidades

| Elemento | Diagrama | Código PlantUML |
|----------|----------|-----------------|
| Modelo de dominio | ![dominio](Modelo%20de%20dominio/DDEn.png) | [Ver código](Modelo%20de%20dominio/DDEn.puml) |

---

# 2. 🔄 Diagramas de Estados

| Elemento | Diagrama | Código |
|----------|----------|--------|
| Actividad (Contenido) | ![actividadc](Modelo%20de%20dominio/DDEs%20Actividad(Contenido).png) | [PUML](Modelo%20de%20dominio/DDEs%20Actividad(Contenido).puml) |
| Actividad (Contenido) | ![actividadc](Modelo%20de%20dominio/DDEs%20Actividad(Progreso).png) | [PUML](Modelo%20de%20dominio/DDEs%20Actividad(Progreso).puml) |
| Sesión de práctica | ![sesion](Modelo%20de%20dominio/DDEs%20Sesion.png) | [PUML](Modelo%20de%20dominio/DDEs%20Sesion.puml) |
| Registro de sesión | ![nota](Modelo%20de%20dominio/DDEs%20Registro.png) | [PUML](Modelo%20de%20dominio/DDEs%20Registro.puml) |

---

# 👥 3. Actores del Sistema

| Diagrama | Código |
|----------|--------|
| ![actividadc](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/DDAc.png) | [PUML](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/DDAc.puml) |

## 👩‍⚕️ Logopeda

| Característica | Descripción |
|---------------|-------------|
| Rol principal | Profesional clínico responsable de la intervención |
| Función | Gestión completa del sistema terapéutico |
| Permisos | Altos (CRUD completo sobre entidades principales) |
| Interacción | Configura, supervisa y evalúa pacientes |

### Funciones principales:
- Gestión de pacientes
- Gestión de actividades
- Seguimiento terapéutico
- Gestión de registros clínicos
- Asignación y recomendación de actividades

---

## 👨‍👩‍👧 Familia

| Característica | Descripción |
|---------------|-------------|
| Rol principal | Usuario final del sistema terapéutico |
| Función | Ejecución de actividades y consulta de progreso |
| Permisos | Lectura y ejecución |
| Interacción | Realiza actividades y consulta resultados |

### Funciones principales:
- Realizar actividades
- Consultar progreso
- Ver sesiones y registros
- Acceder a actividades recomendadas

---

# 4. 🎯 Casos de Uso

## 👩‍⚕️ Logopeda

| Diagrama | Código |
|----------|--------|
| ![cuL](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/DDCdU%20Logopeda%20v2.png) | [PUML](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/DDCdU%20Logopeda%20v2.puml) |

---

## 👨‍👩‍👧 Familia

| Diagrama | Código |
|----------|--------|
| ![cuF](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/DDCdU%20Familia%20v2.png) | [PUML](Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/DDCdU%20Familia%20v2.puml) |

---

# 5. 🧭 Diagramas de Contexto

| Actor | Diagrama | Código |
|-------|----------|--------|
| Logopeda | ![ctx1](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Logopeda.png) | [PUML](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Logopeda.puml) |
| Familia | ![ctx2](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Familia.png) | [PUML](Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Familia.puml) |

---

# 6. 🧩 Casos de Uso Detallados

| Caso | Descripción | Diagrama | Código |
|------|-------------|----------|--------|
| Asignar actividad | Asignación de actividades a pacientes | ![d1](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Asignar%20Actividad.png) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Asignar%20Actividad.puml) |
| Realizar actividad | Ejecución de ejercicios terapéuticos | ![d2](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Realizar%20Actividad.png) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Realizar%20Actividad.puml) |
| Ver progreso | Seguimiento evolutivo | ![d3](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Ver%20Progreso%20Paciente.png) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Ver%20Progreso%20Paciente.puml) |
| Recomendar actividad | Recomendación terapéutica | ![d4](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Recomendar%20Actividad.png) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Recomendar%20Actividad.puml) |
| Publicar actividad | Activación de actividades | ![d5](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Publicar%20Actividad.png) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Publicar%20Actividad.puml) |
| Registrar sesión | Registro clínico | ![d6](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Registrar%20Sesion.png) | [PUML](Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/Registrar%20Sesion.puml) |

---

# 7. 📚 Glosario

| Término | Definición |
|--------|------------|
| Logopeda | Profesional responsable de la intervención del lenguaje |
| Familia | Usuario que ejecuta actividades terapéuticas |
| Actividad | Ejercicio terapéutico diseñado para el paciente |
| Sesión | Registro de intervención clínica |
| Progreso | Evolución del paciente |
| Registro | Nota clínica del logopeda |
| CAA | Comunicación Aumentativa y Alternativa |

Para evitar confusiones, la sesión referente a la autenticación del usuario dentro del sistema se referirá por medio de los terminos login, logout y al registro por medio de sign in
---

# 8. ⚙️ Requisitos Suplementarios (No funcionales)

## 8.1 Rendimiento
- Respuesta del sistema en menos de 2 segundos en condiciones normales.
- Soporte para múltiples usuarios concurrentes.

## 8.2 Seguridad
- Autenticación obligatoria.
- Control de permisos según rol (Logopeda / Familia).

## 8.3 Usabilidad
- Interfaz intuitiva y accesible.
- Compatible con dispositivos móviles y tablets.

## 8.4 Mantenibilidad
- Arquitectura modular.
- Código documentado y estructurado.

## 8.5 Disponibilidad
- Disponibilidad mínima del sistema del 99%.

## 8.6 Escalabilidad
- Preparado para crecimiento de usuarios y datos sin degradación del rendimiento.
