const Actividad         = require('../../models/actividad/Actividad');
const { getEstrategia } = require('../../models/actividad/estrategias/RegistroEstrategias');

// V3 OCP: getActividad ya no tiene condicional por tipo
// Añadir VIDEO = crear EstrategiaVideo + registrarla. Este fichero NO cambia.

const crearActividad = async (req, res) => {
  const actividad = new Actividad(req.body);
  await actividad.save();
  res.status(201).json(actividad);
};

const publicarActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  const estrategia = getEstrategia(actividad.tipo);
  if (!estrategia.validar(actividad)) {
    return res.status(400).json({ error: 'Contenido incompleto para publicar' });
  }
  actividad.publicar();
  await actividad.save();
  res.json(actividad);
};

const archivarActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  actividad.archivar();
  await actividad.save();
  res.json(actividad);
};

const getActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  const estrategia = getEstrategia(actividad.tipo);
  const contenido  = estrategia.renderizar(actividad);
  res.json({ actividad, contenido });
};

const listarActividades = async (req, res) => {
  res.json(await Actividad.find());
};

const listarActividadesDisponibles = async (req, res) => {
  res.json(await Actividad.find({ estado: 'DISPONIBLE' }));
};

module.exports = { crearActividad, publicarActividad, archivarActividad, getActividad, listarActividades, listarActividadesDisponibles };
