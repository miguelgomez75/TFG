# V1 — Diseño Base

Esta versión implementa el sistema CAA aplicando únicamente los principios de **análisis y diseño estructural**: identificación de clases Modelo/Vista/Controlador a partir de los Casos de Uso, relaciones entre clases y arquitectura en tres capas. No aplica aún diseño modular ni principios SOLID.

---

## Estructura de directorios

```
v1-disenyo-base/
├── .env.example                          ← variables de entorno necesarias
├── package.json
├── src/
│   ├── server.js                         ← punto de entrada, todas las rutas aquí
│   ├── middleware/
│   │   └── auth.js                       ← verificación JWT básica (sin roles)
│   ├── models/
│   │   ├── usuario/
│   │   │   └── Usuario.js                ← sin validaciones required
│   │   ├── terapia/
│   │   │   ├── Paciente.js
│   │   │   └── Sesion.js                 ← DATA CLASS: solo campos, sin métodos
│   │   ├── actividad/
│   │   │   ├── Actividad.js              ← DATA CLASS: sin publicar()/archivar()
│   │   │   └── AsignacionActividad.js    ← DATA CLASS: sin iniciar()/completar()
│   │   └── comunicacion/
│   │       └── Registro.js
│   ├── controllers/
│   │   ├── auth/
│   │   │   └── AuthController.js
│   │   ├── terapia/
│   │   │   ├── PacienteController.js
│   │   │   ├── SesionController.js       ← DOS ACTORES: Familia + Logopeda mezclados
│   │   │   └── ProgresoController.js     ← calcula porcentaje duplicando lógica de Sesion
│   │   ├── actividad/
│   │   │   ├── ActividadController.js    ← condicional if/else por tipo de actividad
│   │   │   ├── AsignacionController.js
│   │   │   └── RecomendacionController.js
│   │   └── comunicacion/
│   │       └── RegistroController.js     ← notificación acoplada directamente (console.log)
└── views/
    ├── compartida/
    │   └── login.html
    ├── logopeda/
    │   └── dashboard.html
    └── familia/
        └── dashboard.html
```

---

## Cómo montar y ejecutar

### Requisitos previos
- Node.js 18+ (en Mac: `brew install node`)
- MongoDB local (`brew install mongodb-community` + `brew services start mongodb-community`) o cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Pasos

```bash
# 1. Entrar al directorio
cd v1-disenyo-base

# 2. Instalar dependencias
npm install

# 3. Crear el fichero de entorno
cp .env.example .env
# Editar .env con tu editor y ajustar MONGODB_URI y JWT_SECRET

# 4. Arrancar en desarrollo
npm run dev

# 5. Abrir el navegador
open http://localhost:3000/compartida/login.html
```

### Crear un usuario de prueba (desde terminal)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Logopeda Test","email":"logo@test.com","password":"1234","rol":"LOGOPEDA"}'
```

---

## Problemas de diseño identificados en esta versión

Estas son las razones por las que se producen las versiones V2 y V3. Se listan aquí para que sean visibles junto al código que las origina.

### 1. Data Class — `Sesion.js`, `Actividad.js`, `AsignacionActividad.js`

Los modelos son contenedores pasivos de datos. Toda la lógica de negocio que les pertenece vive en los controladores.

**Síntoma en `SesionController.js`:**
```js
// La sesión no sabe registrar una respuesta — lo hace el controlador
if (esAcierto) sesion.aciertos++;
else sesion.errores++;

// La sesión no sabe calcular su porcentaje — lo calcula el controlador
const total = sesion.aciertos + sesion.errores;
const porcentaje = total === 0 ? 0 : Math.round((sesion.aciertos / total) * 100);
```

**Síntoma en `ActividadController.js`:**
```js
// La actividad no sabe publicarse — lo hace el controlador
if (actividad.estado !== 'BORRADOR') return res.status(400)...
actividad.estado = 'DISPONIBLE';
```

**Consecuencia:** si la regla de negocio cambia (ej. el porcentaje se calcula diferente), hay que buscarla y cambiarla en todos los controladores que la usen, no en un único lugar.

---

### 2. Misplaced Responsibility — lógica de negocio en controladores

La lógica que describe el comportamiento de una entidad (transiciones de estado, cálculos propios) vive fuera de esa entidad. El controlador sabe demasiado del interior del modelo.

---

### 3. SRP violado — `SesionController.js` tiene dos actores

```js
// Actor 1: Familia practica en casa
const iniciarSesion      = ...
const registrarRespuesta = ...
const finalizarSesion    = ...

// Actor 2: Logopeda registra clínicamente  ← razón de cambio diferente
const crearSesionClinica = ...
```

Si cambia el flujo de práctica en casa (Familia), se abre el mismo fichero que si cambia el registro clínico (Logopeda). Dos actores, una clase.

---

### 4. OCP violado — condicional por tipo en `ActividadController.js`

```js
if (actividad.tipo === 'PICTOGRAMA') { ... }
else if (actividad.tipo === 'AUDIO') { ... }
else if (actividad.tipo === 'TEXTO') { ... }
```

Añadir el tipo `VIDEO` obliga a abrir y modificar este controlador, arriesgando romper los tipos existentes.

---

### 5. ISP violado — `middleware/auth.js` sin segregación por rol

El middleware solo verifica que hay token, pero no controla el rol. Cualquier usuario autenticado (Logopeda o Familia) puede llamar a cualquier endpoint, incluidos los de gestión de pacientes o publicación de actividades.

---

### 6. DIP violado — `RegistroController.js` acoplado a notificación concreta

```js
// Acoplamiento directo a la implementación
console.log(`[EMAIL] Notificando a familia: ${registro.titulo}`);
```

Si cambiamos a notificaciones push o email real, hay que modificar este controlador.

---

## Lo que está bien en V1

- Separación en tres capas (modelos / controladores / vistas) correcta
- Identificación de clases MVC a partir de los Casos de Uso
- Relaciones entre entidades correctas (Sesion→Paciente, Sesion→Actividad, etc.)
- Autenticación JWT funcional
- Vistas HTML básicas por actor
