const Paciente = require('../../models/terapia/Paciente');

const crearPaciente = async (req, res) => {
  const paciente = new Paciente(req.body);
  await paciente.save();
  res.status(201).json(paciente);
};

const editarPaciente = async (req, res) => {
  const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(paciente);
};

const consultarPaciente = async (req, res) => {
  const paciente = await Paciente.findById(req.params.id);
  res.json(paciente);
};

const listarPacientes = async (req, res) => {
  const pacientes = await Paciente.find({ usuarioId: req.usuario.id });
  res.json(pacientes);
};

module.exports = { crearPaciente, editarPaciente, consultarPaciente, listarPacientes };
