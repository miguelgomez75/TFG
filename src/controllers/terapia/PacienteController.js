const Paciente = require('../../models/terapia/Paciente');

// RUP: múltiples diagramas llaman a listarPacientesActivos().
// Implementado como findActivos() en el repositorio (aquí = Mongoose).

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

// CdU eliminarPaciente — RUP: deleteById
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

// RUP: findAll — lista todos los pacientes del logopeda autenticado
const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find({ usuarioId: req.usuario.id });
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP: findActivos — usado en crearRegistro, registrarSesion, asignarActividad…
// Equivale a PacienteRepository.findActivos() de los diagramas.
const listarPacientesActivos = async (req, res) => {
  try {
    const pacientes = await Paciente.find({ usuarioId: req.usuario.id, activo: true });
    res.json(pacientes);
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
  listarPacientesActivos
};
