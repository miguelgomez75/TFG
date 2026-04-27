const INotificador = require('./INotificador');
// Implementación de producción - swappable sin tocar RegistroController
class NotificadorEmail extends INotificador {
  async notificar(destinatario, asunto, mensaje) {
    // En producción aquí iría nodemailer
    console.log(`[EMAIL REAL] → ${destinatario} | ${asunto}: ${mensaje}`);
  }
}
module.exports = NotificadorEmail;
