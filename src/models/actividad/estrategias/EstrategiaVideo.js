const EstrategiaContenido = require('./EstrategiaContenido');

// Vídeo: placeholder para cuando se necesite. Mismo patrón que Audio
// pero con mp4 — el paciente repite/reproduce lo que ve y oye.
// contenido = { apartados: [ { urlVideo: '...', descripcion: '...' }, ... ] }
class EstrategiaVideo extends EstrategiaContenido {
  _renderizar(actividad) {
    return { tipo: 'VIDEO', apartados: actividad.contenido.apartados };
  }
  _validar(actividad) {
    const apartados = actividad.contenido.apartados;
    if (!Array.isArray(apartados) || apartados.length === 0) return false;
    return apartados.every(a =>
      typeof a.urlVideo === 'string' && a.urlVideo.trim() !== '' &&
      typeof a.descripcion === 'string' && a.descripcion.trim() !== ''
    );
  }
}

module.exports = new EstrategiaVideo();
