const Sesion = require('../../models/terapia/Sesion');

// RUP SRP: solo el actor Logopeda usa este controlador.
// Corresponde a CdU-05 registrarSesion y al diagrama eliminarSesion.

// CdU-05: guardarSesion(pacienteId, fecha, tipo, observaciones, aciertos, errores)
// Firma exacta del diagrama registrarSesion().
const guardarSesion = async (req, res) => {
  try {
    const { pacienteId, fecha, tipo, notas, aciertos, errores } = req.body;
    const sesion = new Sesion({
      pacienteId,
      fecha:    fecha || Date.now(),
      tipo,
      notas,
      aciertos: aciertos || 0,
      errores:  errores  || 0,
      estado:   'FINALIZADA'
    });
    await sesion.save();
    res.status(201).json(sesion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Alias explícito del diagrama: crearSesion (logopeda crea sesión presencial)
const crearSesion = guardarSesion;

// RUP CdU editarSesion: cargarSesion + actualizarSesion
const getSesion = async (req, res) => {
  try {
    const sesion = await Sesion.findById(req.params.id).populate('actividadId');
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json(sesion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarSesion = async (req, res) => {
  try {
    const sesion = await Sesion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json(sesion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP diagrama eliminarSesion: deleteById
const eliminarSesion = async (req, res) => {
  try {
    await Sesion.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Sesión eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP CdU-06: getSesiones(pacienteId) → findByPaciente
const getSesiones = async (req, res) => {
  try {
    const sesiones = await Sesion
      .find({ pacienteId: req.params.pacienteId })
      .populate('actividadId')
      .sort({ fecha: -1 });
    res.json(sesiones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { crearSesion, guardarSesion, getSesion, actualizarSesion, eliminarSesion, getSesiones };
