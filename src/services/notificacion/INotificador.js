class INotificador {
  async notificar(destinatario, asunto, mensaje) {
    throw new Error('notificar() debe implementarse');
  }
}
module.exports = INotificador;
