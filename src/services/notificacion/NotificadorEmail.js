const INotificador = require('./INotificador');

class NotificadorEmail extends INotificador {
  async notificar(destinatario, asunto, mensaje) {
    // En producción: nodemailer u otro proveedor
    console.log(`[EMAIL] → ${destinatario} | ${asunto}: ${mensaje}`);
  }
}
module.exports = NotificadorEmail;
