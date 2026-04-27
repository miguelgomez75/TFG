# Sistema CAA — Análisis

Documentación de análisis de la aplicación de Comunicación Aumentativa y Alternativa (CAA) desarrollada como TFG. Recoge los diagramas UML que modelan la arquitectura del sistema, los casos de uso principales, el diagrama de clases y la organización en paquetes.

---

## Estructura de esta carpeta

```
Análisis/
├── Arquitectura/
│   ├── Análisis Arquitectura.puml
│   ├── Análisis Arquitectura.png  ← diagrama renderizado
│   ├── Despliegue.puml
│   └── Despliegue.png
├── Casos de uso/
│   ├── Asignar Actividad.puml
│   ├── Asignar Actividad.png
│   ├── Publicar Actividad.puml
│   ├── Publicar Actividad.png
│   ├── Realizar Actividad.puml
│   ├── Realizar Actividad.png
│   ├── Recomendar Actividad.puml
│   ├── Recomendar Actividad.png
│   ├── Registrar Sesión.puml
│   ├── Registrar Sesión.png
│   ├── Ver Progreso Paciente.puml
│   └── Ver Progreso Paciente.png
├── Clases/
│   ├── Clases.puml
│   └── Clases.png
└── Paquetes/
    ├── Paquetes.puml
    └── Paquetes.png
```

> Los ficheros `.puml` contienen el código fuente PlantUML. Los `.png` son los diagramas renderizados listos para incluir en documentación.

---

## Arquitectura del sistema

El sistema sigue una **arquitectura en tres capas** que separa presentación, lógica de negocio y persistencia.

### Diagrama de arquitectura lógica

→ [`Arquitectura/Análisis Arquitectura.puml`](Arquitectura/Análisis%20Arquitectura.puml) · [`Análisis Arquitectura.png`](Arquitectura/Análisis%20Arquitectura.png)

| Capa | Tecnología | Responsabilidad |
|------|-----------|----------------|
| Presentación | React SPA | Vistas diferenciadas por rol: `VistaLogopeda` y `VistaFamilia` |
| Lógica de negocio | Node.js + Express | API REST con controladores por dominio (Auth, Paciente, Actividad, Sesión, Registro) |
| Persistencia | MongoDB + Mongoose | Modelos de datos: Paciente, Actividad, Sesión, Registro, Usuario |

La comunicación entre capas se realiza mediante **HTTP/REST con JSON** (frontend → API) y **Mongoose ODM** (API → base de datos).

### Diagrama de despliegue

→ [`Arquitectura/Despliegue.puml`](Arquitectura/Despliegue.puml) · [`Despliegue.png`](Arquitectura/Despliegue.png)

Muestra los tres nodos físicos del sistema:

- **Dispositivo del usuario** — navegador ejecuta la React SPA.
- **Servidor de aplicación** — Node.js + Express con middleware JWT para control de acceso por rol (`LOGOPEDA` / `FAMILIA`).
- **Servidor de base de datos** — MongoDB, accedido desde la API vía Mongoose.

---

## Casos de uso

Cada diagrama de secuencia modela una funcionalidad principal del sistema, mostrando la interacción entre actores, vistas, controladores y modelos.

### Actores del sistema

| Actor | Rol | Capacidades principales |
|-------|-----|------------------------|
| **Logopeda** | Profesional clínico | Gestionar pacientes, crear y publicar actividades, asignar y recomendar actividades, registrar sesiones, consultar progreso |
| **Familia** | Cuidador / familiar | Realizar actividades asignadas, consultar progreso del paciente, leer recomendaciones |

---

### Asignar Actividad

→ [`Casos de uso/Asignar Actividad.puml`](Casos%20de%20uso/Asignar%20Actividad.puml) · [`Asignar Actividad.png`](Casos%20de%20uso/Asignar%20Actividad.png)

El **Logopeda** selecciona un paciente y una actividad disponible. El `AsignacionController` crea una `AsignacionActividad` con estado `Pendiente` que vincula al paciente con esa actividad.

Participantes: `VistaLogopeda` → `AsignacionController`, `PacienteController`, `ActividadController` → modelos `Paciente`, `Actividad`, `AsignacionActividad`.

---

### Publicar Actividad

→ [`Casos de uso/Publicar Actividad.puml`](Casos%20de%20uso/Publicar%20Actividad.puml) · [`Publicar Actividad.png`](Casos%20de%20uso/Publicar%20Actividad.png)

El **Logopeda** revisa una actividad en estado `Borrador` y la publica. El `ActividadController` actualiza el estado a `Disponible`. Si el contenido está incompleto, el modelo devuelve un error de validación y la actividad no se publica.

Incluye flujo alternativo: `contenido válido` / `contenido incompleto`.

---

### Realizar Actividad

→ [`Casos de uso/Realizar Actividad.puml`](Casos%20de%20uso/Realizar%20Actividad.puml) · [`Realizar Actividad.png`](Casos%20de%20uso/Realizar%20Actividad.png)

La **Familia** selecciona una actividad asignada y la realiza. El `SesionController` crea una `Sesion` en estado `EnCurso`, registra la respuesta de cada ejercicio en un bucle, y al finalizar actualiza el estado a `Finalizada` y muestra los resultados.

Patrón clave: bucle `por cada ejercicio` con registro de aciertos/errores en tiempo real.

---

### Recomendar Actividad

→ [`Casos de uso/Recomendar Actividad.puml`](Casos%20de%20uso/Recomendar%20Actividad.puml) · [`Recomendar Actividad.png`](Casos%20de%20uso/Recomendar%20Actividad.png)

El **Logopeda** selecciona paciente y actividad, añade instrucciones personalizadas y las guarda como un `Registro` de tipo `RECOMENDACION`. Ese registro queda visible para la Familia en su vista.

---

### Registrar Sesión

→ [`Casos de uso/Registrar Sesión.puml`](Casos%20de%20uso/Registrar%20Sesión.puml) · [`Registrar Sesión.png`](Casos%20de%20uso/Registrar%20Sesión.png)

El **Logopeda** registra manualmente una sesión presencial: selecciona paciente, completa el formulario con fecha, tipo, observaciones, aciertos y errores. El `SesionController` persiste la sesión en MongoDB.

---

### Ver Progreso Paciente

→ [`Casos de uso/Ver Progreso Paciente.puml`](Casos%20de%20uso/Ver%20Progreso%20Paciente.puml) · [`Ver Progreso Paciente.png`](Casos%20de%20uso/Ver%20Progreso%20Paciente.png)

Tanto el **Logopeda** como la **Familia** pueden consultar el progreso. El `SesionController` recupera las sesiones del paciente; si existen, se renderizan métricas y gráficas de evolución. Si no hay datos, se muestra un mensaje informativo.

Incluye flujo alternativo: `hay sesiones registradas` / `sin datos`.

---

## Diagrama de clases

→ [`Clases/Clases.puml`](Clases/Clases.puml) · [`Clases.png`](Clases/Clases.png)

El diagrama recoge las tres capas del patrón MVC:

**Modelo** — entidades principales y sus relaciones:

| Clase | Descripción |
|-------|-------------|
| `Usuario` | Autenticación y rol (`LOGOPEDA` / `FAMILIA`) |
| `Paciente` | Perfil del paciente con nivel actual |
| `Actividad` | Contenido terapéutico con estado (`BORRADOR` / `DISPONIBLE` / `ARCHIVADA`) |
| `AsignacionActividad` | Vinculación paciente-actividad con progreso (`PENDIENTE` / `EN_PROGRESO` / `COMPLETADA`) |
| `Sesion` | Registro de práctica con aciertos, errores y estado del flujo |
| `Registro` | Anotaciones, recordatorios y recomendaciones del logopeda |
| `Categoria` / `Pictograma` | Clasificación y recursos visuales de las actividades |

**Vista** — `VistaLogopeda`, `VistaFamilia` y vistas específicas por entidad (`VistaPaciente`, `VistaActividad`, `VistaSesion`, `VistaRegistro`, `VistaAsignacion`, `VistaProgreso`).

**Controlador** — `AuthController`, `PacienteController`, `ActividadController`, `AsignacionController`, `RecomendacionController`, `SesionController`, `RegistroController`, `ProgresoController`.

---

## Diagrama de paquetes

→ [`Paquetes/Paquetes.puml`](Paquetes/Paquetes.puml) · [`Paquetes.png`](Paquetes/Paquetes.png)

Organiza las clases en paquetes con dependencias explícitas entre capas:

```
modelo
├── modelo.usuario          (Usuario, Rol)
├── modelo.terapia          (Paciente, Sesion, enums)
├── modelo.actividad        (Actividad, AsignacionActividad, Categoria, Pictograma, enums)
└── modelo.comunicacion     (Registro, TipoRegistro)

controlador
├── controlador.auth
├── controlador.terapia     (Paciente, Sesion, Progreso)
├── controlador.actividad   (Actividad, Asignacion, Recomendacion)
└── controlador.comunicacion

vista
├── vista.logopeda          (Logopeda, Paciente, Registro, Asignacion)
├── vista.familia           (Familia, Progreso)
└── vista.compartida        (Actividad, Sesion)
```

La dirección de dependencias es siempre **vista → controlador → modelo**, nunca al revés.
