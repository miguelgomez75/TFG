// DIP: punto de ensamblado. Cambiar canal = cambiar una línea.
const NotificadorEmail   = require('../services/notificacion/NotificadorEmail');
const NotificadorConsola = require('../services/notificacion/NotificadorConsola');

const notificador = process.env.NODE_ENV === 'production'
  ? new NotificadorEmail()
  : new NotificadorConsola();

module.exports = { notificador };
