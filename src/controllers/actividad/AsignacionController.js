const AsignacionActividad = require('../../models/actividad/AsignacionActividad');

// RUP CdU-01: crearAsignacion(pacienteId, actividadId)
const asignarActividad = async (req, res) => {
  try {
    const { pacienteId, actividadId } = req.body;
    const asignacion = new AsignacionActividad({ pacienteId, actividadId, estado: 'PENDIENTE' });
    await asignacion.save();
    res.status(201).json(asignacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP CdU-06: getAsignaciones(pacienteId) → findByPaciente
const getAsignaciones = async (req, res) => {
  try {
    const asignaciones = await AsignacionActividad
      .find({ pacienteId: req.params.pacienteId })
      .populate('actividadId');
    res.json(asignaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP verActividadesRecomendadas (Familia):
// getAsignacionesActivas(pacienteId) → findByPacienteAndEstado(PENDIENTE|EN_PROGRESO)
const getAsignacionesActivas = async (req, res) => {
  try {
    const asignaciones = await AsignacionActividad
      .find({
        pacienteId: req.params.pacienteId,
        estado: { $in: ['PENDIENTE', 'EN_PROGRESO'] }
      })
      .populate('actividadId');
    res.json(asignaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { asignarActividad, getAsignaciones, getAsignacionesActivas };
