const INotificador = require('./INotificador');
// Implementación de desarrollo/test - misma interfaz sin efectos reales
class NotificadorConsola extends INotificador {
  async notificar(destinatario, asunto, mensaje) {
    console.log(`[NOTIFICACIÓN] → ${destinatario} | ${asunto}: ${mensaje}`);
  }
}
module.exports = NotificadorConsola;
