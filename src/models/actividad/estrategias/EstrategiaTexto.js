const EstrategiaContenido = require('./EstrategiaContenido');

// Texto: cada apartado da un enunciado y una o varias palabras/textos
// sobre los que el paciente debe trabajar (deletrear, comprensión, etc).
// contenido = { apartados: [ { enunciado: '...', palabras: ['...', ...] }, ... ] }
class EstrategiaTexto extends EstrategiaContenido {
  _renderizar(actividad) {
    return { tipo: 'TEXTO', apartados: actividad.contenido.apartados };
  }
  _validar(actividad) {
    const apartados = actividad.contenido.apartados;
    if (!Array.isArray(apartados) || apartados.length === 0) return false;
    return apartados.every(a =>
      typeof a.enunciado === 'string' && a.enunciado.trim() !== '' &&
      Array.isArray(a.palabras) && a.palabras.length > 0 &&
      a.palabras.every(p => typeof p === 'string' && p.trim() !== '')
    );
  }
}

module.exports = new EstrategiaTexto();
