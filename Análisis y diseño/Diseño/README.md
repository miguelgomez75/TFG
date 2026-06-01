# CAA — Adaptación RUP (v3 → v4-rup)

Esta versión adapta el código V3-SOLID para seguir fielmente los diagramas MVC
del análisis RUP. Se mantienen Node.js + Express + Mongoose + JWT.

---

## Qué cambia respecto a V3

### Modelos nuevos / renombrados

| V3 | V4-RUP | Motivo |
|----|--------|--------|
| `Registro` | `RegistroClinico` | Nombre del diagrama RUP |
| — | `Categoria` | Aparece en crearActividad / editarActividad |
| — | `TipoActividad` | Aparece en el MVC general |
| — | `Pictograma` | Aparece en el MVC general |

### Controladores nuevos / renombrados

| V3 | V4-RUP | Motivo |
|----|--------|--------|
| `RegistroController` | `RegistroClinicoController` | Nombre del diagrama |
| `ProgresoController` (solo getProgreso) | `ProgresoController` con `calcularMetricas()` | CdU-06 separa fetch y cálculo |
| — | `CategoriaController` | crearActividad / editarActividad necesitan listarCategorias() |
| — | `AsignacionController` ampliado | getAsignacionesActivas() para familia (CdU verActividadesRecomendadas) |

### Métodos de controlador nuevos

- `PacienteController.listarPacientesActivos()` → alias de listarPacientes con filtro activo
- `ActividadController.listarDisponibles()` → alias de listarActividadesDisponibles
- `AsignacionController.getAsignacionesActivas()` → filtra estado PENDIENTE/EN_PROGRESO
- `RegistroClinicoController.getRecomendaciones()` → filtra tipo RECOMENDACION
- `RegistroClinicoController.guardarRegistro()` → crea registro con firma del diagrama
- `ProgresoController.calcularMetricas()` → separado del fetch
- `SesionController.guardarSesion()` → firma del CdU-05
- `SesionController.eliminarSesion()` → CdU eliminarSesion

### Rutas reorganizadas

Las rutas mantienen la segregación ISP de V3 (logopeda / familia) pero añaden
los endpoints que faltan según los diagramas.

### Vistas HTML

Se añaden / completan:
- `logopeda/sesiones.html` — SesionesAbiertasView
- `logopeda/registros.html` — RegistrosAbiertosView
- `logopeda/progreso.html` — VerProgresoView
- `familia/actividades-recomendadas.html` — ActividadesRecomendadasView
- `familia/realizar-actividad.html` — RealizarActividadView
- `familia/resultado-actividad.html` — ResultadoActividadView
- `familia/registros.html` — RegistrosFamiliaView
- `familia/progreso.html` — VerProgresoView (familia)

---

## Estructura de directorios

v4-rup/ <br>
├── [package.json](/package.json) <br>
├── [.env.example](/env.example) <br>
├── src/ <br>
│   ├── [server.js](/src/server.js) <br>
│   ├── config/ <br>
│   │   └── [dependencias.js](/src/config/dependencias.js) <br>
│   ├── middleware/ <br>
│   │   └── [auth.js](/src/middleware/auth.js) <br>
│   ├── models/ <br>
│   │   ├── usuario/ <br>
│   │   │   └── [Usuario.js](/src/models/usuario/Usuario.js) <br>
│   │   ├── terapia/ <br>
│   │   │   ├── [Paciente.js](/src/models/terapia/Paciente.js) <br>
│   │   │   └── [Sesion.js](/src/models/terapia/Sesion.js) <br>
│   │   ├── actividad/ <br>
│   │   │   ├── [Actividad.js](/src/models/actividad/Actividad.js) <br>
│   │   │   ├── [Categoria.js](/src/models/actividad/Categoria.js)           ← NUEVO <br>
│   │   │   ├── [TipoActividad.js](/src/models/actividad/TipoActividad.js)       ← NUEVO <br>
│   │   │   ├── [Pictograma.js](/src/models/actividad/Pictograma.js)          ← NUEVO <br>
│   │   │   ├── [AsignacionActividad.js](/src/models/actividad/AsignacionActividad.js) <br>
│   │   |   └── estrategias/           ← se mantiene de V3 <br>
│   │   |       ├── [EstrategiaAudio.js](/src/models/actividad/estrategias/EstrategiaAudio.js) <br>
│   │   |       ├── [EstrategiaContenido.js](/src/models/actividad/estrategias/EstrategiaContenido.js) <br>
│   │   |       ├── [EstrategiaPictograma.js](/src/models/actividad/estrategias/EstrategiaPictograma.js) <br>
│   │   |       ├── [EstrategiaTexto.js](/src/models/actividad/estrategias/EstrategiaTexto.js) <br>
│   │   |       └── [RegistroEstrategias.js](/src/models/actividad/estrategias/RegistroEstrategias.js) <br>
│   │   └── comunicacion/ <br>
│   │       └── [RegistroClinico.js](/src/models/comunicacion/RegistroClinico.js)     ← RENOMBRADO <br>
│   ├── services/ <br>
│   │   └── notificacion/ ← igual que V3 <br>
|   |       ├── [INotificador.js](/src/services/notificacion/INotificador.js) <br>
│   │       ├── [NotificadorConsola.js](/src/services/notificacion/NotificadorConsola.js) <br>
|   |       └── [NotificadorEmail.js](/src/services/notificacion/NotificadorEmail.js) <br>
│   ├── controllers/ <br>
│   │   ├── auth/ <br>
│   │   │   └── [AuthController.js](/src/controllers/auth/AuthController.js) <br>
│   │   ├── terapia/ <br>
│   │   │   ├── [PacienteController.js](/src/controllers/terapia/PacienteController.js)  ← +listarPacientesActivos <br>
│   │   │   ├── [PracticaController.js](/src/controllers/terapia/PracticaController.js) <br>
│   │   │   ├── [SesionController.js](/src/controllers/terapia/SesionController.js)    ← +guardarSesion, +eliminarSesion <br>
│   │   │   └── [ProgresoController.js](/src/controllers/terapia/ProgresoController.js)  ← +calcularMetricas separado <br>
│   │   ├── actividad/ <br>
│   │   │   ├── [ActividadController.js](/src/controllers/actividad/ActividadController.js) ← +listarDisponibles <br>
│   │   │   ├── [CategoriaController.js](/src/controllers/actividad/CategoriaController.js) ← NUEVO <br>
│   │   │   ├── [AsignacionController.js](/src/controllers/actividad/AsignacionController.js) ← +getAsignacionesActivas <br>
│   │   │   └── [RecomendacionController.js](/src/controllers/actividad/RecomendacionController.js) <br>
│   │   └── comunicacion/ <br>
│   │       └── [RegistroClinicoController.js](/src/controllers/comunicacion/RegistroClinicoController.js) ← RENOMBRADO + métodos RUP <br>
│   └── routes/ <br>
│       ├── logopeda/ <br>
│       │   ├── [actividadRoutes.js](/src/routes/logopeda/actividadRoutes.js) <br>
│       │   ├── [pacienteRoutes.js](/src/routes/logopeda/pacienteRoutes.js) <br>
│       │   ├── [sesionRoutes.js](/src/routes/logopeda/sesionRoutes.js)        ← +DELETE /:id <br>
│       │   ├── [registroRoutes.js](/src/routes/logopeda/registroRoutes.js) <br>
│       │   ├── [progresoRoutes.js](/src/routes/logopeda/progresoRoutes.js) <br>
│       │   └── [categoriaRoutes.js](/src/routes/logopeda/categoriaRoutes.js)     ← NUEVO <br>
│       └── familia/ <br>
│           ├── [actividadRoutes.js](/src/routes/familia/actividadRoutes.js) <br>
│           ├── [practicaRoutes.js](/src/routes/familia/practicaRoutes.js) <br>
│           ├── [registroRoutes.js](/src/routes/familia/registroRoutes.js) <br>
│           └── [progresoRoutes.js](/src/routes/familia/progresoRoutes.js)      ← NUEVO para familia <br>
└── views/ <br>
    ├── compartida/[login.html](/views/compartida/login.html) <br>
    ├── logopeda/ <br>
    │   ├── [actividades.html](/views/logopeda/actividades.html) <br> 
    │   ├── [categorias.html](/views/logopeda/categorias.html) <br>
    │   ├── [dashboard.html](/views/logopeda/dashboard.html) <br>
    │   ├── [pacientes.html](/views/logopeda/pacientes.html) <br>
    │   ├── [progreso.html](/views/logopeda/progreso.html) <br>
    │   ├── [registros.html](/views/logopeda/registros.html) <br>
    │   └── [sesiones.html](/views/logopeda/sesiones.html) <br>
    └── familia/ <br>
        ├── [actividades-recomendadas.html](/views/familia/actividades-recomendadas.html) <br>
        ├── [dashboard.html](/views/familia/dashboard.html) <br>
        ├── [progreso.html](/views/familia/progreso.html) <br>
        ├── [realizar-actividad.html](/views/familia/realizar-actividad.html) <br>
        ├── [registros.html](/views/familia/registros.html) <br>
        └── [resultado-actividad.html](/views/familia/resultado-actividad.html) <br>

---

## Endpoints completos

### Logopeda

```
POST   /api/auth/login
POST   /api/auth/register

GET    /api/logopeda/pacientes
GET    /api/logopeda/pacientes/activos          ← listarPacientesActivos (RUP)
POST   /api/logopeda/pacientes
GET    /api/logopeda/pacientes/:id
PUT    /api/logopeda/pacientes/:id
DELETE /api/logopeda/pacientes/:id

GET    /api/logopeda/actividades
GET    /api/logopeda/actividades/disponibles
POST   /api/logopeda/actividades
GET    /api/logopeda/actividades/:id
PUT    /api/logopeda/actividades/:id
PUT    /api/logopeda/actividades/:id/publicar
PUT    /api/logopeda/actividades/:id/archivar
DELETE /api/logopeda/actividades/:id

GET    /api/logopeda/categorias                 ← listarCategorias (RUP)
POST   /api/logopeda/categorias

POST   /api/logopeda/sesiones
GET    /api/logopeda/sesiones/:pacienteId
GET    /api/logopeda/sesiones/detalle/:id
PUT    /api/logopeda/sesiones/:id
DELETE /api/logopeda/sesiones/:id               ← eliminarSesion (RUP)

POST   /api/logopeda/registros
GET    /api/logopeda/registros/:pacienteId
PUT    /api/logopeda/registros/:id
DELETE /api/logopeda/registros/:id

GET    /api/logopeda/progreso/:pacienteId

POST   /api/logopeda/asignaciones
GET    /api/logopeda/asignaciones/:pacienteId
POST   /api/logopeda/recomendaciones
```

### Familia

```
GET    /api/familia/actividades
GET    /api/familia/actividades/:id
GET    /api/familia/actividades/recomendadas/:pacienteId  ← verActividadesRecomendadas

POST   /api/familia/practica
PUT    /api/familia/practica/:id/respuesta
PUT    /api/familia/practica/:id/finalizar

GET    /api/familia/registros/:pacienteId
GET    /api/familia/recomendaciones/:pacienteId           ← getRecomendaciones (RUP)

GET    /api/familia/progreso/:pacienteId
```

---

## Cómo arrancar

```bash
cd v4-rup
npm install
cp .env.example .env
# Editar .env con MONGODB_URI y JWT_SECRET
npm run dev
# Puerto por defecto: 3003
```
