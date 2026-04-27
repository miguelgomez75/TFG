const Sesion              = require('../../models/terapia/Sesion');
const AsignacionActividad = require('../../models/actividad/AsignacionActividad');

// V1: Un solo controlador maneja DOS actores (Familia y Logopeda)
// Viola SRP - dos razones de cambio en la misma clase
// La lógica de negocio (calcular porcentaje, transiciones de estado)
// vive aquí en lugar de en el modelo - Misplaced Responsibility

const iniciarSesion = async (req, res) => {
  const { pacienteId, actividadId } = req.body;
  const sesion = new Sesion({ pacienteId, actividadId, tipo: 'CASA', estado: 'EN_CURSO' });
  await sesion.save();
  const asignacion = await AsignacionActividad.findOne({ pacienteId, actividadId });
  if (asignacion) {
    asignacion.estado = 'EN_PROGRESO'; // lógica de transición en el controlador
    await asignacion.save();
  }
  res.status(201).json(sesion);
};

const registrarRespuesta = async (req, res) => {
  const { esAcierto } = req.body;
  const sesion = await Sesion.findById(req.params.id);
  if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
  // Lógica de negocio en el controlador (Data Class smell)
  if (sesion.estado !== 'EN_CURSO') return res.status(400).json({ error: 'Sesión no activa' });
  if (esAcierto) sesion.aciertos++;
  else sesion.errores++;
  await sesion.save();
  res.json(sesion);
};

const finalizarSesion = async (req, res) => {
  const sesion = await Sesion.findById(req.params.id);
  if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
  sesion.estado = 'FINALIZADA';
  await sesion.save();
  // Porcentaje calculado aquí en lugar de en el modelo (Misplaced Responsibility)
  const total = sesion.aciertos + sesion.errores;
  const porcentaje = total === 0 ? 0 : Math.round((sesion.aciertos / total) * 100);
  res.json({ sesion, porcentajeAciertos: porcentaje });
};

// Actor diferente (Logopeda) en el mismo controlador - viola SRP
const crearSesionClinica = async (req, res) => {
  const { pacienteId, fecha, tipo, notas, aciertos, errores } = req.body;
  const sesion = new Sesion({ pacienteId, fecha, tipo, notas, aciertos, errores, estado: 'FINALIZADA' });
  await sesion.save();
  res.status(201).json(sesion);
};

const getSesiones = async (req, res) => {
  const sesiones = await Sesion.find({ pacienteId: req.params.pacienteId })
    .populate('actividadId').sort({ fecha: -1 });
  res.json(sesiones);
};

module.exports = { iniciarSesion, registrarRespuesta, finalizarSesion, crearSesionClinica, getSesiones };
