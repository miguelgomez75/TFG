const mongoose = require('mongoose');

// RUP MVC general: Pictograma aparece como modelo propio.
// Representa los recursos visuales reutilizables entre actividades.
const pictogramaSchema = new mongoose.Schema({
  etiqueta:   { type: String, required: true },
  urlImagen:  { type: String, required: true },
  categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  activo:     { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Pictograma', pictogramaSchema);
