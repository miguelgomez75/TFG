const EstrategiaContenido = require('./EstrategiaContenido');

// Audio: cada apartado carga un mp3 que se reproduce al paciente,
// que debe repetir lo que oye. La transcripción sirve de referencia
// para que el logopeda/familia valore si la repetición es correcta.
// contenido = { apartados: [ { urlAudio: '...', transcripcion: '...' }, ... ] }
class EstrategiaAudio extends EstrategiaContenido {
  _renderizar(actividad) {
    return { tipo: 'AUDIO', apartados: actividad.contenido.apartados };
  }
  _validar(actividad) {
    const apartados = actividad.contenido.apartados;
    if (!Array.isArray(apartados) || apartados.length === 0) return false;
    return apartados.every(a =>
      typeof a.urlAudio === 'string' && a.urlAudio.trim() !== '' &&
      typeof a.transcripcion === 'string' && a.transcripcion.trim() !== ''
    );
  }
}

module.exports = new EstrategiaAudio();
