const mongoose = require('mongoose');

// RUP MVC general: TipoActividad aparece como modelo independiente.
// Permite gestionar los tipos (PICTOGRAMA, AUDIO, TEXTO, VIDEO…) sin
// tocar el enum de Actividad.
const tipoActividadSchema = new mongoose.Schema({
  codigo:      { type: String, required: true, unique: true },  // 'PICTOGRAMA'
  etiqueta:    { type: String, required: true },                 // 'Pictograma'
  descripcion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TipoActividad', tipoActividadSchema);
