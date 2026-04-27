const mongoose = require('mongoose');

// V1: Data class - sin métodos de negocio
// publicar/archivar se hacen directamente desde el controlador
const actividadSchema = new mongoose.Schema({
  titulo:          { type: String },
  descripcion:     { type: String },
  nivelDificultad: { type: Number },
  estado:          { type: String, default: 'BORRADOR' },
  categoriaId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  tipo:            { type: String },
  contenido:       { type: Object }
});

module.exports = mongoose.model('Actividad', actividadSchema);
