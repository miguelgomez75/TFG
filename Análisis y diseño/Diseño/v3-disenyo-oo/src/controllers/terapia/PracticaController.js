const Sesion              = require('../../models/terapia/Sesion');
const AsignacionActividad = require('../../models/actividad/AsignacionActividad');

// V2 CORRECCIÓN (SRP): controlador exclusivo para el actor Familia
// practicar actividades en casa - razón de cambio única

const iniciarSesion = async (req, res) => {
  const { pacienteId, actividadId } = req.body;
  const sesion = new Sesion({ pacienteId, actividadId, tipo: 'CASA', estado: 'EN_CURSO' });
  await sesion.save();
  const asignacion = await AsignacionActividad.findOne({ pacienteId, actividadId });
  if (asignacion) { asignacion.iniciar(); await asignacion.save(); }
  res.status(201).json(sesion);
};

const registrarRespuesta = async (req, res) => {
  const sesion = await Sesion.findById(req.params.id);
  if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
  // V2: el modelo sabe registrar respuestas (corrige Misplaced Responsibility)
  sesion.registrarRespuesta(req.body.esAcierto);
  await sesion.save();
  res.json(sesion);
};

const finalizarSesion = async (req, res) => {
  const sesion = await Sesion.findById(req.params.id);
  if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
  // V2: el modelo sabe finalizarse y calcular su porcentaje
  sesion.finalizar();
  await sesion.save();
  res.json({ sesion, porcentajeAciertos: sesion.getPorcentajeAciertos() });
};

module.exports = { iniciarSesion, registrarRespuesta, finalizarSesion };
