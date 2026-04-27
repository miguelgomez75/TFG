const Registro = require('../../models/comunicacion/Registro');

// V1: acoplado directamente a implementación de notificación
// Si cambiamos de email a push, toca este controlador (viola DIP)
const crearRegistro = async (req, res) => {
  const registro = new Registro({ ...req.body, usuarioId: req.usuario.id });
  await registro.save();
  // Acoplamiento directo a nodemailer - viola DIP
  // (en V1 simplemente lo simulamos con console.log)
  console.log(`[EMAIL] Notificando a familia sobre nuevo registro: ${registro.titulo}`);
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
  const registros = await Registro
    .find({ pacienteId: req.params.pacienteId })
    .sort({ fecha: -1 });
  res.json(registros);
};

module.exports = { crearRegistro, editarRegistro, eliminarRegistro, getRegistros };
