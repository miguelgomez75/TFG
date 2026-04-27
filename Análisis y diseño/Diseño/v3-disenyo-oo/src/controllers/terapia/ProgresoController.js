const Sesion   = require('../../models/terapia/Sesion');
const Paciente = require('../../models/terapia/Paciente');

// V2 CORRECCIÓN (Feature Envy + Misplaced Responsibility):
// El porcentaje de cada sesión se delega al propio modelo (getPorcentajeAciertos)
// ProgresoController solo agrega - no duplica lógica de Sesion

const getProgreso = async (req, res) => {
  const paciente = await Paciente.findById(req.params.pacienteId);
  if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
  const sesiones = await Sesion
    .find({ pacienteId: req.params.pacienteId, estado: 'FINALIZADA' })
    .sort({ fecha: 1 });

  const totalAciertos   = sesiones.reduce((s, ses) => s + ses.aciertos, 0);
  const totalRespuestas = sesiones.reduce((s, ses) => s + ses.aciertos + ses.errores, 0);

  const metricas = {
    totalSesiones:    sesiones.length,
    promedioAciertos: totalRespuestas === 0 ? 0 : Math.round((totalAciertos / totalRespuestas) * 100),
    // V2: delegamos el cálculo por sesión al propio modelo
    evolucion: sesiones.map(s => ({ fecha: s.fecha, porcentaje: s.getPorcentajeAciertos() }))
  };
  res.json({ paciente, metricas });
};

module.exports = { getProgreso };
