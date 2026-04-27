// V3 DIP: abstracción estable - contrato que todos los notificadores cumplen
class INotificador {
  async notificar(destinatario, asunto, mensaje) {
    throw new Error('notificar() debe implementarse');
  }
}
module.exports = INotificador;
