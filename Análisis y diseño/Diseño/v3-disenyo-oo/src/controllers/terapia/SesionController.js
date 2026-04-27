const Sesion = require('../../models/terapia/Sesion');

// V2 CORRECCIÓN (SRP): controlador exclusivo para el actor Logopeda
// registrar y consultar sesiones clínicas - razón de cambio única

const crearSesion = async (req, res) => {
  const { pacienteId, fecha, tipo, notas, aciertos, errores } = req.body;
  const sesion = new Sesion({ pacienteId, fecha, tipo, notas, aciertos, errores, estado: 'FINALIZADA' });
  await sesion.save();
  res.status(201).json(sesion);
};

const getSesiones = async (req, res) => {
  const sesiones = await Sesion
    .find({ pacienteId: req.params.pacienteId })
    .populate('actividadId')
    .sort({ fecha: -1 });
  res.json(sesiones);
};

module.exports = { crearSesion, getSesiones };
