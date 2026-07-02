# Guía técnica del sistema CAA
## Qué hace cada clase, qué tecnología usa y por qué

Esta guía está pensada para poder explicar cualquier fichero del sistema en una defensa oral sin necesidad de recordar el código. Está organizada siguiendo la estructura del proyecto de dentro hacia fuera: primero los modelos (los datos), luego los servicios, luego los controladores (la lógica), luego las rutas (la entrada), y finalmente el servidor.

---

## 1. Punto de entrada — `src/server.js`

**Qué hace:**
Es el fichero que arranca toda la aplicación. Conecta a la base de datos, registra todas las rutas y pone el servidor a escuchar peticiones. Es el único fichero que "sabe" cómo está ensamblado el sistema completo.

**Tecnologías:**
- `express` — el framework que gestiona las peticiones HTTP entrantes y las enruta al controlador correcto.
- `mongoose` — establece la conexión con MongoDB Atlas al arrancar.
- `dotenv` — carga las variables de entorno desde el fichero `.env` (puerto, URI de base de datos, clave JWT) para que no estén escritas en el código.
- `path` — módulo nativo de Node.js para construir rutas de ficheros de forma compatible con cualquier sistema operativo.

**Por qué así:**
Express es el estándar de facto para APIs REST en Node.js por su sencillez y su ecosistema de middlewares. Separar la configuración del código en un `.env` es una práctica de seguridad básica: impide que credenciales como la URI de MongoDB o el secreto JWT queden expuestas en el repositorio.

---

## 2. Modelos

Los modelos representan las entidades del dominio. Cada uno define la estructura de los documentos que se guardarán en MongoDB y, en algunos casos, la lógica de negocio que les pertenece. Todos usan **Mongoose**, que actúa como puente entre el código JavaScript y MongoDB.

> **Por qué Mongoose:** MongoDB es flexible por naturaleza (no tiene esquema fijo), pero esa flexibilidad sin control puede introducir datos inconsistentes. Mongoose impone un esquema, valida los datos antes de guardarlos y proporciona una API de consulta expresiva. Es la capa de seguridad que compensa la ausencia de restricciones a nivel de base de datos.

---

### 2.1 `models/usuario/Usuario.js`

**Qué hace:**
Define la estructura de un usuario del sistema. Almacena nombre, email, contraseña (en formato hash, nunca en texto plano) y rol. El rol puede ser `LOGOPEDA` o `FAMILIA`, y es el dato que el sistema usa en cada petición para saber qué puede hacer el usuario que la realiza.

**Tecnologías:**
- `mongoose.Schema` — define los campos y sus tipos.
- El campo `email` tiene restricción `unique: true`, lo que hace que MongoDB rechace automáticamente dos usuarios con el mismo correo.

---

### 2.2 `models/terapia/Paciente.js`

**Qué hace:**
Representa a un paciente. Almacena sus datos clínicos básicos (nombre, fecha de nacimiento, nivel actual) y un campo `activo` para marcarlo como inactivo sin eliminarlo del historial. El campo más relevante es `codigoAcceso`, un código corto de formato `PAC-XXXX` que se genera automáticamente al crear el paciente y que el logopeda puede compartir con la familia para que esta identifique al paciente sin necesitar el identificador interno de MongoDB (que es una cadena hexadecimal de 24 caracteres, imposible de comunicar verbalmente).

**Tecnologías:**
- `mongoose.Schema.pre('save')` — un *hook* que se ejecuta automáticamente antes de cada guardado. Se usa aquí para generar el `codigoAcceso` si el paciente aún no tiene uno, garantizando que todos los pacientes tengan siempre un código único sin que el controlador tenga que ocuparse de ello.

**Por qué así:**
El hook `pre('save')` es la forma correcta de implementar lógica de inicialización en Mongoose: la responsabilidad de generar el código queda dentro del modelo (Patrón Experto en Información), y el controlador que crea el paciente no necesita saber nada sobre cómo funciona ese proceso.

---

### 2.3 `models/terapia/Sesion.js`

**Qué hace:**
Representa una sesión de práctica, ya sea registrada por el logopeda (presencial) o iniciada por la familia (en casa). Almacena cuántos aciertos y errores se produjeron, en qué estado está la sesión y notas del logopeda. Además de los datos, contiene los métodos de negocio: `registrarRespuesta()`, `finalizar()`, `pausar()`, `reanudar()` y `getPorcentajeAciertos()`.

**Tecnologías:**
- `mongoose.Schema.methods` — permite añadir métodos de instancia a los documentos de Mongoose. Gracias a esto, un objeto `sesion` recuperado de la base de datos tiene disponibles directamente los métodos de negocio, sin necesidad de clases auxiliares.

**Por qué así:**
Poner los métodos en el modelo, y no en el controlador, es la aplicación del Patrón Experto en Información: quien mejor conoce los datos de una sesión es la propia sesión, así que es ella quien debe calcular su porcentaje de aciertos o gestionar sus transiciones de estado. El controlador simplemente llama a esos métodos sin saber cómo están implementados.

---

### 2.4 `models/actividad/Actividad.js`

**Qué hace:**
Representa una actividad terapéutica. Tiene un ciclo de vida de tres estados (BORRADOR → DISPONIBLE → ARCHIVADA) gestionado mediante los métodos `publicar()` y `archivar()`, que comprueban que la transición es válida antes de ejecutarla. El campo `contenido` es de tipo `Object`, lo que permite almacenar estructuras distintas según el tipo de actividad sin cambiar el esquema.

**Tecnologías:**
- `mongoose.Schema` con `type: Object` para el campo `contenido` — acepta cualquier objeto JavaScript, lo que da la flexibilidad necesaria para los distintos tipos de actividad.

**Por qué así:**
En una base de datos relacional, los cuatro tipos de actividad obligarían a tener tablas separadas o una tabla con muchas columnas nulas. El campo `Object` de MongoDB resuelve esto de forma natural y está directamente alineado con el principio OCP: añadir un nuevo tipo de actividad no requiere modificar el esquema.

---

### 2.5 `models/actividad/AsignacionActividad.js`

**Qué hace:**
Representa la relación entre un paciente y una actividad asignada por el logopeda. Tiene tres estados: PENDIENTE (recién asignada), EN_PROGRESO (la familia ha iniciado la práctica) y COMPLETADA (la sesión ha finalizado). Los métodos `iniciar()` y `completar()` gestionan estas transiciones.

---

### 2.6 `models/actividad/Categoria.js`

**Qué hace:**
Representa una categoría temática (por ejemplo, "Vida cotidiana", "Emociones") que el logopeda puede asignar a sus actividades para organizarlas. Es una entidad simple con nombre y descripción.

---

### 2.7 `models/actividad/TipoActividad.js` y `models/actividad/Pictograma.js`

**Qué hacen:**
Son modelos definidos en el diagrama MVC del análisis RUP que representan, respectivamente, el catálogo de tipos de actividad disponibles y los recursos visuales reutilizables entre actividades. En la implementación actual su gestión se realiza directamente a través del campo `tipo` de `Actividad` y las URLs del contenido, por lo que estos modelos están presentes en la arquitectura como punto de extensión para futuras iteraciones.

---

### 2.8 `models/comunicacion/RegistroClinico.js`

**Qué hace:**
Representa cualquier anotación que el logopeda asocia a un paciente. El campo `tipo` diferencia tres variantes: `REGISTRO` (nota clínica general), `RECOMENDACION` (instrucción para practicar en casa, vinculada a una actividad) y `NOTA` (observación informal). Esta distinción permite que la familia filtre y vea solo las recomendaciones que le corresponden, sin acceder a las notas clínicas internas.

---

## 3. Estrategias de contenido

El patrón Estrategia es la pieza técnica más importante del sistema. Permite que el sistema soporte múltiples tipos de actividad sin un único bloque de `if/else` que habría que modificar cada vez que se añade un tipo nuevo. Esto es la aplicación directa del principio OCP.

---

### 3.1 `models/actividad/estrategias/EstrategiaContenido.js`

**Qué hace:**
Es la clase base abstracta que define el contrato que todas las estrategias deben cumplir. Declara dos métodos: `renderizar()` (transforma el contenido almacenado en un objeto listo para mostrar en la vista) y `validar()` (comprueba que el contenido es suficiente para publicar la actividad). Ambos métodos incluyen precondiciones y postcondiciones explícitas, aplicando el principio LSP: cualquier estrategia concreta puede sustituir a esta sin que el sistema se rompa.

**Tecnologías:**
- JavaScript puro con clases ES6. No necesita librería porque el patrón se implementa mediante herencia de clases nativa.

---

### 3.2 `EstrategiaPictograma.js`, `EstrategiaTexto.js`, `EstrategiaAudio.js`, `EstrategiaVideo.js`

**Qué hacen:**
Cada una implementa `_renderizar()` y `_validar()` para su tipo específico:

- **Pictograma** — valida que cada apartado tenga al menos una URL de imagen y una descripción. Renderiza el array de imágenes para mostrarlas en la vista.
- **Texto** — valida que cada apartado tenga un enunciado y al menos una palabra. Renderiza las palabras como elementos visuales individuales.
- **Audio** — valida que cada apartado tenga una URL de mp3 y una transcripción de referencia. Renderiza el reproductor de audio.
- **Vídeo** — mismo patrón que Audio pero para mp4. Está implementado como placeholder para uso futuro.

**Por qué así:**
Cada estrategia es un fichero independiente. Añadir un tipo nuevo (por ejemplo, `EstrategiaSignos` para lengua de signos) significa crear un fichero nuevo y registrarlo en `RegistroEstrategias.js`. Ningún otro fichero del sistema necesita modificarse. Esto es exactamente lo que garantiza el principio OCP.

---

### 3.3 `models/actividad/estrategias/RegistroEstrategias.js`

**Qué hace:**
Es el punto central de registro de estrategias. Mantiene un mapa `{ tipo → estrategia }` y expone la función `getEstrategia(tipo)` que devuelve la estrategia correcta para un tipo dado. Si el tipo no existe, lanza un error descriptivo.

**Por qué así:**
Centralizar el registro en un único fichero significa que `ActividadController` nunca necesita importar estrategias individualmente. Solo llama a `getEstrategia(actividad.tipo)` y obtiene el objeto correcto. El controlador no sabe ni le importa qué estrategias existen, lo que lo desacopla completamente de los tipos concretos.

---

## 4. Servicios de notificación

### 4.1 `services/notificacion/INotificador.js`

**Qué hace:**
Define la interfaz (contrato) que cualquier canal de notificación debe implementar. Solo declara el método `notificar(destinatario, asunto, mensaje)`.

**Por qué así:**
Esto es la aplicación del principio DIP: `RegistroClinicoController` depende de esta abstracción, no de ningún canal concreto. Si mañana se cambia de email a SMS o a notificaciones push, el controlador no necesita tocarse.

---

### 4.2 `NotificadorConsola.js` y `NotificadorEmail.js`

**Qué hacen:**
Son las dos implementaciones concretas. `NotificadorConsola` imprime la notificación en la terminal del servidor (útil durante el desarrollo para verificar que el sistema intenta notificar sin necesitar una cuenta de email configurada). `NotificadorEmail` está preparada para conectar con un proveedor como Nodemailer en producción.

---

### 4.3 `config/dependencias.js`

**Qué hace:**
Es el punto de ensamblado del sistema (también llamado *composition root*). Lee la variable de entorno `NODE_ENV` y decide qué implementación concreta de `INotificador` inyectar. Si el entorno es producción, usa `NotificadorEmail`; en cualquier otro caso, usa `NotificadorConsola`.

**Por qué así:**
Cambiar el canal de notificación en todo el sistema es una modificación de una sola línea en este fichero. Ningún controlador ni modelo necesita saber qué canal se está usando. Esto es la aplicación práctica del principio DIP.

---

## 5. Middleware

### 5.1 `middleware/auth.js`

**Qué hace:**
Contiene cuatro funciones que actúan como filtros en las rutas:

- `verificarToken` — extrae el token JWT de la cabecera `Authorization`, lo verifica con la clave secreta y, si es válido, añade los datos del usuario al objeto `req` para que los controladores puedan acceder a ellos. Si el token no existe o ha expirado, devuelve un error 401.
- `soloLogopeda` — comprueba que el usuario del token tiene rol `LOGOPEDA`. Si no, devuelve 403.
- `soloFamilia` — igual pero para rol `FAMILIA`.
- `logopedaOFamilia` — permite el acceso a cualquiera de los dos roles (usado en las rutas de progreso, que son accesibles para ambos actores).

**Tecnologías:**
- `jsonwebtoken` — librería que implementa el estándar JWT (RFC 7519). Proporciona `jwt.verify()` para comprobar la firma del token y extraer su contenido.

**Por qué así:**
Separar la verificación del token de la comprobación del rol permite encadenar los middlewares de forma flexible. Una ruta protegida aplica primero `verificarToken` (¿estás autenticado?) y luego `soloLogopeda` (¿tienes el rol correcto?). Esto es la aplicación del principio ISP: cada función tiene una responsabilidad única y las rutas de cada actor son completamente independientes entre sí.

**Qué es JWT y por qué:**
JWT (JSON Web Token) es un estándar para transmitir información de forma segura entre dos partes. En este sistema, cuando el usuario hace login, el servidor genera un token firmado con una clave secreta que incluye el ID del usuario y su rol. En cada petición posterior, el cliente envía ese token y el servidor puede verificar su autenticidad sin consultar la base de datos. Esto lo hace *stateless*: el servidor no necesita mantener sesiones en memoria, lo que facilita el escalado.

---

## 6. Controladores

Los controladores son la capa intermedia entre las rutas (que reciben las peticiones HTTP) y los modelos (que acceden a los datos). Cada controlador gestiona un conjunto de operaciones relacionadas con una entidad o caso de uso. Todos siguen el mismo patrón: reciben `req` (la petición) y `res` (la respuesta), ejecutan la operación y devuelven JSON.

---

### 6.1 `controllers/auth/AuthController.js`

**Qué hace:**
Gestiona el login y el registro de usuarios.

- `login` — busca el usuario por email, compara la contraseña con el hash almacenado usando `bcrypt.compare()`, y si coincide genera un token JWT con el ID, email y rol del usuario.
- `register` — genera el hash de la contraseña con `bcrypt.hash()` y guarda el nuevo usuario.

**Tecnologías:**
- `bcryptjs` — implementación de bcrypt en JavaScript puro (sin dependencias nativas). Bcrypt es un algoritmo de hashing diseñado específicamente para contraseñas: incorpora un *salt* aleatorio para que dos contraseñas iguales produzcan hashes distintos, y tiene un factor de coste configurable (aquí 10) que hace cada cálculo deliberadamente lento, dificultando los ataques de fuerza bruta.
- `jsonwebtoken` — genera el token JWT firmado con la clave secreta del `.env`.

---

### 6.2 `controllers/terapia/PacienteController.js`

**Qué hace:**
Gestiona el CRUD completo de pacientes para el logopeda, más un endpoint especial para la familia.

- `crearPaciente`, `editarPaciente`, `eliminarPaciente`, `consultarPaciente` — operaciones estándar de creación, edición, eliminación y consulta.
- `listarPacientes` — devuelve todos los pacientes del logopeda autenticado (usa el ID del token para filtrar).
- `listarPacientesActivos` — igual pero filtrando solo los activos. Lo usan múltiples vistas que necesitan un selector de paciente.
- `buscarPorCodigo` — endpoint público (sin token) que busca un paciente por su `codigoAcceso`. Devuelve solo nombre, nivel y `_id`. Lo usa la familia para identificar a su paciente introduciendo el código corto que le facilitó el logopeda, sin necesidad de conocer el ObjectId interno de MongoDB.

---

### 6.3 `controllers/terapia/SesionController.js`

**Qué hace:**
Gestiona las sesiones clínicas registradas por el logopeda (CdU-05). Permite crear, editar, eliminar y consultar sesiones presenciales. Las sesiones creadas desde este controlador se guardan directamente con estado `FINALIZADA` porque el logopeda las registra a posteriori, después de realizarlas.

**SRP aplicado:** este controlador solo gestiona sesiones del logopeda. Las sesiones de práctica de la familia tienen su propio controlador (`PracticaController`) con una razón de cambio distinta.

---

### 6.4 `controllers/terapia/PracticaController.js`

**Qué hace:**
Gestiona el flujo de práctica en tiempo real de la familia (CdU-03). Tiene tres operaciones que corresponden a los tres pasos del caso de uso:

- `iniciarSesion` — crea una nueva sesión en estado `EN_CURSO` y marca la asignación correspondiente como `EN_PROGRESO`.
- `registrarRespuesta` — incrementa el contador de aciertos o errores de la sesión. Valida que la sesión esté en estado `EN_CURSO` antes de permitirlo.
- `finalizarSesion` — cambia el estado de la sesión a `FINALIZADA`, calcula el porcentaje de aciertos y marca la asignación como `COMPLETADA`.

---

### 6.5 `controllers/terapia/ProgresoController.js`

**Qué hace:**
Calcula y devuelve las métricas de evolución terapéutica de un paciente (CdU-06). La función `calcularMetricas(sesiones, asignaciones)` es una función pura: recibe los datos y devuelve las métricas sin efectos secundarios, lo que la hace reutilizable y fácilmente testeable. Las métricas incluyen total de sesiones, promedio de aciertos, evolución sesión a sesión, y estado de las asignaciones.

---

### 6.6 `controllers/actividad/ActividadController.js`

**Qué hace:**
Gestiona el ciclo de vida completo de las actividades. La operación más relevante es `publicarActividad`, que antes de cambiar el estado llama a `getEstrategia(actividad.tipo).validar(actividad)` para comprobar que el contenido está completo. Si la validación falla, devuelve un error 400 con un mensaje descriptivo. Gracias al patrón Estrategia, este controlador no contiene ningún `if` que distinga entre tipos de actividad.

---

### 6.7 `controllers/actividad/AsignacionController.js`

**Qué hace:**
Gestiona las asignaciones de actividades a pacientes (CdU-01). Expone tres operaciones: crear una asignación, listar todas las asignaciones de un paciente (para el logopeda) y listar solo las asignaciones activas (PENDIENTE o EN_PROGRESO) de un paciente (para la familia, en la vista de actividades recomendadas).

---

### 6.8 `controllers/actividad/CategoriaController.js`

**Qué hace:**
Gestiona el CRUD de categorías. Simple: listar, crear y editar. Las categorías se usan en la creación y edición de actividades para organizarlas temáticamente.

---

### 6.9 `controllers/actividad/RecomendacionController.js`

**Qué hace:**
Es un alias de compatibilidad que reexporta `RegistroClinicoController`. En el análisis V3 existía un controlador separado para recomendaciones, pero en la implementación RUP una recomendación es simplemente un `RegistroClinico` de tipo `RECOMENDACION`, así que la lógica se consolidó en un único controlador. Este fichero mantiene la referencia sin duplicar código.

---

### 6.10 `controllers/comunicacion/RegistroClinicoController.js`

**Qué hace:**
Gestiona todos los registros clínicos del logopeda. La operación más destacada es `crearRegistro`, que además de guardar el registro intenta notificar a la familia si se ha indicado un email, delegando en `INotificador` (nunca sabe si la notificación va por email o consola). También expone `getRecomendaciones`, que filtra los registros de tipo `RECOMENDACION` para que la familia los consulte.

**DIP aplicado:** depende de `INotificador` (abstracción), no de `NotificadorEmail` ni `NotificadorConsola` (implementaciones concretas). La implementación concreta se inyecta desde `config/dependencias.js`.

---

## 7. Rutas

Las rutas conectan las URLs del sistema con los controladores. Están organizadas en dos grupos completamente independientes: `routes/logopeda/` y `routes/familia/`. Cada fichero de rutas aplica el middleware de autenticación correspondiente a todas sus rutas antes de que lleguen al controlador.

**Tecnología:** `express.Router()` — permite modularizar las rutas en ficheros independientes y montarlos en `server.js` bajo un prefijo (`/api/logopeda/...`, `/api/familia/...`).

**ISP aplicado:** un usuario de tipo `FAMILIA` que intente acceder a una ruta de logopeda recibirá un error 403 antes de que la petición llegue al controlador, porque el middleware `soloLogopeda` lo rechaza. Las dos interfaces de la API son completamente estancas.

**Decisión técnica relevante — orden de rutas:** en Express, las rutas se evalúan en el orden en que están registradas. Si una ruta paramétrica como `GET /:id` se registra antes que una ruta estática como `GET /activos`, Express interpreta `activos` como un valor de `id` y nunca llega a la ruta estática. Por eso en todos los ficheros de rutas las rutas estáticas (`/activos`, `/disponibles`, `/recomendadas/:id`) están registradas antes que las paramétricas (`/:id`).

---

## 8. Resumen de tecnologías y su justificación en una tabla

| Tecnología | Dónde se usa | Por qué se eligió |
|------------|-------------|-------------------|
| **Node.js** | Servidor completo | Permite usar JavaScript en backend, mismo lenguaje que el frontend, asíncrono por naturaleza |
| **Express** | Rutas y middlewares | Estándar de facto para APIs REST en Node.js, mínimo overhead, ecosistema maduro |
| **MongoDB Atlas** | Base de datos | Esquema flexible para los distintos tipos de actividad, sin migraciones al añadir tipos nuevos |
| **Mongoose** | Modelos | Añade validación y estructura sobre MongoDB, compensa la ausencia de esquema fijo |
| **JWT** | Autenticación | Stateless: el servidor no guarda sesiones, escala sin estado compartido |
| **bcryptjs** | Hashing de contraseñas | Diseñado para contraseñas: salt automático, factor de coste configurable, lento por diseño |
| **dotenv** | Configuración | Separa credenciales del código, práctica de seguridad básica |
| **HTML5 + CSS + JS** | Frontend | Sin framework, sin compilación, accesible desde cualquier navegador sin instalación |
| **fetch API** | Comunicación frontend-backend | Nativa del navegador, asíncrona, sin dependencias externas |

---
