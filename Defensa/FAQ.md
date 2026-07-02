# Preguntas posibles en defensa

---

**¿Por qué no usaste React o Vue?**
El sistema no requiere gestión de estado compleja entre componentes ni renderizado condicional sofisticado. Las vistas son independientes entre sí y cada una tiene su propia lógica de comunicación con la API. Un framework SPA habría añadido complejidad de configuración (compilación, bundling, router) sin aportar ventajas reales para este caso de uso.

---

**¿Por qué MongoDB y no PostgreSQL?**
El campo `contenido` de `Actividad` tiene estructura distinta según el tipo (imágenes, palabras, audio). En SQL esto obligaría a tablas separadas por tipo o columnas nulas. MongoDB resuelve esto de forma natural con el campo `Object`, y está alineado con el principio OCP: añadir un tipo nuevo no toca el esquema.

---

**¿Qué pasa si el token JWT es robado?**
JWT no tiene mecanismo de revocación nativo. En este sistema los tokens tienen una vigencia de 8 horas, lo que limita la ventana de exposición. Para un sistema en producción real se implementaría una lista negra de tokens revocados o refresh tokens de corta duración, lo que se reconoce como una mejora futura.

---

**¿Por qué bcrypt y no SHA-256?**
SHA-256 es rápido por diseño, lo que es una desventaja para contraseñas porque permite millones de intentos por segundo en un ataque de fuerza bruta. Bcrypt es lento por diseño (factor de coste 10 ≈ 100ms por hash), lo que hace los ataques computacionalmente inviables a escala.

---

**¿Cómo añadirías un nuevo tipo de actividad?**
Crear un fichero `Estrategiax.js` que extienda `EstrategiaContenido` e implemente `_renderizar()` y `_validar()`. Registrarlo en `RegistroEstrategias.js`. Ningún otro fichero del sistema necesita modificarse. Eso es el principio OCP en acción.

---

**¿Usas WebSockets o algún mecanismo de actualización en tiempo real?**
No. Todo el sistema es petición-respuesta pura: la vista pide datos al servidor cuando se carga o cuando el usuario ejecuta una acción, el servidor responde con JSON, y hasta la próxima petición no hay comunicación. No hay nada que "empuje" datos del servidor al cliente de forma proactiva.

Esto es suficiente para el flujo actual porque logopeda y familia no trabajan simultáneamente en la misma sesión: el logopeda asigna actividades y la familia las ve la próxima vez que carga su vista. No hay un escenario donde ambos necesiten ver cambios del otro en tiempo real.

Esto cambia con la línea de trabajo futura de **sesiones telemáticas**: si el logopeda guía al paciente en tiempo real a través de la plataforma, sería necesario WebSockets (o Socket.io, que los abstrae) para que ambos vean el mismo estado de la actividad de forma sincrónica. Node.js maneja WebSockets de forma nativa y eficiente, así que es una extensión perfectamente viable sobre la arquitectura actual sin rediseñar el backend.

---

**¿Cómo se protegen los datos clínicos de los pacientes?**
En tres niveles. Primero, la comunicación siempre se realiza sobre HTTPS, por lo que los datos viajan cifrados entre el navegador y el servidor. Segundo, la autenticación JWT garantiza que solo usuarios autenticados pueden acceder a los endpoints protegidos. Tercero, el middleware de rol (`soloLogopeda`, `soloFamilia`) asegura que cada actor solo puede acceder a los datos que le corresponden: una familia no puede ver los registros clínicos de otro paciente porque el endpoint exige token válido y el `pacienteId` que devuelve la búsqueda por código solo expone nombre y nivel, nunca datos clínicos completos. El `_id` interno de MongoDB tampoco se expone directamente a la familia: el `codigoAcceso` es la única referencia que se comunica verbalmente.

Como limitación conocida: MongoDB Atlas no está configurado con cifrado en reposo en la versión gratuita del cluster M0. En un entorno de producción real con datos clínicos regulados por normativa sanitaria (LOPD / RGPD), sería necesario un cluster de pago con cifrado en reposo habilitado y una evaluación de impacto de protección de datos.

---

**¿Tiene el sistema tests automatizados?**
No se implementaron tests en esta versión. La validación del sistema se realizó de forma manual mediante pruebas funcionales con un usuario real (el logopeda participante en la validación). Esta es una limitación reconocida: en un entorno de producción real se implementarían al menos tests unitarios para los controladores y las estrategias de contenido (especialmente `calcularMetricas` y los métodos `validar` de cada estrategia, que son funciones puras fácilmente testeables), y tests de integración para los endpoints principales. Esta línea de trabajo está identificada en las conclusiones como mejora futura.

---

**¿Por qué la API es REST y no GraphQL?**
REST es más adecuado para este caso de uso por tres razones: los endpoints son claros y corresponden uno a uno con los casos de uso identificados en el análisis (un endpoint por operación), el equipo de desarrollo es unipersonal y REST tiene menor curva de aprendizaje, y las vistas consumen datos completos de cada entidad sin necesitar selección granular de campos (que es la principal ventaja de GraphQL). GraphQL aporta valor cuando hay muchos clientes distintos con necesidades de datos diferentes, lo que no es el caso aquí.

---

**¿Cómo escalaría el sistema si hubiera muchos usuarios simultáneos?**
Node.js es asíncrono y no bloqueante por naturaleza, lo que le permite manejar múltiples peticiones concurrentes con un único hilo de ejecución sin que una petición lenta bloquee a las demás. Para escalar horizontalmente (más instancias del servidor), el diseño stateless basado en JWT es clave: como el servidor no guarda estado de sesión, cualquier instancia puede atender cualquier petición sin coordinación. MongoDB Atlas soporta escalado automático y réplicas. El único cuello de botella potencial en la arquitectura actual es la ausencia de caché: consultas frecuentes como el listado de actividades disponibles podrían beneficiarse de una capa de caché con Redis, lo que se reconoce como mejora futura.

---

**¿Qué es el patrón MVC y cómo se aplica aquí?**
MVC (Modelo-Vista-Controlador) es un patrón arquitectónico que separa las responsabilidades en tres capas: el Modelo gestiona los datos y la lógica de negocio, la Vista presenta la información al usuario, y el Controlador actúa de intermediario, recibiendo las peticiones de la vista, operando sobre el modelo y devolviendo la respuesta. En este sistema: los Modelos son los ficheros Mongoose (Paciente, Actividad, Sesion…), las Vistas son los ficheros HTML de `views/`, y los Controladores son los ficheros de `src/controllers/`. La variante aplicada es MVC con API REST: la vista no se renderiza en el servidor (no hay templates como Handlebars o EJS), sino que el servidor devuelve JSON y la vista HTML actualiza el DOM con JavaScript.

---

**¿Qué diferencia hay entre autenticación y autorización, y cómo se implementan?**
Son dos conceptos distintos que suelen confundirse. La **autenticación** responde a "¿quién eres?" — en este sistema la gestiona `AuthController` mediante email, contraseña y bcrypt, y produce un token JWT si las credenciales son correctas. La **autorización** responde a "¿qué puedes hacer?" — la gestiona el middleware de `auth.js` mediante `soloLogopeda` y `soloFamilia`, que comprueban el rol incluido en el token. Ambas capas son independientes: primero se verifica que el token es válido (autenticación), y solo entonces se comprueba si el rol del usuario le permite acceder a ese endpoint (autorización).

---

**¿Por qué se usa `async/await` y no callbacks o promesas directas?**
Los tres son mecanismos para gestionar operaciones asíncronas en JavaScript (como consultas a MongoDB, que no son instantáneas). Los callbacks anidados producen el llamado "callback hell", código difícil de leer y mantener. Las promesas mejoran la legibilidad pero encadenar muchas puede volverse confuso. `async/await` es azúcar sintáctico sobre promesas que hace que el código asíncrono se lea como si fuera síncrono, facilitando enormemente la comprensión y el manejo de errores con `try/catch`. Es el estándar moderno en Node.js para código asíncrono.
