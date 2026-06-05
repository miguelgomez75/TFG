# Sistema CAA — Documentación técnica

Aplicación de Comunicación Aumentativa y Alternativa (CAA) desarrollada como TFG. Este documento recorre el proyecto completo: desde el análisis inicial (diagramas UML de arquitectura, casos de uso, clases y paquetes) hasta las tres versiones del diseño software (base, modular y orientado a objetos con SOLID).

---

## Estructura del proyecto

```
.
├── Análisis/
│   ├── Arquitectura/
│   │   ├── Análisis Arquitectura.puml / .png
│   │   └── Despliegue.puml / .png
│   ├── Casos de uso/
│   │   ├── Asignar Actividad.puml / .png
│   │   ├── Publicar Actividad.puml / .png
│   │   ├── Realizar Actividad.puml / .png
│   │   ├── Recomendar Actividad.puml / .png
│   │   ├── Registrar Sesión.puml / .png
│   │   └── Ver Progreso Paciente.puml / .png
│   ├── Clases/
│   │   └── Clases.puml / .png
│   └── Paquetes/
│       └── Paquetes.puml / .png
└── Diseño/
    ├── v1-disenyo-base/
    ├── v2-disenyo-modular/
    └── v3-disenyo-oo/
```

---

## [Parte I — Análisis](Análisis/README_Analisis.md)

### Arquitectura del sistema

El sistema sigue una **arquitectura en tres capas** que separa presentación, lógica de negocio y persistencia.

#### Diagrama de arquitectura lógica

→ [`Análisis/Arquitectura/Análisis Arquitectura.puml`](Análisis/Arquitectura/Análisis%20Arquitectura.puml) · [`Análisis Arquitectura.png`](Análisis/Arquitectura/Análisis%20Arquitectura.png)

| Capa | Tecnología | Responsabilidad |
|------|-----------|----------------|
| Presentación | React SPA | Vistas diferenciadas por rol: `VistaLogopeda` y `VistaFamilia` |
| Lógica de negocio | Node.js + Express | API REST con controladores por dominio (Auth, Paciente, Actividad, Sesión, Registro) |
| Persistencia | MongoDB + Mongoose | Modelos de datos: Paciente, Actividad, Sesión, Registro, Usuario |

La comunicación entre capas se realiza mediante **HTTP/REST con JSON** (frontend → API) y **Mongoose ODM** (API → base de datos).

#### Diagrama de despliegue

→ [`Análisis/Arquitectura/Despliegue.puml`](Análisis/Arquitectura/Despliegue.puml) · [`Despliegue.png`](Análisis/Arquitectura/Despliegue.png)

Tres nodos físicos: dispositivo del usuario (React SPA), servidor de aplicación (Node.js + Express con middleware JWT para control de acceso por rol) y servidor de base de datos (MongoDB).

---

### Casos de uso

Diagramas de secuencia que modelan las funcionalidades principales. Actores del sistema:

| Actor | Capacidades principales |
|-------|------------------------|
| **Logopeda** | Gestionar pacientes, crear/publicar actividades, asignar y recomendar, registrar sesiones, consultar progreso |
| **Familia** | Realizar actividades asignadas, consultar progreso, leer recomendaciones |

#### Asignar Actividad
→ [`Análisis/Casos de uso/Asignar Actividad.puml`](Análisis/Casos%20de%20uso/Asignar%20Actividad.puml) · [`Asignar Actividad.png`](Análisis/Casos%20de%20uso/Asignar%20Actividad.png)

El Logopeda selecciona paciente y actividad; el `AsignacionController` crea una `AsignacionActividad` con estado `Pendiente`.

#### Publicar Actividad
→ [`Análisis/Casos de uso/Publicar Actividad.puml`](Análisis/Casos%20de%20uso/Publicar%20Actividad.puml) · [`Publicar Actividad.png`](Análisis/Casos%20de%20uso/Publicar%20Actividad.png)

El Logopeda revisa un borrador y lo publica. Incluye flujo alternativo para contenido incompleto (validación en modelo).

#### Realizar Actividad
→ [`Análisis/Casos de uso/Realizar Actividad.puml`](Análisis/Casos%20de%20uso/Realizar%20Actividad.puml) · [`Realizar Actividad.png`](Análisis/Casos%20de%20uso/Realizar%20Actividad.png)

La Familia realiza una actividad asignada. El `SesionController` gestiona el ciclo de vida de la sesión (creación → bucle de ejercicios → finalización con resultados).

#### Recomendar Actividad
→ [`Análisis/Casos de uso/Recomendar Actividad.puml`](Análisis/Casos%20de%20uso/Recomendar%20Actividad.puml) · [`Recomendar Actividad.png`](Análisis/Casos%20de%20uso/Recomendar%20Actividad.png)

El Logopeda adjunta instrucciones personalizadas a una actividad; se persiste como `Registro` de tipo `RECOMENDACION` visible para la Familia.

#### Registrar Sesión
→ [`Análisis/Casos de uso/Registrar Sesión.puml`](Análisis/Casos%20de%20uso/Registrar%20Sesión.puml) · [`Registrar Sesión.png`](Análisis/Casos%20de%20uso/Registrar%20Sesión.png)

El Logopeda registra manualmente una sesión presencial con observaciones, aciertos y errores.

#### Ver Progreso Paciente
→ [`Análisis/Casos de uso/Ver Progreso Paciente.puml`](Análisis/Casos%20de%20uso/Ver%20Progreso%20Paciente.puml) · [`Ver Progreso Paciente.png`](Análisis/Casos%20de%20uso/Ver%20Progreso%20Paciente.png)

Accesible para Logopeda y Familia. Muestra métricas y gráficas de evolución a partir de las sesiones registradas; flujo alternativo si aún no hay datos.

---

### Diagrama de clases

→ [`Análisis/Clases/Clases.puml`](Análisis/Clases/Clases.puml) · [`Clases.png`](Análisis/Clases/Clases.png)

Modelo de dominio completo en patrón MVC. Clases principales del modelo:

| Clase | Descripción |
|-------|-------------|
| `Usuario` | Autenticación y rol (`LOGOPEDA` / `FAMILIA`) |
| `Paciente` | Perfil con nivel actual |
| `Actividad` | Contenido terapéutico con estado (`BORRADOR` / `DISPONIBLE` / `ARCHIVADA`) |
| `AsignacionActividad` | Vinculación paciente-actividad con progreso |
| `Sesion` | Registro de práctica (aciertos, errores, estado del flujo) |
| `Registro` | Notas, recordatorios y recomendaciones |
| `Categoria` / `Pictograma` | Clasificación y recursos visuales |

---

### Diagrama de paquetes

→ [`Análisis/Paquetes/Paquetes.puml`](Análisis/Paquetes/Paquetes.puml) · [`Paquetes.png`](Análisis/Paquetes/Paquetes.png)

Organización en paquetes con dependencias siempre en la dirección **vista → controlador → modelo**:

```
modelo              (usuario · terapia · actividad · comunicacion)
controlador         (auth · terapia · actividad · comunicacion)
vista               (logopeda · familia · compartida)
```

---

## [Parte II — Diseño](Diseño/README_Disenyo.md)

El código está organizado en tres versiones que muestran la evolución del diseño desde el análisis básico hasta los principios SOLID, siguiendo el temario de la asignatura.

| Versión | Carpeta | Qué aplica | Puerto |
|---------|---------|-----------|--------|
| V1 | [`Diseño/v1-disenyo-base/`](Diseño/v1-disenyo-base/) | Análisis y diseño estructural: MVC, relaciones entre clases, arquitectura en capas | 3000 |
| V2 | [`Diseño/v2-disenyo-modular/`](Diseño/v2-disenyo-modular/) | Diseño modular: cohesión, acoplamiento, patrón experto, DRY, SRP básico | 3001 |
| V3 | [`Diseño/v3-disenyo-oo/`](Diseño/v3-disenyo-oo/) | Diseño OO: SOLID completo (SRP, OCP, LSP, ISP, DIP) | 3002 |

Cada versión es **autónoma** — tiene su propio `package.json`, puede arrancarse por separado y conectarse a la misma base de datos o a bases distintas.

---

### Requisitos comunes

- Node.js 18+ → `brew install node`
- MongoDB → `brew install mongodb-community && brew services start mongodb-community`
- O una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

### Arrancar una versión

```bash
# Ejemplo con V1 (igual para V2 con puerto 3001, V3 con puerto 3002)
cd Diseño/v1-disenyo-base
npm install
cp .env.example .env   # editar con tu MONGODB_URI y JWT_SECRET
npm run dev
open http://localhost:3000/compartida/login.html
```

#### Crear usuarios de prueba

```bash
# Logopeda
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana García","email":"ana@caa.com","password":"1234","rol":"LOGOPEDA"}'

# Familia
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Familia López","email":"familia@caa.com","password":"1234","rol":"FAMILIA"}'
```

---

### Evolución del diseño

#### De V1 a V2 — Diseño Modular

| Code smell | Fichero V1 | Corrección V2 |
|-----------|-----------|--------------|
| Data Class (`Sesion` sin comportamiento) | `models/terapia/Sesion.js` | Añade `registrarRespuesta()`, `finalizar()`, `getPorcentajeAciertos()` |
| Data Class (`Actividad` sin comportamiento) | `models/actividad/Actividad.js` | Añade `publicar()`, `archivar()` |
| Misplaced Responsibility (cálculo de % en controlador) | `controllers/terapia/SesionController.js` | Delega a `sesion.getPorcentajeAciertos()` |
| Misplaced Responsibility (transiciones en controlador) | `controllers/actividad/ActividadController.js` | Delega a `actividad.publicar()` |
| SRP violado (dos actores en `SesionController`) | `controllers/terapia/SesionController.js` | Separa en `PracticaController` + `SesionController` |
| DIP básico (acoplamiento a `console.log`) | `controllers/comunicacion/RegistroController.js` | Función `notificar()` local como abstracción básica |

#### De V2 a V3 — Diseño Orientado a Objetos

| Principio | Fichero V2 | Corrección V3 | Fichero(s) V3 |
|-----------|-----------|--------------|--------------|
| OCP | `ActividadController.js` — if/else por tipo | Patrón Estrategia | `models/actividad/estrategias/` |
| LSP | Sin contrato en estrategias | Precondiciones + postcondiciones | `EstrategiaContenido.js` |
| ISP | `middleware/auth.js` sin roles | Routers segregados por actor | `routes/logopeda/` + `routes/familia/` |
| DIP | Notificación como función local | `INotificador` + inyección | `services/notificacion/` + `config/dependencias.js` |

---

### Estructura comparada de directorios

```
V1                              V2 (añade)                V3 (añade sobre V2)
──────────────────────────────  ────────────────────────  ─────────────────────────────────
src/
├── models/
│   ├── terapia/Sesion.js       ← métodos propios          (igual que V2)
│   ├── actividad/Actividad.js  ← publicar/archivar        (igual que V2)
│   │                                                      └── estrategias/
│   │                                                          ├── EstrategiaContenido.js
│   │                                                          ├── EstrategiaPictograma.js
│   │                                                          ├── EstrategiaAudio.js
│   │                                                          ├── EstrategiaTexto.js
│   │                                                          └── RegistroEstrategias.js
├── controllers/
│   └── terapia/
│       └── SesionController.js ← PracticaController.js    (igual que V2)
│                                  SesionController.js
├── middleware/
│   └── auth.js                 (igual)                    ← soloLogopeda, soloFamilia
│                                                      ├── routes/logopeda/
│                                                      │   ├── actividadRoutes.js
│                                                      │   ├── pacienteRoutes.js
│                                                      │   ├── sesionRoutes.js
│                                                      │   ├── registroRoutes.js
│                                                      │   └── progresoRoutes.js
│                                                      ├── routes/familia/
│                                                      │   ├── actividadRoutes.js
│                                                      │   ├── practicaRoutes.js
│                                                      │   └── registroRoutes.js
│                                                      ├── services/notificacion/
│                                                      │   ├── INotificador.js
│                                                      │   ├── NotificadorConsola.js
│                                                      │   └── NotificadorEmail.js
│                                                      └── config/
│                                                          └── dependencias.js
```

---

### Ficheros que no cambian entre versiones

Correctos desde V1, sin modificaciones en V2 ni V3:

- `models/usuario/Usuario.js`
- `models/terapia/Paciente.js`
- `models/comunicacion/Registro.js`
- `models/actividad/AsignacionActividad.js`
- `controllers/auth/AuthController.js`
- `controllers/terapia/PacienteController.js`
- `controllers/actividad/AsignacionController.js`
- `controllers/actividad/RecomendacionController.js`
- `views/` — HTML idéntico en las tres versiones

---

### Lectura recomendada por versión

- **V1** → revisar `SesionController.js` para identificar los problemas de diseño.
- **V2** → comparar `models/terapia/Sesion.js` de V1 y V2 línea a línea.
- **V3** → leer `models/actividad/estrategias/EstrategiaContenido.js` + `RegistroEstrategias.js`, luego comparar `ActividadController.js` de V2 vs V3.
