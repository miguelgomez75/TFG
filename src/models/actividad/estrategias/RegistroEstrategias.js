// OCP: añadir nuevo tipo = crear estrategia + registrarla aquí.
// ActividadController no cambia.
const EstrategiaPictograma = require('./EstrategiaPictograma');
const EstrategiaAudio      = require('./EstrategiaAudio');
const EstrategiaTexto      = require('./EstrategiaTexto');

const estrategias = {
  PICTOGRAMA: EstrategiaPictograma,
  AUDIO:      EstrategiaAudio,
  TEXTO:      EstrategiaTexto
};

const getEstrategia = (tipo) => {
  const e = estrategias[tipo];
  if (!e) throw new Error(`Tipo de actividad no soportado: ${tipo}`);
  return e;
};

module.exports = { getEstrategia };
