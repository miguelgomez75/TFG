# V2 — Diseño Modular

Esta versión corrige los problemas de **cohesión, acoplamiento y tamaño** identificados en V1, aplicando los principios del diseño modular: patrón experto en la información, DRY, Misplaced Responsibility, y la primera aplicación de SRP. Los principios SOLID completos se aplican en V3.

---

## Qué cambia respecto a V1

### ✅ Corrección 1 — Data Class → clase con comportamiento (`Sesion.js`)

**Problema V1:** `Sesion` era un contenedor pasivo. La lógica de transiciones de estado y cálculo de métricas vivía dispersa en los controladores.

**Solución V2:** `Sesion` aplica el **patrón experto en la información** — el objeto sabe hacer lo que le corresponde.

```js
// V2: Sesion.js tiene métodos propios
sesionSchema.methods.registrarRespuesta = function(esAcierto) {
  if (this.estado !== 'EN_CURSO') throw new Error('La sesión no está en curso');
  if (esAcierto) this.aciertos++;
  else this.errores++;
};
sesionSchema.methods.finalizar             = function() { this.estado = 'FINALIZADA'; };
sesionSchema.methods.getPorcentajeAciertos = function() {
  const total = this.aciertos + this.errores;
  return total === 0 ? 0 : Math.round((this.aciertos / total) * 100);
};
```

Los controladores ahora delegan: `sesion.registrarRespuesta(esAcierto)` en lugar de hacer el cálculo ellos mismos.

---

### ✅ Corrección 2 — Data Class → clase con comportamiento (`Actividad.js`)

**Problema V1:** el controlador hacía `actividad.estado = 'DISPONIBLE'` directamente, duplicando la lógica de negocio en cada lugar que la necesitara.

**Solución V2:** `Actividad` conoce su propio ciclo de vida.

```js
// V2: Actividad.js tiene métodos de transición
actividadSchema.methods.publicar = function() {
  if (this.estado !== 'BORRADOR') throw new Error('Solo se puede publicar desde Borrador');
  this.estado = 'DISPONIBLE';
};
actividadSchema.methods.archivar = function() {
  if (this.estado !== 'DISPONIBLE') throw new Error('Solo se puede archivar desde Disponible');
  this.estado = 'ARCHIVADA';
};
```

**DRY aplicado:** la regla de transición existe una sola vez. Si cambia (ej. añadir validación extra antes de publicar), se cambia en un único sitio.

---

### ✅ Corrección 3 — Misplaced Responsibility en `ProgresoController.js`

**Problema V1:** `ProgresoController` duplicaba el cálculo de porcentaje por sesión, lógica que pertenece a `Sesion`.

**Solución V2:** delega en el modelo.
```js
// V1: duplicaba la fórmula
evolucion: sesiones.map(s => {
  const t = s.aciertos + s.errores;
  return { fecha: s.fecha, porcentaje: t === 0 ? 0 : Math.round((s.aciertos / t) * 100) };
})

// V2: delega al objeto que sabe hacerlo
evolucion: sesiones.map(s => ({ fecha: s.fecha, porcentaje: s.getPorcentajeAciertos() }))
```

---

### ✅ Corrección 4 — SRP parcial: `SesionController` dividido en dos

**Problema V1:** un solo controlador servía a dos actores con razones de cambio independientes.

**Solución V2:** dos controladores con responsabilidad única cada uno.

```
controllers/terapia/
├── PracticaController.js   ← actor: Familia, practica en casa
└── SesionController.js     ← actor: Logopeda, registra clínicamente
```

Si el flujo de práctica en casa cambia, solo se abre `PracticaController.js`. El código del registro clínico no se toca.

---

### ✅ Corrección 5 — Notificación desacoplada básicamente

**Problema V1:** `RegistroController` tenía `console.log(...)` directamente — acoplamiento a implementación concreta.

**Solución V2:** función local `notificar()` que actúa como abstracción básica. El controlador no sabe cómo se notifica, solo que se notifica. La inversión completa de dependencias se aplica en V3.

```js
// V2: abstracción básica local
const notificar = (destinatario, mensaje) => {
  console.log(`[NOTIFICACIÓN → ${destinatario}]: ${mensaje}`);
};
```

---

### ⚠ Lo que aún no está corregido en V2 (se corrige en V3)

| Problema | Dónde | Principio pendiente |
|----------|-------|-------------------|
| Condicional por tipo de actividad | `ActividadController.getActividad()` | OCP |
| Sin segregación de interfaces por actor | `middleware/auth.js` sin `soloLogopeda`/`soloFamilia` | ISP |
| Notificación no invertida formalmente | `RegistroController.js` | DIP completo |
| Sin contrato formal en estrategias | (no existen aún) | LSP |

---

## Estructura de directorios

```
v2-disenyo-modular/
├── .env.example
├── package.json
├── src/
│   ├── server.js                         ← rutas separadas por /practica y /sesiones
│   ├── middleware/
│   │   └── auth.js                       ← solo verifica token, sin roles aún
│   ├── models/
│   │   ├── usuario/
│   │   │   └── Usuario.js
│   │   ├── terapia/
│   │   │   ├── Paciente.js
│   │   │   └── Sesion.js                 ← ✅ métodos: registrarRespuesta, finalizar, getPorcentajeAciertos
│   │   ├── actividad/
│   │   │   ├── Actividad.js              ← ✅ métodos: publicar(), archivar(), estaDisponible()
│   │   │   └── AsignacionActividad.js    ← ✅ métodos: iniciar(), completar()
│   │   └── comunicacion/
│   │       └── Registro.js
│   ├── controllers/
│   │   ├── auth/
│   │   │   └── AuthController.js
│   │   ├── terapia/
│   │   │   ├── PacienteController.js
│   │   │   ├── PracticaController.js     ← ✅ NUEVO: solo actor Familia
│   │   │   ├── SesionController.js       ← ✅ ahora solo actor Logopeda
│   │   │   └── ProgresoController.js     ← ✅ delega cálculo al modelo
│   │   ├── actividad/
│   │   │   ├── ActividadController.js    ← ⚠ aún tiene if/else por tipo (se corrige en V3)
│   │   │   ├── AsignacionController.js
│   │   │   └── RecomendacionController.js
│   │   └── comunicacion/
│   │       └── RegistroController.js     ← ⚠ notificación mejorada pero no invertida aún
└── views/
    ├── compartida/login.html
    ├── logopeda/dashboard.html
    └── familia/dashboard.html
```

---

## Cómo montar y ejecutar

```bash
cd v2-disenyo-modular
npm install
cp .env.example .env
# Editar .env
npm run dev
open http://localhost:3001/compartida/login.html
```

El puerto por defecto en V2 es **3001** para poder correr V1 y V2 simultáneamente.

---

## Resumen de mejoras de diseño modular aplicadas

| Principio | Corrección | Fichero |
|-----------|-----------|---------|
| Experto en información | `Sesion` sabe registrar respuestas y calcular porcentaje | `models/terapia/Sesion.js` |
| DRY | Transiciones de estado una sola vez | `models/actividad/Actividad.js` |
| Misplaced Responsibility | `ProgresoController` delega al modelo | `controllers/terapia/ProgresoController.js` |
| Alta cohesión | Separación `PracticaController` / `SesionController` | `controllers/terapia/` |
| Data Class eliminado | Modelos con comportamiento propio | `models/terapia/Sesion.js`, `models/actividad/Actividad.js` |
