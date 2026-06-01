const EstrategiaContenido = require('./EstrategiaContenido');

class EstrategiaPictograma extends EstrategiaContenido {
  _renderizar(actividad) {
    return { tipo: 'PICTOGRAMA', imagen: actividad.contenido.urlImagen, etiqueta: actividad.contenido.etiqueta };
  }
  _validar(actividad) {
    return !!(actividad.contenido.urlImagen && actividad.contenido.etiqueta);
  }
}

module.exports = new EstrategiaPictograma();
