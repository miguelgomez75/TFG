// Alias de compatibilidad: en V3 existía RecomendacionController.js en actividad/.
// En RUP la recomendación es un RegistroClinico de tipo RECOMENDACION,
// por lo que la lógica vive en RegistroClinicoController.
// Este fichero reexporta crearRecomendacion para mantener la referencia
// que aparece en server.js.
module.exports = require('../comunicacion/RegistroClinicoController');
