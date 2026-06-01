const EstrategiaContenido = require('./EstrategiaContenido');

class EstrategiaTexto extends EstrategiaContenido {
  _renderizar(actividad) {
    return { tipo: 'TEXTO', texto: actividad.contenido.texto };
  }
  _validar(actividad) {
    return !!actividad.contenido.texto;
  }
}

module.exports = new EstrategiaTexto();
