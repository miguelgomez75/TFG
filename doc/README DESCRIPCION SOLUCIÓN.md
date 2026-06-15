# Sistema CAA — Descripción de la solución
## Comunicación Aumentativa y Alternativa

---

## Índice

1. [Descripción general](#1-descripción-general)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Actores y roles](#3-actores-y-roles)
4. [Módulo de autenticación](#4-módulo-de-autenticación)
5. [Panel del Logopeda](#5-panel-del-logopeda)
   - 5.1 [Dashboard](#51-dashboard)
   - 5.2 [Gestión de pacientes](#52-gestión-de-pacientes)
   - 5.3 [Gestión de categorías](#53-gestión-de-categorías)
   - 5.4 [Gestión de actividades](#54-gestión-de-actividades)
   - 5.5 [Asignar actividad a paciente](#55-asignar-actividad-a-paciente)
   - 5.6 [Recomendar actividad](#56-recomendar-actividad)
   - 5.7 [Seguimiento de sesiones](#57-seguimiento-de-sesiones)
   - 5.8 [Registros clínicos](#58-registros-clínicos)
   - 5.9 [Ver progreso del paciente](#59-ver-progreso-del-paciente)
6. [Panel de la Familia](#6-panel-de-la-familia)
   - 6.1 [Dashboard](#61-dashboard)
   - 6.2 [Actividades recomendadas](#62-actividades-recomendadas)
   - 6.3 [Realizar una actividad](#63-realizar-una-actividad)
   - 6.4 [Resultado de la actividad](#64-resultado-de-la-actividad)
   - 6.5 [Registros del logopeda](#65-registros-del-logopeda)
   - 6.6 [Progreso del paciente](#66-progreso-del-paciente)
7. [Modelo de datos](#7-modelo-de-datos)
8. [Principios de diseño aplicados](#8-principios-de-diseño-aplicados)

---

## 1. Descripción general

El **Sistema CAA** (Comunicación Aumentativa y Alternativa) es una aplicación web diseñada para apoyar el proceso terapéutico de pacientes con dificultades de comunicación. Permite a los logopedas gestionar actividades terapéuticas, hacer seguimiento clínico y compartir recomendaciones con las familias, que a su vez pueden practicar las actividades en casa y consultar la evolución del paciente.

La solución está desarrollada con **Node.js + Express** en el backend, **MongoDB Atlas** como base de datos en la nube y vistas **HTML + JavaScript** en el frontend. El diseño sigue los principios **SOLID** y está estructurado conforme al proceso **RUP** (Rational Unified Process).

---

## 2. Arquitectura del sistema

El sistema sigue el patrón **MVC (Modelo-Vista-Controlador)** con segregación de interfaces por actor:

![Diagrama arquitectura MVC](/Análisis%20y%20diseño/Análisis/Arquitectura/Arquitectura_mvc_solución.svg)

Las rutas están separadas por actor (`/api/logopeda/...` y `/api/familia/...`), cada una protegida con su propio middleware de autenticación JWT, aplicando el principio de **Segregación de Interfaces (ISP)**.

---

## 3. Actores y roles

El sistema contempla dos actores principales:

| Actor | Rol | Acceso |
|-------|-----|--------|
| **Logopeda** | Profesional terapéutico | Gestión completa: pacientes, actividades, sesiones, registros y progreso |
| **Familia** | Entorno del paciente | Acceso de lectura y práctica: actividades asignadas, registros y progreso |

Ambos actores se autentican con email y contraseña. El sistema emite un **token JWT** con el rol incluido, que determina qué endpoints y vistas son accesibles.

---

## 4. Módulo de autenticación

La pantalla de acceso es común a ambos actores. Al introducir las credenciales correctas, el sistema redirige automáticamente al panel correspondiente según el rol del usuario.

![Captura Login](/Capturas/Login.png)

---

El sistema detecta el rol en el token y redirige:
- `LOGOPEDA` → `/logopeda/dashboard.html`
- `FAMILIA` → `/familia/dashboard.html`

Si el token caduca o no existe, cualquier vista protegida redirige automáticamente al login.

---

## 5. Panel del Logopeda

### 5.1 Dashboard

El dashboard del logopeda muestra un resumen del estado del sistema: número de pacientes activos y actividades registradas, junto con accesos directos a todas las secciones.

![Dashboard logopeda](/Capturas/Dashboard%20logopeda.png)

---

### 5.2 Gestión de pacientes

Permite al logopeda mantener el registro de sus pacientes. Cada paciente tiene nombre, fecha de nacimiento, nivel actual de comunicación y estado activo/inactivo.

**Funcionalidades:**
- Crear nuevo paciente con sus datos clínicos básicos.
- Editar los datos de un paciente existente.
- Marcar un paciente como inactivo (no se elimina del historial).
- Eliminar un paciente del sistema.
- Filtrar entre pacientes activos e inactivos.

![Pacientes](/Capturas/Pacientes%20abierto.png)

---

![Paciente crud](/Capturas/Paciente%20crud.png)

---

### 5.3 Gestión de categorías

Las categorías permiten organizar las actividades en grupos temáticos reutilizables (p.ej. "Vida cotidiana", "Emociones", "Alimentación").

**Funcionalidades:**
- Crear categorías con nombre y descripción.
- Editar categorías existentes.

![Categorías](/Capturas/Categorias.png)

![Categorías](/Capturas/Categoría%20crud.png)

---

### 5.4 Gestión de actividades

Es el núcleo del sistema. El logopeda crea y gestiona las actividades CAA que luego asignará a sus pacientes. Cada actividad tiene un ciclo de vida definido con tres estados posibles.

**Ciclo de vida de una actividad:**

```
BORRADOR  ──publicar()──▶  DISPONIBLE  ──archivar()──▶  ARCHIVADA
```

- **BORRADOR:** recién creada, solo visible para el logopeda, no asignable.
- **DISPONIBLE:** publicada y asignable a pacientes. Visible para la familia.
- **ARCHIVADA:** retirada de uso activo, conservada en el historial.

**Tipos de actividad soportados:**
- `PICTOGRAMA` — imagen con etiqueta
- `AUDIO` — archivo de audio con transcripción
- `TEXTO` — contenido textual
- `VIDEO` — enlace a vídeo

**Funcionalidades:**
- Crear actividad indicando tipo, categoría, nivel de dificultad y contenido.
- Editar actividades en estado BORRADOR.
- Publicar una actividad (valida que el contenido esté completo antes de permitirlo).
- Archivar una actividad disponible.
- Eliminar una actividad.
- Filtrar actividades por estado.

![Actividades](/Capturas/Actividades%20(logopeda).png)

---

![Actividad crud](/Capturas/Actividad%20crud.png)

---

![Actividad publicado](/Capturas/Actividad%20publicación.png)

---

### 5.5 Asignar actividad a paciente

Desde el panel de actividades, el logopeda puede asignar una actividad disponible a uno o varios pacientes. La asignación queda registrada con estado `PENDIENTE` hasta que la familia la complete.

**Estados de una asignación:**

```
PENDIENTE  ──iniciar()──▶  EN_PROGRESO  ──completar()──▶  COMPLETADA
```

![Actividad Asignación](/Capturas/Actividad%20Asignación.png)

---

### 5.6 Recomendar actividad

El logopeda puede enviar una recomendación escrita a la familia vinculada a una actividad concreta. La recomendación se guarda como un `RegistroClinico` de tipo `RECOMENDACION` e incluye instrucciones personalizadas.

**Diferencia con asignar:** asignar da acceso a la actividad; recomendar añade instrucciones contextuales sobre cómo practicarla en casa.

![Registro Recomendación](/Capturas/Registro%20Recomendación.png)

---

### 5.7 Seguimiento de sesiones

El logopeda registra las sesiones clínicas presenciales con el paciente. Cada sesión recoge la fecha, tipo (presencial o en casa), número de aciertos y errores, y notas observacionales.

**Funcionalidades:**
- Seleccionar paciente para ver su historial de sesiones.
- Registrar nueva sesión con los datos clínicos.
- Editar una sesión existente.
- Eliminar una sesión.
- Visualizar el estado y el porcentaje de aciertos de cada sesión.

![Sesiones](/Capturas/Sesiones.png)

---

![Sesión crud](/Capturas/Sesión%20crud.png)

---

### 5.8 Registros clínicos

El logopeda puede crear tres tipos de registros asociados a un paciente:

| Tipo | Descripción |
|------|-------------|
| `REGISTRO` | Nota clínica general de seguimiento |
| `RECOMENDACION` | Instrucción para practicar en casa, vinculada a una actividad |
| `NOTA` | Observación informal o recordatorio |

Los registros pueden filtrarse por tipo. Al crearlos, se puede indicar el email de la familia para enviarles una notificación automática.

**Funcionalidades:**
- Crear, editar y eliminar registros.
- Filtrar por tipo de registro.
- Vincular un registro a una actividad concreta.
- Notificación automática a la familia al crear un registro.

![Registros](/Capturas/Registros.png)

---

![Registro crud](/Capturas/Registro%20crud.png)

---

### 5.9 Ver progreso del paciente

Muestra las métricas de evolución terapéutica de un paciente calculadas a partir de sus sesiones finalizadas y el estado de sus asignaciones.

**Métricas mostradas:**
- Total de sesiones finalizadas.
- Promedio de aciertos sobre el total de respuestas.
- Total de actividades asignadas.
- Actividades completadas y pendientes.
- Gráfico de barras con la evolución del porcentaje de aciertos sesión a sesión.

![Progreso](/Capturas/Progreso%20(logopeda).png)

---

## 6. Panel de la Familia

### 6.1 Dashboard

La familia accede a un panel simplificado centrado en las actividades de su paciente y el seguimiento de su evolución.

![Dashboard](/Capturas/Dashboard%20familia.png)

---

### 6.2 Actividades recomendadas

Muestra las actividades que el logopeda ha asignado al paciente y que están pendientes o en progreso, junto con las recomendaciones escritas asociadas.

**Información visible:**
- Listado de actividades asignadas activas con su estado (PENDIENTE / EN_PROGRESO).
- Botón de acceso directo para practicar cada actividad.
- Recomendaciones del logopeda con instrucciones de práctica en casa.

![Actividades](/Capturas/Actividades%20(familia).png)

---

### 6.3 Realizar una actividad

La familia puede iniciar una sesión de práctica con cualquier actividad disponible. Durante la sesión se registran los aciertos y errores en tiempo real.

**Flujo de la sesión:**
1. Seleccionar actividad y paciente.
2. Iniciar sesión (se crea automáticamente en la base de datos).
3. Registrar cada respuesta como acierto o error.
4. Finalizar la sesión (se calcula el porcentaje y se marca la asignación como completada).

![Actividades](/Capturas/Realizar%20Actividad.png)

---

![Actividad en curso](/Capturas/Actividad%20en%20curso.png)

---

### 6.4 Resultado de la actividad

Al finalizar la sesión, se muestra una pantalla de resultados con el porcentaje de aciertos y un mensaje adaptativo según el rendimiento obtenido.

**Rangos de rendimiento:**
- ≥ 80% → 🏆 Excelente
- 50–79% → 👍 Bien hecho
- < 50% → 💪 Ánimo, sigue practicando

![Resultados Actividad](/Capturas/Resultados%20actividad.png)

---

### 6.5 Registros del logopeda

La familia puede consultar todos los registros clínicos que el logopeda ha creado para su paciente, filtrados por tipo.

**Funcionalidades:**
- Ver registros clínicos generales.
- Ver recomendaciones de actividad con instrucciones del logopeda.
- Ver notas de seguimiento.
- Filtrar por tipo de registro mediante pestañas.

![Registros del logopeda](/Capturas/Registros%20del%20logopeda%20(familia).png)

---

### 6.6 Progreso del paciente

La familia tiene acceso a las mismas métricas de evolución que el logopeda: sesiones completadas, promedio de aciertos, actividades completadas y el gráfico de evolución.

![Progreso](/Capturas/Progreso%20(familia).png)

---

## 7. Modelo de datos

El sistema gestiona las siguientes entidades principales:

| Entidad | Descripción |
|---------|-------------|
| `Usuario` | Logopeda o Familia, con email, contraseña (bcrypt) y rol |
| `Paciente` | Datos clínicos del paciente, vinculado a un logopeda |
| `Categoria` | Agrupación temática de actividades |
| `Actividad` | Actividad CAA con tipo, contenido y ciclo de vida |
| `AsignacionActividad` | Relación paciente-actividad con estado de progreso |
| `Sesion` | Sesión de práctica con aciertos, errores y estado |
| `RegistroClinico` | Nota, recomendación o registro vinculado a un paciente |
| `TipoActividad` | Catálogo de tipos de actividad disponibles |
| `Pictograma` | Recurso visual reutilizable entre actividades |

---

## 8. Principios de diseño aplicados

La solución aplica los cinco principios **SOLID** de forma explícita:

| Principio | Aplicación en el sistema |
|-----------|--------------------------|
| **SRP** — Responsabilidad única | `SesionController` (logopeda) y `PracticaController` (familia) son controladores separados con una única razón de cambio cada uno |
| **OCP** — Abierto/cerrado | Los tipos de actividad se extienden creando una nueva clase `EstrategiaXxx` sin modificar `ActividadController` |
| **LSP** — Sustitución de Liskov | `EstrategiaContenido` define pre y postcondiciones formales que todas las estrategias deben cumplir para ser sustituibles |
| **ISP** — Segregación de interfaces | Las rutas `/api/logopeda/...` y `/api/familia/...` son interfaces completamente separadas; la familia no ve ni puede llamar a endpoints del logopeda |
| **DIP** — Inversión de dependencias | `RegistroClinicoController` depende de `INotificador` (abstracción), no de `NotificadorEmail` ni `NotificadorConsola`; el canal se elige en `config/dependencias.js` |
