const mongoose = require('mongoose');

// RUP: CategoriaController.listarCategorias() y CategoriaRepository.findAll()
// aparecen en crearActividad() y editarActividad().
const categoriaSchema = new mongoose.Schema({
  nombre:      { type: String, required: true },
  descripcion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Categoria', categoriaSchema);
