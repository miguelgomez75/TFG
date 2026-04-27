const Registro           = require('../../models/comunicacion/Registro');
const { notificador }    = require('../../config/dependencias');

// V3 DIP: depende de INotificador (abstracción), no de NotificadorEmail (concreción)
// Si cambia el canal de notificación, este fichero NO cambia

const crearRegistro = async (req, res) => {
  const registro = new Registro({ ...req.body, usuarioId: req.usuario.id });
  await registro.save();
  await notificador.notificar(
    req.body.emailFamilia,
    'Nuevo registro del logopeda',
    registro.contenido
  );
  res.status(201).json(registro);
};

const editarRegistro = async (req, res) => {
  const registro = await Registro.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
  res.json(registro);
};

const eliminarRegistro = async (req, res) => {
  await Registro.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Registro eliminado' });
};

const getRegistros = async (req, res) => {
  res.json(await Registro.find({ pacienteId: req.params.pacienteId }).sort({ fecha: -1 }));
};

module.exports = { crearRegistro, editarRegistro, eliminarRegistro, getRegistros };
