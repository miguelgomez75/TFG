const INotificador = require('./INotificador');

class NotificadorConsola extends INotificador {
  async notificar(destinatario, asunto, mensaje) {
    console.log(`[NOTIFICACIÓN] → ${destinatario} | ${asunto}: ${mensaje}`);
  }
}
module.exports = NotificadorConsola;
