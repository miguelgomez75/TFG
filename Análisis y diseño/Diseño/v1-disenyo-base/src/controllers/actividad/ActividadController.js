const Actividad = require('../../models/actividad/Actividad');

// V1: condicional por tipo - viola OCP
// Cada nuevo tipo de actividad obliga a modificar este controlador

const crearActividad = async (req, res) => {
  const actividad = new Actividad(req.body);
  await actividad.save();
  res.status(201).json(actividad);
};

const publicarActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  // Lógica de transición en el controlador en lugar del modelo
  if (actividad.estado !== 'BORRADOR') return res.status(400).json({ error: 'Solo desde Borrador' });
  actividad.estado = 'DISPONIBLE';
  await actividad.save();
  res.json(actividad);
};

const archivarActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  actividad.estado = 'ARCHIVADA';
  await actividad.save();
  res.json(actividad);
};

const getActividad = async (req, res) => {
  const actividad = await Actividad.findById(req.params.id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

  // Condicional por tipo - viola OCP (abierto/cerrado)
  let contenido = {};
  if (actividad.tipo === 'PICTOGRAMA') {
    contenido = { imagen: actividad.contenido?.urlImagen, etiqueta: actividad.contenido?.etiqueta };
  } else if (actividad.tipo === 'AUDIO') {
    contenido = { audio: actividad.contenido?.urlAudio, transcripcion: actividad.contenido?.texto };
  } else if (actividad.tipo === 'TEXTO') {
    contenido = { texto: actividad.contenido?.texto };
  }

  res.json({ actividad, contenido });
};

const listarActividades = async (req, res) => {
  const actividades = await Actividad.find();
  res.json(actividades);
};

module.exports = { crearActividad, publicarActividad, archivarActividad, getActividad, listarActividades };
