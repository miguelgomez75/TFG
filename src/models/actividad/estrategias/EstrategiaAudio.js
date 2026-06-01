const EstrategiaContenido = require('./EstrategiaContenido');

class EstrategiaAudio extends EstrategiaContenido {
  _renderizar(actividad) {
    return { tipo: 'AUDIO', audio: actividad.contenido.urlAudio, transcripcion: actividad.contenido.texto };
  }
  _validar(actividad) {
    return !!actividad.contenido.urlAudio;
  }
}

module.exports = new EstrategiaAudio();
