const Sesion   = require('../../models/terapia/Sesion');
const Paciente = require('../../models/terapia/Paciente');

const getProgreso = async (req, res) => {
  const paciente = await Paciente.findById(req.params.pacienteId);
  if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
  const sesiones = await Sesion.find({ pacienteId: req.params.pacienteId, estado: 'FINALIZADA' })
    .sort({ fecha: 1 });
  // Lógica de cálculo en el controlador
  const totalAciertos   = sesiones.reduce((sum, s) => sum + s.aciertos, 0);
  const totalRespuestas = sesiones.reduce((sum, s) => sum + s.aciertos + s.errores, 0);
  const metricas = {
    totalSesiones:    sesiones.length,
    promedioAciertos: totalRespuestas === 0 ? 0 : Math.round((totalAciertos / totalRespuestas) * 100),
    evolucion:        sesiones.map(s => {
      const t = s.aciertos + s.errores;
      return { fecha: s.fecha, porcentaje: t === 0 ? 0 : Math.round((s.aciertos / t) * 100) };
    })
  };
  res.json({ paciente, metricas });
};

module.exports = { getProgreso };
