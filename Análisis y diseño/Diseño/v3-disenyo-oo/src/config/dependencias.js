// V3 DIP: punto de ensamblado
// Cambiar de email a push = cambiar una línea aquí. Nada más.
const NotificadorEmail   = require('../services/notificacion/NotificadorEmail');
const NotificadorConsola = require('../services/notificacion/NotificadorConsola');

const notificador = process.env.NODE_ENV === 'production'
  ? new NotificadorEmail()
  : new NotificadorConsola();

module.exports = { notificador };
