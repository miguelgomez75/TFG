const Sesion              = require('../../models/terapia/Sesion');
const AsignacionActividad = require('../../models/actividad/AsignacionActividad');

// RUP CdU-03: realizarActividad — solo actor Familia.
// SRP: razón de cambio única → practicar actividades en casa.

// crearSesion(asignacionId) — primer paso del CdU-03
const iniciarSesion = async (req, res) => {
  try {
    const { pacienteId, actividadId } = req.body;
    if (!pacienteId || !actividadId)
      return res.status(400).json({ error: 'pacienteId y actividadId son obligatorios' });

    const sesion = new Sesion({ pacienteId, actividadId, tipo: 'CASA', estado: 'EN_CURSO' });
    await sesion.save();

    // marcarEnProgreso(asignacionId)
    const asignacion = await AsignacionActividad.findOne({ pacienteId, actividadId });
    if (asignacion && asignacion.estado === 'PENDIENTE') {
      asignacion.iniciar();
      await asignacion.save();
    }

    res.status(201).json(sesion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// registrarRespuesta(sesionId, ejercicioId, respuesta) — CdU-03
const registrarRespuesta = async (req, res) => {
  try {
    const sesion = await Sesion.findById(req.params.id);
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (sesion.estado !== 'EN_CURSO')
      return res.status(400).json({ error: `No se pueden registrar respuestas: la sesión está en estado ${sesion.estado}` });

    sesion.registrarRespuesta(req.body.esAcierto);
    await sesion.save();
    res.json(sesion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// finalizarSesion(sesionId) — CdU-03, marcarCompletada en asignación
const finalizarSesion = async (req, res) => {
  try {
    const sesion = await Sesion.findById(req.params.id);
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (sesion.estado === 'FINALIZADA')
      return res.status(400).json({ error: 'La sesión ya está finalizada' });

    sesion.finalizar();
    await sesion.save();

    // marcarCompletada(asignacionId)
    if (sesion.actividadId) {
      const asignacion = await AsignacionActividad.findOne({
        pacienteId:  sesion.pacienteId,
        actividadId: sesion.actividadId
      });
      if (asignacion && asignacion.estado !== 'COMPLETADA') {
        asignacion.completar();
        await asignacion.save();
      }
    }

    res.json({ sesion, porcentajeAciertos: sesion.getPorcentajeAciertos() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { iniciarSesion, registrarRespuesta, finalizarSesion };
