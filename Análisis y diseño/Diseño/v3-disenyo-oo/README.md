# V3 — Diseño Orientado a Objetos (SOLID)

Esta versión aplica los cinco principios SOLID sobre la base de V2. Cada corrección elimina un problema concreto identificado en las versiones anteriores y hace el sistema extensible sin modificar código existente.

---

## Qué cambia respecto a V2

### ✅ SRP — `SesionController` ya aplicado en V2, confirmado en V3

La separación `PracticaController` (Familia) / `SesionController` (Logopeda) se mantiene y es la base sobre la que se construye ISP en V3.

---

### ✅ OCP — Patrón Estrategia para tipos de actividad

**Problema V2:** `ActividadController.getActividad()` tenía un `if/else` por tipo. Añadir `VIDEO` obligaba a abrir y modificar el controlador.

```js
// V2: viola OCP — cada nuevo tipo abre este fichero
if (actividad.tipo === 'PICTOGRAMA') { ... }
else if (actividad.tipo === 'AUDIO') { ... }
else if (actividad.tipo === 'TEXTO') { ... }
```

**Solución V3:** patrón Estrategia. El punto de variación (el tipo) se encapsula en clases independientes.

```
models/actividad/estrategias/
├── EstrategiaContenido.js      ← clase base con contrato formal (LSP)
├── EstrategiaPictograma.js     ← implementación concreta
├── EstrategiaAudio.js          ← implementación concreta
├── EstrategiaTexto.js          ← implementación concreta
└── RegistroEstrategias.js      ← punto de extensión — aquí se registran los tipos
```

**Para añadir el tipo VIDEO:**
1. Crear `EstrategiaVideo.js` extendiendo `EstrategiaContenido`
2. Registrarla en `RegistroEstrategias.js`
3. `ActividadController.js` **no cambia**

```js
// V3: ActividadController.getActividad() — sin condicionales
const estrategia = getEstrategia(actividad.tipo);  // un solo punto de variación
const contenido  = estrategia.renderizar(actividad);
res.json({ actividad, contenido });
```

---

### ✅ LSP — Contrato formal en `EstrategiaContenido`

**Problema potencial:** sin contrato, una estrategia podría incumplir las postcondiciones (devolver `null`, no devolver `tipo`, lanzar excepción inesperada) y romper `ActividadController` sin que él pueda saberlo de antemano.

**Solución V3:** `EstrategiaContenido` define precondiciones, postcondiciones e invariantes. Todas las subclases son sustituibles sin sorpresas.

```js
// EstrategiaContenido.js
renderizar(actividad) {
  if (!actividad)           throw new Error('Precondición: actividad requerida');
  if (!actividad.contenido) throw new Error('Precondición: contenido requerido');
  const resultado = this._renderizar(actividad);
  if (!resultado || !resultado.tipo) throw new Error('Postcondición: resultado debe tener tipo');
  return resultado;
}
```

Las subclases implementan `_renderizar()` y `_validar()`. El contrato público lo gestiona la clase base. Una `EstrategiaVideo` incorrecta falla en el contrato, no silenciosamente en el controlador.

---

### ✅ ISP — Rutas segregadas por actor

**Problema V2:** todos los endpoints eran accesibles por cualquier usuario autenticado. El middleware solo verificaba token, no rol.

**Solución V3:** cada actor tiene su propio conjunto de rutas con el middleware de rol aplicado. Logopeda y Familia no se ven afectados por los cambios del otro.

```
routes/
├── logopeda/
│   ├── actividadRoutes.js   ← GET, POST, PUT publicar/archivar
│   ├── pacienteRoutes.js    ← CRUD completo
│   ├── sesionRoutes.js      ← crear y consultar sesiones clínicas
│   ├── registroRoutes.js    ← crear, editar, eliminar registros
│   └── progresoRoutes.js    ← ver progreso (compartido)
└── familia/
    ├── actividadRoutes.js   ← solo GET disponibles (sin crear ni publicar)
    ├── practicaRoutes.js    ← iniciar, responder, finalizar práctica
    └── registroRoutes.js    ← solo GET registros
```

```js
// Familia no puede crear actividades — solo verlas
// Si alguien añade un endpoint de logopeda, familia no se ve afectada
router.use(soloFamilia);          // middleware de rol en el router
router.get('/:id', ActividadController.getActividad);
router.get('/',    ActividadController.listarActividadesDisponibles);
```

---

### ✅ DIP — Inversión de dependencias en notificaciones

**Problema V2:** `RegistroController` dependía de una función local de consola. Si cambiamos a email real o push, toca el controlador.

**Solución V3:** `RegistroController` depende de `INotificador` (abstracción estable), no de `NotificadorEmail` ni de `NotificadorConsola` (detalles concretos).

```
services/notificacion/
├── INotificador.js          ← abstracción: contrato que todo notificador cumple
├── NotificadorConsola.js    ← implementación desarrollo/test
└── NotificadorEmail.js      ← implementación producción

config/
└── dependencias.js          ← punto de ensamblado: decide qué implementación usar
```

```js
// dependencias.js — cambiar de email a push = cambiar una línea aquí
const notificador = process.env.NODE_ENV === 'production'
  ? new NotificadorEmail()
  : new NotificadorConsola();

// RegistroController.js — no sabe qué implementación hay detrás
await notificador.notificar(destinatario, asunto, mensaje);
```

---

## Estructura de directorios completa

```
v3-disenyo-oo/
├── .env.example
├── package.json
├── src/
│   ├── server.js                              ← rutas montadas por actor con prefijo /logopeda /familia
│   ├── config/
│   │   └── dependencias.js                   ← ✅ DIP: punto de ensamblado
│   ├── middleware/
│   │   └── auth.js                           ← ✅ ISP: verificarToken + soloLogopeda + soloFamilia + logopedaOFamilia
│   ├── models/
│   │   ├── usuario/
│   │   │   └── Usuario.js
│   │   ├── terapia/
│   │   │   ├── Paciente.js
│   │   │   └── Sesion.js                     ← métodos completos (de V2)
│   │   ├── actividad/
│   │   │   ├── Actividad.js                  ← métodos de ciclo de vida (de V2)
│   │   │   ├── AsignacionActividad.js
│   │   │   └── estrategias/
│   │   │       ├── EstrategiaContenido.js    ← ✅ OCP+LSP: contrato formal
│   │   │       ├── EstrategiaPictograma.js   ← ✅ OCP: implementación concreta
│   │   │       ├── EstrategiaAudio.js        ← ✅ OCP: implementación concreta
│   │   │       ├── EstrategiaTexto.js        ← ✅ OCP: implementación concreta
│   │   │       └── RegistroEstrategias.js    ← ✅ OCP: punto de extensión
│   │   └── comunicacion/
│   │       └── Registro.js
│   ├── services/
│   │   └── notificacion/
│   │       ├── INotificador.js               ← ✅ DIP: abstracción
│   │       ├── NotificadorConsola.js         ← ✅ DIP: implementación dev
│   │       └── NotificadorEmail.js           ← ✅ DIP: implementación prod
│   ├── controllers/
│   │   ├── auth/
│   │   │   └── AuthController.js
│   │   ├── terapia/
│   │   │   ├── PacienteController.js
│   │   │   ├── PracticaController.js         ← SRP: solo Familia (de V2)
│   │   │   ├── SesionController.js           ← SRP: solo Logopeda (de V2)
│   │   │   └── ProgresoController.js
│   │   ├── actividad/
│   │   │   ├── ActividadController.js        ← ✅ OCP: sin if/else por tipo
│   │   │   ├── AsignacionController.js
│   │   │   └── RecomendacionController.js
│   │   └── comunicacion/
│   │       └── RegistroController.js         ← ✅ DIP: usa INotificador
│   └── routes/
│       ├── logopeda/                         ← ✅ ISP: interfaz del Logopeda
│       │   ├── actividadRoutes.js
│       │   ├── pacienteRoutes.js
│       │   ├── sesionRoutes.js
│       │   ├── registroRoutes.js
│       │   └── progresoRoutes.js
│       └── familia/                          ← ✅ ISP: interfaz de la Familia
│           ├── actividadRoutes.js
│           ├── practicaRoutes.js
│           └── registroRoutes.js
└── views/
    ├── compartida/login.html
    ├── logopeda/dashboard.html
    └── familia/dashboard.html
```

---

## Cómo montar y ejecutar

```bash
cd v3-disenyo-oo
npm install
cp .env.example .env
# Editar .env
npm run dev
open http://localhost:3002/compartida/login.html
```

El puerto por defecto en V3 es **3002** para poder correr las tres versiones simultáneamente.

### Endpoints organizados por actor

**Logopeda** (`Authorization: Bearer <token_logopeda>`)
```
POST   /api/auth/login
POST   /api/logopeda/pacientes
GET    /api/logopeda/pacientes
GET    /api/logopeda/pacientes/:id
PUT    /api/logopeda/pacientes/:id
POST   /api/logopeda/actividades
GET    /api/logopeda/actividades
GET    /api/logopeda/actividades/:id
PUT    /api/logopeda/actividades/:id/publicar
PUT    /api/logopeda/actividades/:id/archivar
POST   /api/logopeda/sesiones
GET    /api/logopeda/sesiones/:pacienteId
POST   /api/logopeda/registros
PUT    /api/logopeda/registros/:id
DELETE /api/logopeda/registros/:id
GET    /api/logopeda/progreso/:pacienteId
POST   /api/logopeda/asignaciones
POST   /api/logopeda/recomendaciones
```

**Familia** (`Authorization: Bearer <token_familia>`)
```
POST   /api/auth/login
GET    /api/familia/actividades
GET    /api/familia/actividades/:id
POST   /api/familia/practica
PUT    /api/familia/practica/:id/respuesta
PUT    /api/familia/practica/:id/finalizar
GET    /api/familia/registros/:pacienteId
GET    /api/familia/progreso/:pacienteId
```

---

## Cómo extender el sistema en V3

### Añadir un nuevo tipo de actividad (VIDEO)

```bash
# 1. Crear la estrategia
touch src/models/actividad/estrategias/EstrategiaVideo.js
```

```js
// EstrategiaVideo.js
const EstrategiaContenido = require('./EstrategiaContenido');
class EstrategiaVideo extends EstrategiaContenido {
  _renderizar(actividad) {
    return { tipo: 'VIDEO', url: actividad.contenido.urlVideo, duracion: actividad.contenido.duracion };
  }
  _validar(actividad) { return !!actividad.contenido.urlVideo; }
}
module.exports = new EstrategiaVideo();
```

```js
// RegistroEstrategias.js — añadir una línea
const EstrategiaVideo = require('./EstrategiaVideo');
const estrategias = { PICTOGRAMA: ..., AUDIO: ..., TEXTO: ..., VIDEO: EstrategiaVideo };
```

**`ActividadController.js` no se toca. Los tests existentes no se rompen.**

### Cambiar el canal de notificación a push

```js
// config/dependencias.js — cambiar una línea
const NotificadorPush = require('../services/notificacion/NotificadorPush');
const notificador = new NotificadorPush();
```

**`RegistroController.js` no se toca.**

---

## Resumen SOLID aplicado

| Principio | Problema resuelto | Fichero clave |
|-----------|------------------|---------------|
| **SRP** | `SesionController` con dos actores → dos controladores | `PracticaController.js` / `SesionController.js` |
| **OCP** | `if/else` por tipo → patrón Estrategia | `estrategias/` + `RegistroEstrategias.js` |
| **LSP** | Sin contrato → postcondiciones garantizadas | `EstrategiaContenido.js` |
| **ISP** | Middleware sin roles → routers por actor | `routes/logopeda/` / `routes/familia/` |
| **DIP** | Controlador acoplado a consola → interfaz `INotificador` | `services/notificacion/` + `config/dependencias.js` |
