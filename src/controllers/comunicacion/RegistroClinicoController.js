const RegistroClinico    = require('../../models/comunicacion/RegistroClinico');
const { notificador }    = require('../../config/dependencias');

// RUP: renombrado de RegistroController → RegistroClinicoController.
// DIP: depende de INotificador, no de la implementación concreta.

// crearRegistro — RUP guardarRegistro(pacienteId, tipo, titulo, contenido, actividadId)
const crearRegistro = async (req, res) => {
  try {
    const registro = new RegistroClinico({ ...req.body, usuarioId: req.usuario.id });
    await registro.save();
    if (req.body.emailFamilia) {
      await notificador.notificar(
        req.body.emailFamilia,
        'Nuevo registro del logopeda',
        registro.contenido
      );
    }
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP editarRegistro: cargarRegistro + actualizarRegistro
const getRegistro = async (req, res) => {
  try {
    const registro = await RegistroClinico.findById(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editarRegistro = async (req, res) => {
  try {
    const registro = await RegistroClinico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP eliminarRegistro: deleteById
const eliminarRegistro = async (req, res) => {
  try {
    await RegistroClinico.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP getRegistros(pacienteId) → findByPaciente — usado por Logopeda y Familia
const getRegistros = async (req, res) => {
  try {
    const registros = await RegistroClinico
      .find({ pacienteId: req.params.pacienteId })
      .sort({ fecha: -1 });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP verActividadesRecomendadas (Familia):
// getRecomendaciones(pacienteId) → findRecomendacionesByPaciente
// Filtra registros de tipo RECOMENDACION.
const getRecomendaciones = async (req, res) => {
  try {
    const registros = await RegistroClinico
      .find({ pacienteId: req.params.pacienteId, tipo: 'RECOMENDACION' })
      .populate('actividadId')
      .sort({ fecha: -1 });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP CdU-04: crearRecomendacion(pacienteId, actividadId, instrucciones)
const crearRecomendacion = async (req, res) => {
  try {
    const { pacienteId, actividadId, instrucciones } = req.body;
    const registro = new RegistroClinico({
      pacienteId,
      actividadId,
      usuarioId: req.usuario.id,
      titulo:    'Recomendación de actividad',
      contenido: instrucciones,
      tipo:      'RECOMENDACION'
    });
    await registro.save();
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  crearRegistro,
  getRegistro,
  editarRegistro,
  eliminarRegistro,
  getRegistros,
  getRecomendaciones,
  crearRecomendacion
};
