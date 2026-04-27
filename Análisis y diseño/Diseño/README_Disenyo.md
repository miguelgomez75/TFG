# Sistema CAA — Diseño en tres versiones

Aplicación de Comunicación Aumentativa y Alternativa (CAA) desarrollada como TFG. El código está organizado en tres versiones que muestran la evolución del diseño desde el análisis básico hasta los principios SOLID, siguiendo el temario de la asignatura.

---

## Las tres versiones

| Versión | Carpeta | Qué aplica | Puerto |
|---------|---------|-----------|--------|
| V1 | `v1-disenyo-base/` | Análisis y diseño estructural: MVC, relaciones entre clases, arquitectura en capas | 3000 |
| V2 | `v2-disenyo-modular/` | Diseño modular: cohesión, acoplamiento, patrón experto, DRY, SRP básico | 3001 |
| V3 | `v3-disenyo-oo/` | Diseño OO: SOLID completo (SRP, OCP, LSP, ISP, DIP) | 3002 |

Cada versión es **autónoma** — tiene su propio `package.json`, puede arrancarse por separado y conectarse a la misma base de datos o a bases distintas.

---

## Requisitos comunes

- Node.js 18+ → `brew install node`
- MongoDB → `brew install mongodb-community && brew services start mongodb-community`
- O una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Arrancar una versión

```bash
# Ejemplo con V1 (igual para V2 con puerto 3001, V3 con puerto 3002)
cd v1-disenyo-base
npm install
cp .env.example .env   # editar con tu MONGODB_URI y JWT_SECRET
npm run dev
open http://localhost:3000/compartida/login.html
```

### Crear usuarios de prueba

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

## Evolución del diseño — qué se corrige en cada paso

### De V1 a V2 — Diseño Modular

| Code smell | Fichero V1 | Corrección V2 |
|-----------|-----------|--------------|
| Data Class (Sesion sin comportamiento) | `models/terapia/Sesion.js` | Añade `registrarRespuesta()`, `finalizar()`, `getPorcentajeAciertos()` |
| Data Class (Actividad sin comportamiento) | `models/actividad/Actividad.js` | Añade `publicar()`, `archivar()` |
| Misplaced Responsibility (cálculo de % en controlador) | `controllers/terapia/SesionController.js` | Delega a `sesion.getPorcentajeAciertos()` |
| Misplaced Responsibility (transiciones en controlador) | `controllers/actividad/ActividadController.js` | Delega a `actividad.publicar()` |
| SRP violado (dos actores en SesionController) | `controllers/terapia/SesionController.js` | Separa en `PracticaController` + `SesionController` |
| DIP básico (acoplamiento a console.log) | `controllers/comunicacion/RegistroController.js` | Función `notificar()` local como abstracción básica |

### De V2 a V3 — Diseño Orientado a Objetos

| Principio | Fichero V2 | Corrección V3 | Fichero(s) V3 |
|-----------|-----------|--------------|--------------|
| OCP | `ActividadController.js` — if/else por tipo | Patrón Estrategia | `models/actividad/estrategias/` |
| LSP | Sin contrato en estrategias | Precondiciones + postcondiciones | `EstrategiaContenido.js` |
| ISP | `middleware/auth.js` sin roles | Routers segregados por actor | `routes/logopeda/` + `routes/familia/` |
| DIP | Notificación como función local | `INotificador` + inyección | `services/notificacion/` + `config/dependencias.js` |

---

## Estructura comparada de directorios

```
V1                              V2 (añade)              V3 (añade sobre V2)
─────────────────────────────   ─────────────────────   ──────────────────────────────────
src/
├── models/
│   ├── terapia/Sesion.js       ← métodos propios        (igual que V2)
│   ├── actividad/Actividad.js  ← publicar/archivar      (igual que V2)
│   │                                                    └── estrategias/
│   │                                                        ├── EstrategiaContenido.js
│   │                                                        ├── EstrategiaPictograma.js
│   │                                                        ├── EstrategiaAudio.js
│   │                                                        ├── EstrategiaTexto.js
│   │                                                        └── RegistroEstrategias.js
├── controllers/
│   └── terapia/
│       └── SesionController.js ← PracticaController.js  (igual que V2)
│                                  SesionController.js
├── middleware/
│   └── auth.js                 (igual)                  ← soloLogopeda, soloFamilia
│                                                    ├── routes/logopeda/
│                                                    │   ├── actividadRoutes.js
│                                                    │   ├── pacienteRoutes.js
│                                                    │   ├── sesionRoutes.js
│                                                    │   ├── registroRoutes.js
│                                                    │   └── progresoRoutes.js
│                                                    ├── routes/familia/
│                                                    │   ├── actividadRoutes.js
│                                                    │   ├── practicaRoutes.js
│                                                    │   └── registroRoutes.js
│                                                    ├── services/notificacion/
│                                                    │   ├── INotificador.js
│                                                    │   ├── NotificadorConsola.js
│                                                    │   └── NotificadorEmail.js
│                                                    └── config/
│                                                        └── dependencias.js
```

---

## Ficheros que no cambian entre versiones

Estos ficheros son correctos desde V1 y no necesitan modificación en V2 ni V3:

- `models/usuario/Usuario.js` — entidad estable
- `models/terapia/Paciente.js` — entidad estable
- `models/comunicacion/Registro.js` — entidad estable
- `models/actividad/AsignacionActividad.js` — recibe métodos en V2, estable en V3
- `controllers/auth/AuthController.js` — autenticación sin lógica de dominio
- `controllers/terapia/PacienteController.js` — CRUD simple, sin lógica compleja
- `controllers/actividad/AsignacionController.js` — delegación simple
- `controllers/actividad/RecomendacionController.js` — delegación simple
- `views/` — HTML idéntico en las tres versiones

---

## Lectura recomendada por versión

- **V1** → leer `README.md` de V1, luego revisar `SesionController.js` para ver los problemas
- **V2** → comparar `models/terapia/Sesion.js` de V1 y V2 línea a línea
- **V3** → leer `models/actividad/estrategias/EstrategiaContenido.js` + `RegistroEstrategias.js`, luego `ActividadController.js` de V2 vs V3
