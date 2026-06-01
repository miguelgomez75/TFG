const Categoria = require('../../models/actividad/Categoria');

// RUP: listarCategorias() aparece en crearActividad() y editarActividad().
// CategoriaRepository.findAll() → aquí implementado con Mongoose.

const listarCategorias = async (req, res) => {
  try {
    res.json(await Categoria.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crearCategoria = async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listarCategorias, crearCategoria, editarCategoria };
