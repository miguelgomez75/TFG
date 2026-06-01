// OCP + LSP: contrato formal que todas las estrategias deben cumplir
class EstrategiaContenido {
  renderizar(actividad) {
    if (!actividad)           throw new Error('Precondición: actividad requerida');
    if (!actividad.contenido) throw new Error('Precondición: contenido requerido');
    const resultado = this._renderizar(actividad);
    if (!resultado || !resultado.tipo) throw new Error('Postcondición: resultado debe tener tipo');
    return resultado;
  }

  validar(actividad) {
    if (!actividad) throw new Error('Precondición: actividad requerida');
    const resultado = this._validar(actividad);
    if (typeof resultado !== 'boolean') throw new Error('Postcondición: validar debe devolver boolean');
    return resultado;
  }

  _renderizar(actividad) { throw new Error('_renderizar() debe implementarse'); }
  _validar(actividad)    { throw new Error('_validar() debe implementarse'); }
}

module.exports = EstrategiaContenido;
