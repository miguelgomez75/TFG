const Registro = require('../../models/comunicacion/Registro');

const recomendarActividad = async (req, res) => {
  const { pacienteId, actividadId, instrucciones } = req.body;
  const registro = new Registro({
    pacienteId,
    actividadId,
    usuarioId: req.usuario.id,
    titulo:    'Recomendación de actividad',
    contenido: instrucciones,
    tipo:      'RECOMENDACION'
  });
  await registro.save();
  res.status(201).json(registro);
};

module.exports = { recomendarActividad };
