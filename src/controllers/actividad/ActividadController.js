const Actividad         = require('../../models/actividad/Actividad');
const { getEstrategia } = require('../../models/actividad/estrategias/RegistroEstrategias');

// OCP: sin if/else por tipo gracias al patrón Estrategia.

// CdU crearActividad: guardarActividad(titulo, descripcion, categoriaId, nivelDificultad)
const crearActividad = async (req, res) => {
  try {
    const actividad = new Actividad(req.body);
    await actividad.save();
    res.status(201).json(actividad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CdU editarActividad: actualizarActividad(actividad)
const editarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
    res.json(actividad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CdU eliminarActividad: deleteById
const eliminarActividad = async (req, res) => {
  try {
    await Actividad.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Actividad eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CdU publicarActividad: validarCampos + publicar + updateEstado(DISPONIBLE)
const publicarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
    const estrategia = getEstrategia(actividad.tipo);
    if (!estrategia.validar(actividad))
      return res.status(400).json({ error: 'Contenido incompleto para publicar' });
    actividad.publicar();
    await actividad.save();
    res.json(actividad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// CdU archivarActividad: updateEstado(ARCHIVADA)
const archivarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
    actividad.archivar();
    await actividad.save();
    res.json(actividad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// cargarActividad(actividadId): devuelve actividad + contenido renderizado si tiene contenido,
// o solo la actividad si aún es BORRADOR sin contenido (no lanza 500).
const getActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id).populate('categoriaId');
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

    // Solo renderizar si hay contenido — evita error 500 en borradores vacíos
    if (!actividad.contenido) return res.json({ actividad, contenido: null });

    try {
      const estrategia = getEstrategia(actividad.tipo);
      const contenido  = estrategia.renderizar(actividad);
      res.json({ actividad, contenido });
    } catch {
      // Tipo no registrado o contenido malformado: devolvemos la actividad sin renderizar
      res.json({ actividad, contenido: null });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// findAll — listar todas (logopeda)
const listarActividades = async (req, res) => {
  try {
    res.json(await Actividad.find().populate('categoriaId'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RUP: findDisponibles — usado en asignarActividad, crearRegistro, familia
const listarDisponibles = async (req, res) => {
  try {
    res.json(await Actividad.find({ estado: 'DISPONIBLE' }).populate('categoriaId'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Alias semántico para rutas de familia
const listarActividadesDisponibles = listarDisponibles;

module.exports = {
  crearActividad,
  editarActividad,
  eliminarActividad,
  publicarActividad,
  archivarActividad,
  getActividad,
  listarActividades,
  listarDisponibles,
  listarActividadesDisponibles
};
