const Sesion              = require('../../models/terapia/Sesion');
const Paciente            = require('../../models/terapia/Paciente');
const AsignacionActividad = require('../../models/actividad/AsignacionActividad');

// RUP CdU-06: VerProgresoView llama a tres operaciones distintas:
//   1. SesionController.getSesiones()
//   2. AsignacionController.getAsignaciones()
//   3. ProgresoController.calcularMetricas(sesiones, asignaciones)
//
// Esta implementación consolida los tres pasos en un solo endpoint
// GET /progreso/:pacienteId para simplificar el cliente, pero expone
// también calcularMetricas() como función pura reutilizable.

// Función pura: calcularMetricas(sesiones, asignaciones) → Metricas
// Puede ser llamada directamente desde otros controladores si se necesita.
const calcularMetricas = (sesiones, asignaciones) => {
  const finalizadas     = sesiones.filter(s => s.estado === 'FINALIZADA');
  const totalAciertos   = finalizadas.reduce((acc, s) => acc + s.aciertos, 0);
  const totalRespuestas = finalizadas.reduce((acc, s) => acc + s.aciertos + s.errores, 0);

  return {
    totalSesiones:         finalizadas.length,
    promedioAciertos:      totalRespuestas === 0
      ? 0
      : Math.round((totalAciertos / totalRespuestas) * 100),
    evolucion:             finalizadas
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .map(s => ({ fecha: s.fecha, porcentaje: s.getPorcentajeAciertos() })),
    totalAsignaciones:     asignaciones.length,
    asignacionesCompletas: asignaciones.filter(a => a.estado === 'COMPLETADA').length,
    asignacionesPendientes:asignaciones.filter(a => a.estado === 'PENDIENTE').length
  };
};

// RUP CdU-06: endpoint completo para VerProgresoView
const getProgreso = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.pacienteId);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    const sesiones     = await Sesion.find({ pacienteId: req.params.pacienteId });
    const asignaciones = await AsignacionActividad.find({ pacienteId: req.params.pacienteId });

    const metricas = calcularMetricas(sesiones, asignaciones);

    res.json({ paciente, metricas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProgreso, calcularMetricas };
