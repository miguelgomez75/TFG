const AsignacionActividad = require('../../models/actividad/AsignacionActividad');

const asignarActividad = async (req, res) => {
  const { pacienteId, actividadId } = req.body;
  const asignacion = new AsignacionActividad({ pacienteId, actividadId, estado: 'PENDIENTE' });
  await asignacion.save();
  res.status(201).json(asignacion);
};

const getAsignaciones = async (req, res) => {
  const asignaciones = await AsignacionActividad
    .find({ pacienteId: req.params.pacienteId })
    .populate('actividadId');
  res.json(asignaciones);
};

module.exports = { asignarActividad, getAsignaciones };
