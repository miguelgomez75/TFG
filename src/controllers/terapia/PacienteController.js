const Paciente = require('../../models/terapia/Paciente');

// CdU crearPaciente
const crearPaciente = async (req, res) => {
  try {
    const paciente = new Paciente({ ...req.body, usuarioId: req.usuario.id });
    await paciente.save();
    res.status(201).json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CdU editarPaciente
const editarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CdU eliminarPaciente
const eliminarPaciente = async (req, res) => {
  try {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Paciente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const consultarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Todos los pacientes del logopeda autenticado
const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find({ usuarioId: req.usuario.id });
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP: findActivos — usado en crearRegistro, registrarSesion, asignarActividad…
const listarPacientesActivos = async (req, res) => {
  try {
    const pacientes = await Paciente.find({ usuarioId: req.usuario.id, activo: true });
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Endpoint para la familia: busca paciente por codigoAcceso (PAC-XXXX).
// No requiere rol logopeda; solo devuelve nombre, código y nivel.
const buscarPorCodigo = async (req, res) => {
  try {
    const codigo   = req.params.codigo.toUpperCase();
    const paciente = await Paciente.findOne(
      { codigoAcceso: codigo, activo: true },
      'nombre codigoAcceso nivelActual _id'
    );
    if (!paciente) return res.status(404).json({ error: 'Código de paciente no encontrado' });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  crearPaciente,
  editarPaciente,
  eliminarPaciente,
  consultarPaciente,
  listarPacientes,
  listarPacientesActivos,
  buscarPorCodigo
};
