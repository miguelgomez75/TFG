const EstrategiaContenido = require('./EstrategiaContenido');

// Pictograma/Imagen: cada apartado muestra una o varias imágenes
// que el paciente debe describir/comentar.
// contenido = { apartados: [ { imagenes: [url, ...], descripcion: '...' }, ... ] }
class EstrategiaPictograma extends EstrategiaContenido {
  _renderizar(actividad) {
    return { tipo: 'PICTOGRAMA', apartados: actividad.contenido.apartados };
  }
  _validar(actividad) {
    const apartados = actividad.contenido.apartados;
    if (!Array.isArray(apartados) || apartados.length === 0) return false;
    return apartados.every(a =>
      Array.isArray(a.imagenes) && a.imagenes.length > 0 &&
      a.imagenes.every(u => typeof u === 'string' && u.trim() !== '') &&
      typeof a.descripcion === 'string' && a.descripcion.trim() !== ''
    );
  }
}

module.exports = new EstrategiaPictograma();
