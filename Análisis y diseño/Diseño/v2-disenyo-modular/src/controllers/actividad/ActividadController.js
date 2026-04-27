const Actividad = require('../../models/actividad/Actividad');

// V2 CORRECCIÓN (Misplaced Responsibility):
// publicar/archivar delegan en el modelo - el objeto sabe su ciclo de vida
// Los condicionales por tipo siguen presentes (se corregirán en V3 con OCP)

const crearActividad = async (req, res) => {
  const actividad = new Actividad(req.body);
  await actividad.save();
  res.status(201).json(actividad);
};

const publicarActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  actividad.publicar(); // V2: el modelo sabe publicarse
  await actividad.save();
  res.json(actividad);
};

const archivarActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  actividad.archivar(); // V2: el modelo sabe archivarse
  await actividad.save();
  res.json(actividad);
};

const getActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  // Condicional por tipo aún presente - se corrige en V3
  let contenido = {};
  if (actividad.tipo === 'PICTOGRAMA')
    contenido = { imagen: actividad.contenido?.urlImagen, etiqueta: actividad.contenido?.etiqueta };
  else if (actividad.tipo === 'AUDIO')
    contenido = { audio: actividad.contenido?.urlAudio, transcripcion: actividad.contenido?.texto };
  else if (actividad.tipo === 'TEXTO')
    contenido = { texto: actividad.contenido?.texto };
  res.json({ actividad, contenido });
};

const listarActividades = async (req, res) => {
  const actividades = await Actividad.find();
  res.json(actividades);
};

const listarActividadesDisponibles = async (req, res) => {
  const actividades = await Actividad.find({ estado: 'DISPONIBLE' });
  res.json(actividades);
};

module.exports = { crearActividad, publicarActividad, archivarActividad, getActividad, listarActividades, listarActividadesDisponibles };
